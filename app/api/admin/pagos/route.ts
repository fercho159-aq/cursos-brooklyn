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
    const inscripcion_id = searchParams.get('inscripcion_id');
    const usuario_id = searchParams.get('usuario_id');

    let query = `
      SELECT p.*, u.nombre as usuario_nombre, u.celular as usuario_celular,
             r.nombre as registrado_por_nombre
      FROM pagos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      LEFT JOIN usuarios r ON p.registrado_por = r.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (inscripcion_id) {
      query += ` AND p.inscripcion_id = $${paramIndex}`;
      params.push(parseInt(inscripcion_id));
      paramIndex++;
    }

    if (usuario_id) {
      query += ` AND p.usuario_id = $${paramIndex}`;
      params.push(parseInt(usuario_id));
      paramIndex++;
    }

    query += ` ORDER BY p.fecha_pago DESC, p.id DESC`;

    const result = await pool.query(query, params);
    // Convertir montos a números
    const pagos = result.rows.map(row => ({
      ...row,
      monto: parseFloat(row.monto)
    }));
    return NextResponse.json(pagos);
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    return NextResponse.json({ error: 'Error al obtener pagos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { inscripcion_id, usuario_id, monto, metodo_pago, comprobante, notas, fecha_pago } = body;

    if (!inscripcion_id || !usuario_id || !monto) {
      return NextResponse.json({ error: 'inscripcion_id, usuario_id y monto son requeridos' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, comprobante, notas, fecha_pago, registrado_por)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        inscripcion_id, usuario_id, monto, metodo_pago || 'efectivo',
        comprobante || null, notas || null, fecha_pago || new Date().toISOString(), usuario.id
      ]
    );

    // Actualizar saldo pendiente de la inscripcion
    await pool.query(
      `UPDATE inscripciones SET saldo_pendiente = saldo_pendiente - $1 WHERE id = $2`,
      [monto, inscripcion_id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear pago:', error);
    return NextResponse.json({ error: 'Error al crear pago' }, { status: 500 });
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
