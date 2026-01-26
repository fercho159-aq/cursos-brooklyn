import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const totalAlumnos = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'alumno'");
    const inscripcionesActivas = await pool.query("SELECT COUNT(*) FROM inscripciones WHERE estado = 'activo'");
    const pagosHoy = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE DATE(fecha_pago) = CURRENT_DATE");
    const pagosMes = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE EXTRACT(MONTH FROM fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE)");
    const saldoPendiente = await pool.query("SELECT COALESCE(SUM(saldo_pendiente), 0) as total FROM inscripciones WHERE estado = 'activo'");
    const totalLecciones = await pool.query("SELECT COUNT(*) FROM lecciones");
    const leccionesSinVideo = await pool.query("SELECT COUNT(*) FROM lecciones WHERE video_url IS NULL OR video_url = ''");

    return NextResponse.json({
      totalAlumnos: parseInt(totalAlumnos.rows[0].count),
      inscripcionesActivas: parseInt(inscripcionesActivas.rows[0].count),
      pagosHoy: parseFloat(pagosHoy.rows[0].total),
      pagosMes: parseFloat(pagosMes.rows[0].total),
      saldoPendiente: parseFloat(saldoPendiente.rows[0].total),
      totalLecciones: parseInt(totalLecciones.rows[0].count),
      leccionesSinVideo: parseInt(leccionesSinVideo.rows[0].count)
    });
  } catch (error) {
    console.error('Error al obtener estadisticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadisticas' }, { status: 500 });
  }
}
