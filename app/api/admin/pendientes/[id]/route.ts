import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

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

    const allowedFields = ['titulo', 'descripcion', 'categoria', 'prioridad', 'completado', 'fecha_limite'];
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

    // Validar categoria si se está actualizando
    if (body.categoria) {
      const categoriasValidas = ['Operaciones', 'Marketing', 'Ventas', 'Administrativo'];
      if (!categoriasValidas.includes(body.categoria)) {
        return NextResponse.json({ error: 'Categoría no válida' }, { status: 400 });
      }
    }

    // Validar prioridad si se está actualizando
    if (body.prioridad) {
      const prioridadesValidas = ['Urgente', 'Moderado', 'No urge'];
      if (!prioridadesValidas.includes(body.prioridad)) {
        return NextResponse.json({ error: 'Prioridad no válida' }, { status: 400 });
      }
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
    const result = await pool.query('DELETE FROM pendientes WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pendiente no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Pendiente eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pendiente:', error);
    return NextResponse.json({ error: 'Error al eliminar pendiente' }, { status: 500 });
  }
}
