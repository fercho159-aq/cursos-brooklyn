import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    // Obtener las lecciones de los cursos en los que está inscrito el alumno
    const result = await pool.query(`
      SELECT DISTINCT l.id, l.tipo_curso, l.curso_nombre, l.modulo, l.numero_leccion,
             l.titulo, l.descripcion, l.video_url, l.duracion_minutos, l.orden
      FROM lecciones l
      INNER JOIN cursos c ON l.tipo_curso = c.nombre
      INNER JOIN inscripciones i ON i.curso_id = c.id
      WHERE i.usuario_id = $1 AND i.estado = 'activo' AND l.activo = true
      ORDER BY l.tipo_curso, l.curso_nombre, l.modulo, l.orden, l.numero_leccion
    `, [usuario.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener lecciones:', error);
    return NextResponse.json({ error: 'Error al obtener lecciones' }, { status: 500 });
  }
}
