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
    const categoria = searchParams.get('categoria');
    const prioridad = searchParams.get('prioridad');
    const completado = searchParams.get('completado');

    let query = `
      SELECT p.*, u.nombre as registrado_por_nombre
      FROM pendientes p
      LEFT JOIN usuarios u ON p.registrado_por = u.id
      WHERE 1=1
    `;
    const params: (string | number | boolean)[] = [];
    let paramIndex = 1;

    if (categoria) {
      query += ` AND p.categoria = $${paramIndex}`;
      params.push(categoria);
      paramIndex++;
    }

    if (prioridad) {
      query += ` AND p.prioridad = $${paramIndex}`;
      params.push(prioridad);
      paramIndex++;
    }

    if (completado !== null && completado !== '') {
      query += ` AND p.completado = $${paramIndex}`;
      params.push(completado === 'true');
      paramIndex++;
    }

    query += ` ORDER BY
      CASE p.prioridad
        WHEN 'Urgente' THEN 1
        WHEN 'Moderado' THEN 2
        WHEN 'No urge' THEN 3
      END,
      p.completado ASC,
      p.fecha_limite ASC NULLS LAST,
      p.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener pendientes:', error);
    return NextResponse.json({ error: 'Error al obtener pendientes' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { titulo, descripcion, categoria, prioridad, fecha_limite } = body;

    if (!titulo || !categoria || !prioridad) {
      return NextResponse.json({ error: 'titulo, categoria y prioridad son requeridos' }, { status: 400 });
    }

    const categoriasValidas = ['Operaciones', 'Marketing', 'Ventas', 'Administrativo'];
    const prioridadesValidas = ['Urgente', 'Moderado', 'No urge'];

    if (!categoriasValidas.includes(categoria)) {
      return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });
    }

    if (!prioridadesValidas.includes(prioridad)) {
      return NextResponse.json({ error: 'Prioridad no válida' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO pendientes (titulo, descripcion, categoria, prioridad, fecha_limite, registrado_por)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [titulo, descripcion || '', categoria, prioridad, fecha_limite || null, usuario.id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear pendiente:', error);
    return NextResponse.json({ error: 'Error al crear pendiente' }, { status: 500 });
  }
}
