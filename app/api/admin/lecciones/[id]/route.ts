import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await pool.query(
      `SELECT id, tipo_curso, curso_nombre, modulo, numero_leccion,
              titulo, descripcion, video_url, duracion_minutos, orden, activo
       FROM lecciones WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leccion no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener leccion:', error);
    return NextResponse.json({ error: 'Error al obtener leccion' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      'tipo_curso', 'curso_nombre', 'modulo', 'numero_leccion',
      'titulo', 'descripcion', 'video_url', 'duracion_minutos', 'orden', 'activo'
    ];

    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE lecciones SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leccion no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar leccion:', error);
    return NextResponse.json({ error: 'Error al actualizar leccion' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await pool.query(
      'DELETE FROM lecciones WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Leccion no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Leccion eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar leccion:', error);
    return NextResponse.json({ error: 'Error al eliminar leccion' }, { status: 500 });
  }
}
