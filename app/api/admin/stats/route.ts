import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // Estadisticas basicas
    const totalAlumnos = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'alumno'");
    const inscripcionesActivas = await pool.query("SELECT COUNT(*) FROM inscripciones WHERE estado = 'activo'");
    const pagosHoy = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE DATE(fecha_pago) = CURRENT_DATE");
    const pagosMes = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE EXTRACT(MONTH FROM fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha_pago) = EXTRACT(YEAR FROM CURRENT_DATE)");
    const saldoPendienteTotal = await pool.query("SELECT COALESCE(SUM(saldo_pendiente), 0) as total FROM inscripciones WHERE estado = 'activo'");
    const totalLecciones = await pool.query("SELECT COUNT(*) FROM lecciones");
    const leccionesSinVideo = await pool.query("SELECT COUNT(*) FROM lecciones WHERE video_url IS NULL OR video_url = ''");

    // Gastos del mes
    const gastosMes = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE EXTRACT(MONTH FROM fecha) = EXTRACT(MONTH FROM CURRENT_DATE) AND EXTRACT(YEAR FROM fecha) = EXTRACT(YEAR FROM CURRENT_DATE)");

    // Alumnos que NO han pagado este mes (inscripciones activas sin pago en el mes actual)
    const alumnosSinPagoMes = await pool.query(`
      SELECT COUNT(DISTINCT i.id) as count
      FROM inscripciones i
      WHERE i.estado = 'activo'
      AND NOT EXISTS (
        SELECT 1 FROM pagos p
        WHERE p.inscripcion_id = i.id
        AND EXTRACT(MONTH FROM p.fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE)
        AND EXTRACT(YEAR FROM p.fecha_pago) = EXTRACT(YEAR FROM CURRENT_DATE)
      )
    `);

    // Ultimos 5 pagos
    const ultimosPagos = await pool.query(`
      SELECT p.id, p.monto, p.fecha_pago, p.metodo_pago, u.nombre as alumno_nombre
      FROM pagos p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.fecha_pago DESC, p.id DESC
      LIMIT 5
    `);

    // Alumnos con mayor saldo pendiente (top 5)
    const topDeudores = await pool.query(`
      SELECT i.id, u.nombre as alumno_nombre, u.celular,
             COALESCE(i.nombre_curso_especifico, c.nombre) as curso,
             i.saldo_pendiente
      FROM inscripciones i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN cursos c ON i.curso_id = c.id
      WHERE i.estado = 'activo' AND i.saldo_pendiente > 0
      ORDER BY i.saldo_pendiente DESC
      LIMIT 5
    `);

    // Cursos con mas inscripciones
    const cursosPorInscripciones = await pool.query(`
      SELECT COALESCE(i.nombre_curso_especifico, c.nombre) as curso, COUNT(*) as total
      FROM inscripciones i
      LEFT JOIN cursos c ON i.curso_id = c.id
      WHERE i.estado = 'activo'
      GROUP BY COALESCE(i.nombre_curso_especifico, c.nombre)
      ORDER BY total DESC
      LIMIT 5
    `);

    return NextResponse.json({
      totalAlumnos: parseInt(totalAlumnos.rows[0].count),
      inscripcionesActivas: parseInt(inscripcionesActivas.rows[0].count),
      pagosHoy: parseFloat(pagosHoy.rows[0].total),
      pagosMes: parseFloat(pagosMes.rows[0].total),
      gastosMes: parseFloat(gastosMes.rows[0].total),
      balanceMes: parseFloat(pagosMes.rows[0].total) - parseFloat(gastosMes.rows[0].total),
      saldoPendienteTotal: parseFloat(saldoPendienteTotal.rows[0].total),
      totalLecciones: parseInt(totalLecciones.rows[0].count),
      leccionesSinVideo: parseInt(leccionesSinVideo.rows[0].count),
      alumnosSinPagoMes: parseInt(alumnosSinPagoMes.rows[0].count),
      ultimosPagos: ultimosPagos.rows.map(p => ({
        id: p.id,
        monto: parseFloat(p.monto),
        fecha: p.fecha_pago,
        metodo: p.metodo_pago,
        alumno: p.alumno_nombre
      })),
      topDeudores: topDeudores.rows.map(d => ({
        id: d.id,
        alumno: d.alumno_nombre,
        celular: d.celular,
        curso: d.curso,
        saldo: parseFloat(d.saldo_pendiente)
      })),
      cursosPorInscripciones: cursosPorInscripciones.rows.map(c => ({
        curso: c.curso,
        total: parseInt(c.total)
      }))
    });
  } catch (error) {
    console.error('Error al obtener estadisticas:', error);
    return NextResponse.json({ error: 'Error al obtener estadisticas' }, { status: 500 });
  }
}
