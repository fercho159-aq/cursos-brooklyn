import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Buscamos cualquier grupo al que esté asignado (directamente o por horario)
    const gruposRes = await pool.query(
      `SELECT DISTINCT g.id, g.nombre, g.dias, g.turno, g.horario
       FROM grupos g
       LEFT JOIN grupo_horarios_profesores ghp ON g.id = ghp.grupo_id
       WHERE g.profesor_id = $1 OR ghp.profesor_id = $1
       LIMIT 1`,
      [usuario.id]
    );

    if (gruposRes.rows.length === 0) {
      return NextResponse.json({
        grupo: null,
        alumnos: []
      });
    }

    const grupo = gruposRes.rows[0];

    // Obtener los alumnos respetando la asignación
    const alumnosRes = await pool.query(
      `SELECT u.id, u.nombre, u.email, u.celular, u.estado, u.genero, u.turno, u.horario, u.grupo_id
       FROM usuarios u
       JOIN grupos g ON u.grupo_id = g.id
       WHERE u.activo = true 
         AND (u.estado IS NULL OR LOWER(u.estado) NOT IN ('inactivo', 'cancelado'))
         AND u.rol = 'alumno'
         AND $1 = COALESCE(
             (SELECT profesor_id FROM grupo_horarios_profesores ghp 
              WHERE ghp.grupo_id = u.grupo_id 
                AND ghp.turno = COALESCE(u.turno, '') 
                AND ghp.horario = COALESCE(u.horario, '')),
             g.profesor_id
         )
       ORDER BY u.nombre`,
      [usuario.id]
    );

    return NextResponse.json({
      grupo,
      alumnos: alumnosRes.rows
    });
  } catch (error) {
    console.error('Error al obtener grupo del profesor:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
