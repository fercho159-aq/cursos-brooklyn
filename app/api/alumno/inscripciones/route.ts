import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const result = await pool.query(`
      SELECT i.*,
             c.nombre as curso_nombre,
             h.nombre as horario_nombre,
             COALESCE(i.nombre_curso_especifico, c.nombre) as curso_display
      FROM inscripciones i
      LEFT JOIN cursos c ON i.curso_id = c.id
      LEFT JOIN horarios h ON i.horario_id = h.id
      WHERE i.usuario_id = $1 AND i.estado = 'activo'
      ORDER BY i.created_at DESC
    `, [usuario.id]);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}
