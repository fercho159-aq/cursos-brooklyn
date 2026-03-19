import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const fecha = searchParams.get('fecha') || new Date().toLocaleDateString('en-CA');

    // 1. Asistencias de Profesores
    const profesoresQuery = await pool.query(`
      SELECT p.id, p.nombre, a.hora_entrada, a.hora_salida
      FROM usuarios p
      LEFT JOIN asistencias_profesores a ON p.id = a.profesor_id AND a.fecha = $1
      WHERE p.rol = 'profesor'
      ORDER BY p.nombre
    `, [fecha]);

    // 2. Asistencias de Alumnos
    const alumnosQuery = await pool.query(`
      SELECT al.id, al.nombre, al.celular, g.nombre as grupo_nombre, 
             COALESCE(p_actual.nombre, p_asignado.nombre, p_grupo.nombre) as profesor_nombre, 
             a.estado
      FROM usuarios al
      LEFT JOIN asistencias_alumnos a ON al.id = a.alumno_id AND a.fecha = $1
      LEFT JOIN grupos g ON al.grupo_id = g.id
      LEFT JOIN usuarios p_actual ON a.profesor_id = p_actual.id
      LEFT JOIN grupo_horarios_profesores ghp ON al.grupo_id = ghp.grupo_id AND COALESCE(al.turno,'') = ghp.turno AND COALESCE(al.horario,'') = ghp.horario
      LEFT JOIN usuarios p_asignado ON ghp.profesor_id = p_asignado.id
      LEFT JOIN usuarios p_grupo ON g.profesor_id = p_grupo.id
      WHERE al.rol = 'alumno' AND al.grupo_id IS NOT NULL AND al.activo = true
      ORDER BY g.nombre, al.nombre
    `, [fecha]);

    return NextResponse.json({
      profesores: profesoresQuery.rows,
      alumnos: alumnosQuery.rows,
      fecha
    });
  } catch (error) {
    console.error('Error al obtener reporte de asistencias:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
