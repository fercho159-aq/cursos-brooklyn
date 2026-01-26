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
    const tipoCurso = searchParams.get('tipo_curso');
    const cursoNombre = searchParams.get('curso_nombre');
    const modulo = searchParams.get('modulo');

    let query = `
      SELECT id, tipo_curso, curso_nombre, modulo, numero_leccion,
             titulo, descripcion, video_url, duracion_minutos, orden, activo
      FROM lecciones
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (tipoCurso) {
      query += ` AND tipo_curso = $${paramIndex}`;
      params.push(tipoCurso);
      paramIndex++;
    }

    if (cursoNombre) {
      query += ` AND curso_nombre = $${paramIndex}`;
      params.push(cursoNombre);
      paramIndex++;
    }

    if (modulo) {
      query += ` AND modulo = $${paramIndex}`;
      params.push(parseInt(modulo));
      paramIndex++;
    }

    query += ` ORDER BY tipo_curso, curso_nombre, modulo, orden, numero_leccion`;

    const result = await pool.query(query, params);

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener lecciones:', error);
    return NextResponse.json({ error: 'Error al obtener lecciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      tipo_curso, curso_nombre, modulo, numero_leccion,
      titulo, descripcion, video_url, duracion_minutos, orden, activo
    } = body;

    if (!tipo_curso || !curso_nombre || !titulo) {
      return NextResponse.json(
        { error: 'tipo_curso, curso_nombre y titulo son requeridos' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, descripcion, video_url, duracion_minutos, orden, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        tipo_curso,
        curso_nombre,
        modulo || 1,
        numero_leccion || 1,
        titulo,
        descripcion || '',
        video_url || null,
        duracion_minutos || null,
        orden || 1,
        activo !== false
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear leccion:', error);
    return NextResponse.json({ error: 'Error al crear leccion' }, { status: 500 });
  }
}
