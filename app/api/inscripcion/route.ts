import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcryptjs';

// GET: Obtener cursos y horarios disponibles (público)
export async function GET() {
  try {
    const [cursosRes, horariosRes] = await Promise.all([
      pool.query('SELECT id, nombre, descripcion, costo FROM cursos WHERE activo = true ORDER BY nombre'),
      pool.query('SELECT id, nombre, dias, hora_inicio, hora_fin FROM horarios WHERE activo = true ORDER BY id')
    ]);

    return NextResponse.json({
      cursos: cursosRes.rows,
      horarios: horariosRes.rows
    });
  } catch (error) {
    console.error('Error al obtener datos:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}

// POST: Registrar usuario e inscripción (público)
export async function POST(request: Request) {
  const client = await pool.connect();

  try {
    const body = await request.json();
    const {
      nombre,
      celular,
      email,
      edad,
      curso_id,
      horario_id,
      horario_otro,
      notas
    } = body;

    // Validaciones
    if (!nombre || !celular || !curso_id) {
      return NextResponse.json(
        { error: 'Nombre, celular y curso son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de celular (10 dígitos)
    const celularLimpio = celular.replace(/\D/g, '');
    if (celularLimpio.length < 10) {
      return NextResponse.json(
        { error: 'El celular debe tener al menos 10 dígitos' },
        { status: 400 }
      );
    }

    await client.query('BEGIN');

    // Verificar si el usuario ya existe
    const existingUser = await client.query(
      'SELECT id FROM usuarios WHERE celular = $1',
      [celularLimpio]
    );

    let usuario_id: number;

    if (existingUser.rows.length > 0) {
      // Usuario ya existe, usar su ID
      usuario_id = existingUser.rows[0].id;
    } else {
      // Crear nuevo usuario
      const hashedPassword = await bcrypt.hash(celularLimpio, 10);

      const userResult = await client.query(
        `INSERT INTO usuarios (nombre, celular, email, edad, password, rol, activo)
         VALUES ($1, $2, $3, $4, $5, 'alumno', true)
         RETURNING id`,
        [nombre, celularLimpio, email || null, edad || null, hashedPassword]
      );

      usuario_id = userResult.rows[0].id;
    }

    // Obtener costo del curso
    const cursoResult = await client.query(
      'SELECT costo FROM cursos WHERE id = $1',
      [curso_id]
    );

    if (cursoResult.rows.length === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ error: 'Curso no encontrado' }, { status: 400 });
    }

    const costoTotal = cursoResult.rows[0].costo || 1900;

    // Crear inscripción
    const inscripcionResult = await client.query(
      `INSERT INTO inscripciones (
        usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin, costo_total,
        saldo_pendiente, estado, notas, horario_otro, modulo_numero
      )
       VALUES ($1, $2, $3, CURRENT_DATE, CURRENT_DATE + INTERVAL '28 days', $4, $5, 'activo', $6, $7, 1)
       RETURNING id`,
      [
        usuario_id,
        curso_id,
        horario_id || null,
        costoTotal,
        costoTotal,
        notas || null,
        horario_otro || null
      ]
    );

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      message: 'Inscripcion registrada exitosamente',
      usuario_id,
      inscripcion_id: inscripcionResult.rows[0].id,
      credenciales: {
        celular: celularLimpio,
        password: 'Tu numero de celular (puedes cambiarlo despues)'
      }
    }, { status: 201 });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error al registrar inscripcion:', error);
    return NextResponse.json(
      { error: 'Error al procesar la inscripcion' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
