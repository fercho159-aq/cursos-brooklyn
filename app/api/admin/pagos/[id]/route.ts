import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

// Route handler for /api/admin/pagos/[id]
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
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

    const allowedFields = ['monto', 'metodo_pago', 'comprobante', 'notas', 'fecha_pago'];
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
    const query = `UPDATE pagos SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar pago:', error);
    return NextResponse.json({ error: 'Error al actualizar pago' }, { status: 500 });
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

    // Obtener el pago antes de eliminarlo para actualizar el saldo
    const pagoResult = await pool.query('SELECT * FROM pagos WHERE id = $1', [id]);
    if (pagoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    const pago = pagoResult.rows[0];

    // Eliminar el pago
    await pool.query('DELETE FROM pagos WHERE id = $1', [id]);

    // Revertir el saldo pendiente
    await pool.query(
      `UPDATE inscripciones SET saldo_pendiente = saldo_pendiente + $1 WHERE id = $2`,
      [pago.monto, pago.inscripcion_id]
    );

    return NextResponse.json({ message: 'Pago eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar pago:', error);
    return NextResponse.json({ error: 'Error al eliminar pago' }, { status: 500 });
  }
}
