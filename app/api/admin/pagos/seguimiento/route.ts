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
    const mes = parseInt(searchParams.get('mes') || String(new Date().getMonth() + 1));
    const año = parseInt(searchParams.get('año') || String(new Date().getFullYear()));

    // Query to get all active inscriptions with their payments for the selected month
    const result = await pool.query(
      `SELECT
        i.id as inscripcion_id,
        i.usuario_id,
        u.nombre as usuario_nombre,
        u.celular as usuario_celular,
        COALESCE(i.nombre_curso_especifico, c.nombre) as curso,
        i.saldo_pendiente,
        COALESCE(SUM(CASE
          WHEN EXTRACT(MONTH FROM p.fecha_pago) = $1
          AND EXTRACT(YEAR FROM p.fecha_pago) = $2
          THEN p.monto ELSE 0
        END), 0) as pago_mes
      FROM inscripciones i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN cursos c ON i.curso_id = c.id
      LEFT JOIN pagos p ON p.inscripcion_id = i.id
      WHERE i.estado = 'activo'
      GROUP BY i.id, i.usuario_id, u.nombre, u.celular, i.nombre_curso_especifico, c.nombre, i.saldo_pendiente
      ORDER BY pago_mes ASC, u.nombre ASC`,
      [mes, año]
    );

    // Get detailed payments for the month for each inscription
    const pagosDetalle = await pool.query(
      `SELECT p.id, p.inscripcion_id, p.monto, p.fecha_pago, p.metodo_pago
       FROM pagos p
       WHERE EXTRACT(MONTH FROM p.fecha_pago) = $1
       AND EXTRACT(YEAR FROM p.fecha_pago) = $2
       ORDER BY p.fecha_pago DESC`,
      [mes, año]
    );

    // Create a map of payments by inscription_id
    const pagosMap: Record<number, Array<{id: number, monto: number, fecha: string, metodo: string}>> = {};
    for (const pago of pagosDetalle.rows) {
      if (!pagosMap[pago.inscripcion_id]) {
        pagosMap[pago.inscripcion_id] = [];
      }
      pagosMap[pago.inscripcion_id].push({
        id: pago.id,
        monto: parseFloat(pago.monto),
        fecha: pago.fecha_pago,
        metodo: pago.metodo_pago
      });
    }

    // Build response with detailed payments
    const alumnos = result.rows.map(row => ({
      inscripcion_id: row.inscripcion_id,
      usuario_id: row.usuario_id,
      usuario_nombre: row.usuario_nombre,
      usuario_celular: row.usuario_celular,
      curso: row.curso,
      pago_mes: parseFloat(row.pago_mes),
      saldo_pendiente: parseFloat(row.saldo_pendiente),
      pagos_detalle: pagosMap[row.inscripcion_id] || []
    }));

    // Calculate summary
    const alumnosPagaron = alumnos.filter(a => a.pago_mes > 0).length;
    const alumnosSinPago = alumnos.filter(a => a.pago_mes === 0).length;
    const totalRecaudado = alumnos.reduce((sum, a) => sum + a.pago_mes, 0);

    return NextResponse.json({
      resumen: {
        total_alumnos: alumnos.length,
        alumnos_pagaron: alumnosPagaron,
        alumnos_sin_pago: alumnosSinPago,
        total_recaudado: totalRecaudado
      },
      alumnos
    });
  } catch (error) {
    console.error('Error al obtener seguimiento:', error);
    return NextResponse.json({ error: 'Error al obtener seguimiento' }, { status: 500 });
  }
}
