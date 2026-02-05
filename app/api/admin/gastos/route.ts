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
    const tipo = searchParams.get('tipo');
    const mes = searchParams.get('mes');

    let query = `
      SELECT g.*, u.nombre as registrado_por_nombre
      FROM gastos g
      LEFT JOIN usuarios u ON g.registrado_por = u.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (tipo) {
      query += ` AND g.tipo = $${paramIndex}`;
      params.push(tipo);
      paramIndex++;
    }

    if (mes) {
      query += ` AND EXTRACT(MONTH FROM g.fecha) = $${paramIndex}`;
      params.push(parseInt(mes));
      paramIndex++;
    }

    query += ` ORDER BY g.fecha DESC, g.id DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { tipo, descripcion, monto, fecha } = body;

    if (!tipo || !monto) {
      return NextResponse.json({ error: 'tipo y monto son requeridos' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO gastos (tipo, descripcion, monto, fecha, registrado_por)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [tipo, descripcion || '', monto, fecha || new Date().toISOString(), usuario.id]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear gasto:', error);
    return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 });
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

    const result = await pool.query('DELETE FROM gastos WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Gasto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Gasto eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar gasto:', error);
    return NextResponse.json({ error: 'Error al eliminar gasto' }, { status: 500 });
  }
}
