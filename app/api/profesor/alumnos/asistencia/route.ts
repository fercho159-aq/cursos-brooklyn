import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

// OBTENER el estado actual de la asistencia de los alumnos para hoy
export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const today = new Date().toLocaleDateString('en-CA');

    const asistenciasRes = await pool.query(`
      SELECT alumno_id, estado 
      FROM asistencias_alumnos 
      WHERE profesor_id = $1 AND fecha = $2
    `, [usuario.id, today]);

    const asistenciasMap = asistenciasRes.rows.reduce((acc: any, row: any) => {
      acc[row.alumno_id] = row.estado;
      return acc;
    }, {});

    return NextResponse.json(asistenciasMap);
  } catch (error) {
    console.error('Error al obtener asistencias alumnos:', error);
    return NextResponse.json({ error: 'Error al obtener asistencias' }, { status: 500 });
  }
}

// MARCAR ASISTENCIA MASIVA O INDIVIDUAL
export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { alumnos, grupo_id } = await request.json(); // { alumno_id: 'presente' | 'ausente' }

    if (!alumnos || !grupo_id || typeof alumnos !== 'object') {
      return NextResponse.json({ error: 'Datos incompletos.' }, { status: 400 });
    }

    const today = new Date().toLocaleDateString('en-CA');

    // Usamos una transaccion
    const client = await pool.connect();
    try {
      await client.query('BEGIN');

      for (const [alumno_id, estado] of Object.entries(alumnos)) {
        await client.query(`
          INSERT INTO asistencias_alumnos (alumno_id, grupo_id, profesor_id, fecha, estado)
          VALUES ($1, $2, $3, $4, $5)
          ON CONFLICT (alumno_id, fecha)
          DO UPDATE SET estado = EXCLUDED.estado, profesor_id = EXCLUDED.profesor_id
        `, [alumno_id, grupo_id, usuario.id, today, estado]);
      }

      await client.query('COMMIT');
    } catch (e) {
      await client.query('ROLLBACK');
      throw e;
    } finally {
      client.release();
    }

    return NextResponse.json({ message: 'Asistencia guardada correctamente' }, { status: 200 });
  } catch (error) {
    console.error('Error al guardar asistencias:', error);
    return NextResponse.json({ error: 'Error al marcar asistencia' }, { status: 500 });
  }
}
