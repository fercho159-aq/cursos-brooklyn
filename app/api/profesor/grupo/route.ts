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
      `SELECT g.id, g.nombre, g.dias, 
              COALESCE((SELECT turno FROM grupo_horarios_profesores WHERE grupo_id = g.id AND profesor_id = $1 LIMIT 1), g.turno) as turno,
              COALESCE((SELECT horario FROM grupo_horarios_profesores WHERE grupo_id = g.id AND profesor_id = $1 LIMIT 1), g.horario) as horario
       FROM grupos g
       WHERE g.profesor_id = $1 
          OR EXISTS (SELECT 1 FROM grupo_horarios_profesores WHERE grupo_id = g.id AND profesor_id = $1)
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
         AND (
             EXISTS (
                 SELECT 1 FROM grupo_horarios_profesores ghp
                 WHERE ghp.grupo_id = u.grupo_id 
                   AND ghp.turno = COALESCE(u.turno, '') 
                   AND ghp.horario = COALESCE(u.horario, '')
                   AND ghp.profesor_id = $1
             )
             OR
             (
                 $1 = g.profesor_id
                 AND NOT EXISTS (
                     SELECT 1 FROM grupo_horarios_profesores ghp
                     WHERE ghp.grupo_id = u.grupo_id 
                       AND ghp.turno = COALESCE(u.turno, '') 
                       AND ghp.horario = COALESCE(u.horario, '')
                 )
                 AND NOT EXISTS (
                     SELECT 1 FROM grupo_horarios_profesores ghp
                     WHERE ghp.grupo_id = u.grupo_id
                       AND ghp.profesor_id = $1
                 )
             )
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
