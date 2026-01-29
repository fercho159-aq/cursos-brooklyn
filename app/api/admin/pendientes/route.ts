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

export async function PATCH(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const body = await request.json();
    const allowedFields = ['titulo', 'descripcion', 'categoria', 'prioridad', 'fecha_limite', 'completado'];
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field] === '' ? null : body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE pendientes SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pendiente no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar pendiente:', error);
    return NextResponse.json({ error: 'Error al actualizar pendiente' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const result = await pool.query('DELETE FROM pendientes WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pendiente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pendiente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pendiente:', error);
    return NextResponse.json({ error: 'Error al eliminar pendiente' }, { status: 500 });
  }
}
