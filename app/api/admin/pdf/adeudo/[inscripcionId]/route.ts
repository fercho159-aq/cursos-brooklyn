import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import { generarNotaAdeudo } from '@/lib/pdf/templates/nota-adeudo';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ inscripcionId: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { inscripcionId } = await params;

  try {
    // Obtener datos de la inscripcion con alumno y curso
    const inscripcionResult = await pool.query(
      `SELECT
        i.id, i.costo_total, i.saldo_pendiente, i.fecha_inicio,
        COALESCE(i.nombre_curso_especifico, c.nombre) as curso_nombre,
        u.nombre as alumno_nombre, u.celular as alumno_celular
       FROM inscripciones i
       JOIN usuarios u ON i.usuario_id = u.id
       JOIN cursos c ON i.curso_id = c.id
       WHERE i.id = $1`,
      [parseInt(inscripcionId)]
    );

    if (inscripcionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripcion no encontrada' }, { status: 404 });
    }

    const inscripcion = inscripcionResult.rows[0];

    if (parseFloat(inscripcion.saldo_pendiente) <= 0) {
      return NextResponse.json({ error: 'Esta inscripcion no tiene saldo pendiente' }, { status: 400 });
    }

    // Obtener pagos de esta inscripcion
    const pagosResult = await pool.query(
      `SELECT id, monto, fecha_pago, metodo_pago
       FROM pagos
       WHERE inscripcion_id = $1
       ORDER BY fecha_pago DESC`,
      [parseInt(inscripcionId)]
    );

    const datosAdeudo = {
      alumno: {
        nombre: inscripcion.alumno_nombre,
        celular: inscripcion.alumno_celular
      },
      inscripcion: {
        id: inscripcion.id,
        curso_nombre: inscripcion.curso_nombre,
        costo_total: parseFloat(inscripcion.costo_total),
        saldo_pendiente: parseFloat(inscripcion.saldo_pendiente),
        fecha_inicio: inscripcion.fecha_inicio
      },
      pagos: pagosResult.rows.map(row => ({
        id: row.id,
        monto: parseFloat(row.monto),
        fecha_pago: row.fecha_pago,
        metodo_pago: row.metodo_pago
      }))
    };

    const doc = generarNotaAdeudo(datosAdeudo);
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="adeudo-${inscripcionId}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error al generar nota de adeudo PDF:', error);
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 });
  }
}
