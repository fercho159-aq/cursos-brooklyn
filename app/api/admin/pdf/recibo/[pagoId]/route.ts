import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import { generarReciboPago } from '@/lib/pdf/templates/recibo-pago';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ pagoId: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { pagoId } = await params;

  try {
    // Obtener datos del pago con alumno e inscripcion
    const result = await pool.query(
      `SELECT
        p.id, p.monto, p.metodo_pago, p.fecha_pago, p.comprobante, p.notas,
        u.nombre as alumno_nombre, u.celular as alumno_celular,
        i.id as inscripcion_id, i.costo_total, i.saldo_pendiente,
        COALESCE(i.nombre_curso_especifico, c.nombre) as curso_nombre
       FROM pagos p
       JOIN usuarios u ON p.usuario_id = u.id
       JOIN inscripciones i ON p.inscripcion_id = i.id
       JOIN cursos c ON i.curso_id = c.id
       WHERE p.id = $1`,
      [parseInt(pagoId)]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Pago no encontrado' }, { status: 404 });
    }

    const row = result.rows[0];

    const datosRecibo = {
      pago: {
        id: row.id,
        monto: parseFloat(row.monto),
        metodo_pago: row.metodo_pago,
        fecha_pago: row.fecha_pago,
        comprobante: row.comprobante,
        notas: row.notas
      },
      alumno: {
        nombre: row.alumno_nombre,
        celular: row.alumno_celular
      },
      inscripcion: {
        id: row.inscripcion_id,
        curso_nombre: row.curso_nombre,
        costo_total: parseFloat(row.costo_total),
        saldo_pendiente: parseFloat(row.saldo_pendiente)
      }
    };

    const doc = generarReciboPago(datosRecibo);
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="recibo-${pagoId}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error al generar recibo PDF:', error);
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 });
  }
}
