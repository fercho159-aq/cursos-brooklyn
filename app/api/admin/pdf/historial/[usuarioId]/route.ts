import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import { generarHistorialPagos } from '@/lib/pdf/templates/historial-pagos';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ usuarioId: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { usuarioId } = await params;

  try {
    // Obtener datos del alumno
    const alumnoResult = await pool.query(
      `SELECT id, nombre, celular, email FROM usuarios WHERE id = $1`,
      [parseInt(usuarioId)]
    );

    if (alumnoResult.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    const alumno = alumnoResult.rows[0];

    // Obtener inscripciones activas
    const inscripcionesResult = await pool.query(
      `SELECT
        i.id, i.costo_total, i.saldo_pendiente, i.estado,
        COALESCE(i.nombre_curso_especifico, c.nombre) as curso_nombre
       FROM inscripciones i
       JOIN cursos c ON i.curso_id = c.id
       WHERE i.usuario_id = $1 AND i.estado = 'activo'
       ORDER BY i.created_at DESC`,
      [parseInt(usuarioId)]
    );

    // Obtener todos los pagos del usuario
    const pagosResult = await pool.query(
      `SELECT
        p.id, p.monto, p.metodo_pago, p.fecha_pago,
        COALESCE(i.nombre_curso_especifico, c.nombre) as curso_nombre
       FROM pagos p
       JOIN inscripciones i ON p.inscripcion_id = i.id
       JOIN cursos c ON i.curso_id = c.id
       WHERE p.usuario_id = $1
       ORDER BY p.fecha_pago DESC`,
      [parseInt(usuarioId)]
    );

    const datosHistorial = {
      alumno: {
        id: alumno.id,
        nombre: alumno.nombre,
        celular: alumno.celular,
        email: alumno.email
      },
      inscripciones: inscripcionesResult.rows.map(row => ({
        id: row.id,
        curso_nombre: row.curso_nombre,
        costo_total: parseFloat(row.costo_total),
        saldo_pendiente: parseFloat(row.saldo_pendiente),
        estado: row.estado
      })),
      pagos: pagosResult.rows.map(row => ({
        id: row.id,
        monto: parseFloat(row.monto),
        metodo_pago: row.metodo_pago,
        fecha_pago: row.fecha_pago,
        curso_nombre: row.curso_nombre
      }))
    };

    const doc = generarHistorialPagos(datosHistorial);
    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="historial-${usuarioId}.pdf"`
      }
    });
  } catch (error) {
    console.error('Error al generar historial PDF:', error);
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 });
  }
}
