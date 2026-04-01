import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const adminUsuario = await getUsuarioFromRequest(request);

  if (!adminUsuario || adminUsuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const client = await pool.connect();

  try {
    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    await client.query('BEGIN');

    // Múltiples queries, usar el pool connect asegurando el COMMIT o ROLLBACK

    // 1. Obtener prospecto
    const resultProspecto = await client.query(
      `SELECT * FROM clase_muestra_registros WHERE id = $1`,
      [id]
    );

    if (resultProspecto.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Registro no encontrado' }, { status: 404 });
    }

    const { nombre, celular, email, edad, fecha_cumpleanos, genero, estado } = resultProspecto.rows[0];

    if (estado === 'inscrito') {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Este prospecto ya fue inscrito' }, { status: 400 });
    }

    // 2. Revisar si celular ya existe como usuario (evitar duplicados)
    const resultExistente = await client.query(
      `SELECT id FROM usuarios WHERE celular = $1`,
      [celular]
    );

    if (resultExistente.rows.length > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Ya existe un usuario con este mismo celular' }, { status: 400 });
    }

    // 3. Crear usuario
    const hashedPassword = await bcrypt.hash(celular, 10);
    const resultUsuario = await client.query(
      `INSERT INTO usuarios (
        nombre, celular, email, edad, fecha_cumpleanos, genero, password, rol, activo
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'alumno', true)
      RETURNING id, nombre`,
      [nombre, celular, email, edad, fecha_cumpleanos, genero, hashedPassword]
    );

    // 4. Actualizar estado a "inscrito" en clase_muestra_registros
    await client.query(
      `UPDATE clase_muestra_registros SET estado = 'inscrito' WHERE id = $1`,
      [id]
    );

    await client.query('COMMIT');

    return NextResponse.json(
      { message: 'Inscripción exitosa', usuario: resultUsuario.rows[0] },
      { status: 201 }
    );
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al inscribir prospecto:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al inscribir: ${errorMessage}` },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
