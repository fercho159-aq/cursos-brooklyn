import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

// OBTENER el estado actual de la asistencia del profe en el día de hoy
export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const today = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD local

    const asistenciaRes = await pool.query(`
      SELECT * FROM asistencias_profesores 
      WHERE profesor_id = $1 AND fecha = $2
      LIMIT 1
    `, [usuario.id, today]);

    return NextResponse.json(asistenciaRes.rows[0] || null);
  } catch (error) {
    console.error('Error al obtener asistencia:', error);
    return NextResponse.json({ error: 'Error al obtener asistencia' }, { status: 500 });
  }
}

// MARCAR ENTRADA O SALIDA
export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { tipo } = body; // 'entrada' o 'salida'

    const today = new Date().toLocaleDateString('en-CA');
    const nowLocal = new Date().toLocaleTimeString('en-GB', { hour12: false }); // Format HH:MM:SS

    if (tipo === 'entrada') {
      const res = await pool.query(`
        INSERT INTO asistencias_profesores (profesor_id, fecha, hora_entrada)
        VALUES ($1, $2, $3)
        ON CONFLICT (profesor_id, fecha) DO NOTHING
        RETURNING *
      `, [usuario.id, today, nowLocal]);

      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'Ya registraste entrada hoy.' }, { status: 400 });
      }
      return NextResponse.json(res.rows[0]);
    }

    if (tipo === 'salida') {
      const res = await pool.query(`
        UPDATE asistencias_profesores 
        SET hora_salida = $1
        WHERE profesor_id = $2 AND fecha = $3 AND hora_salida IS NULL
        RETURNING *
      `, [nowLocal, usuario.id, today]);

      if (res.rows.length === 0) {
        return NextResponse.json({ error: 'No tienes entrada registrada o ya saliste.' }, { status: 400 });
      }
      return NextResponse.json(res.rows[0]);
    }

    return NextResponse.json({ error: 'Tipo de marcaje inválido' }, { status: 400 });
  } catch (error) {
    console.error('Error al marcar asistencia:', error);
    return NextResponse.json({ error: 'Error al marcar asistencia' }, { status: 500 });
  }
}
