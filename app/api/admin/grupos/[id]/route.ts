import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Obtener grupo con sus alumnos
    const grupoResult = await pool.query('SELECT * FROM grupos WHERE id = $1', [id]);

    if (grupoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 });
    }

    const alumnosResult = await pool.query(`
      SELECT id, nombre, celular, turno, horario, estado
      FROM usuarios
      WHERE grupo_id = $1 AND rol = 'alumno'
      ORDER BY nombre
    `, [id]);

    return NextResponse.json({
      ...grupoResult.rows[0],
      alumnos: alumnosResult.rows
    });
  } catch (error) {
    console.error('Error al obtener grupo:', error);
    return NextResponse.json({ error: 'Error al obtener grupo' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = ['nombre', 'dias', 'turno', 'horario', 'color', 'activo'];
    const updates: string[] = [];
    const values: (string | boolean | null)[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field] === '' ? null : body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE grupos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar grupo:', error);
    return NextResponse.json({ error: 'Error al actualizar grupo' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;

    // Primero quitar el grupo de los usuarios
    await pool.query('UPDATE usuarios SET grupo_id = NULL WHERE grupo_id = $1', [id]);

    // Luego eliminar el grupo
    const result = await pool.query('DELETE FROM grupos WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Grupo no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Grupo eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar grupo:', error);
    return NextResponse.json({ error: 'Error al eliminar grupo' }, { status: 500 });
  }
}
