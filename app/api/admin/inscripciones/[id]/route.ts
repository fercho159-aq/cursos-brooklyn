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

    const allowedFields = [
      'usuario_id', 'curso_id', 'horario_id', 'fecha_inicio', 'fecha_fin',
      'costo_total', 'saldo_pendiente', 'estado', 'notas', 'nombre_curso_especifico',
      'horario_otro', 'modulo_numero', 'promocion'
    ];
    const updates: string[] = [];
    const values: (string | number | null)[] = [];
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
    const query = `UPDATE inscripciones SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripcion no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar inscripcion:', error);
    return NextResponse.json({ error: 'Error al actualizar inscripcion' }, { status: 500 });
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
    const result = await pool.query('DELETE FROM inscripciones WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripcion no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Inscripcion eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar inscripcion:', error);
    return NextResponse.json({ error: 'Error al eliminar inscripcion' }, { status: 500 });
  }
}
