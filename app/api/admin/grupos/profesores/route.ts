import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  // Asegurar que admin tenga acceso (y tal vez otros si es necesario, 
  // pero el panel de horarios es solo admin por ahora)
  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const result = await pool.query(
      `SELECT grupo_id, turno, horario, profesor_id 
       FROM grupo_horarios_profesores`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener asignaciones de profesores:', error);
    return NextResponse.json({ error: 'Error al obtener asignaciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { grupo_id, turno, horario, profesor_id } = body;

    if (!grupo_id || !turno || !horario) {
      return NextResponse.json({ error: 'Faltan parámetros requeridos' }, { status: 400 });
    }

    if (profesor_id) {
      // Upsert: Si ya existe una asignación para este horario, actualiza el profesor_id
      await pool.query(
        `INSERT INTO grupo_horarios_profesores (grupo_id, turno, horario, profesor_id)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (grupo_id, turno, horario) 
         DO UPDATE SET profesor_id = EXCLUDED.profesor_id`,
        [grupo_id, turno, horario, profesor_id]
      );
    } else {
      // Si se envía NULL o vacío como profesor, eliminamos la asignación específica 
      // (así hereda el profesor del grupo si lo hay, o se queda sin profe)
      await pool.query(
        `DELETE FROM grupo_horarios_profesores 
         WHERE grupo_id = $1 AND turno = $2 AND horario = $3`,
        [grupo_id, turno, horario]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al modificar asignacion:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
