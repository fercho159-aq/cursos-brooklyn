import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Obtener usuarios con abonos > 0
    const usuariosConAbono = await client.query(`
      SELECT id, nombre, abono, total, grupo_id
      FROM usuarios
      WHERE abono IS NOT NULL AND abono > 0
    `);

    const migrados: { nombre: string; abono: number; inscripcion_id: number }[] = [];

    for (const usr of usuariosConAbono.rows) {
      // 2. Verificar si el usuario tiene una inscripción activa
      let inscripcion = await client.query(`
        SELECT id FROM inscripciones
        WHERE usuario_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [usr.id]);

      let inscripcionId: number;

      if (inscripcion.rows.length === 0) {
        // 3. Si no tiene inscripción, crear una
        const curso = await client.query(`
          SELECT id FROM cursos WHERE activo = true LIMIT 1
        `);

        const cursoId = curso.rows.length > 0 ? curso.rows[0].id : 1;
        const costoTotal = usr.total || 1700;
        const saldoPendiente = costoTotal - (usr.abono || 0);

        const nuevaInscripcion = await client.query(`
          INSERT INTO inscripciones (usuario_id, curso_id, costo_total, saldo_pendiente, estado)
          VALUES ($1, $2, $3, $4, 'activo')
          RETURNING id
        `, [usr.id, cursoId, costoTotal, saldoPendiente]);

        inscripcionId = nuevaInscripcion.rows[0].id;
      } else {
        inscripcionId = inscripcion.rows[0].id;
      }

      // 4. Crear el pago con el abono
      await client.query(`
        INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, notas, fecha_pago, registrado_por)
        VALUES ($1, $2, $3, 'efectivo', 'Migrado desde campo abono', NOW(), $4)
      `, [inscripcionId, usr.id, usr.abono, usuario.id]);

      // 5. Actualizar saldo pendiente de la inscripción
      await client.query(`
        UPDATE inscripciones
        SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1)
        WHERE id = $2
      `, [usr.abono, inscripcionId]);

      migrados.push({
        nombre: usr.nombre,
        abono: usr.abono,
        inscripcion_id: inscripcionId
      });
    }

    // 6. Establecer abonos en NULL (sin eliminar la columna aún)
    await client.query('UPDATE usuarios SET abono = NULL WHERE abono IS NOT NULL');

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      mensaje: `Se migraron ${migrados.length} abonos a pagos`,
      migrados
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en migración:', error);
    return NextResponse.json({
      error: 'Error al migrar abonos',
      detalle: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 });
  } finally {
    client.release();
  }
}

// GET para ver estado antes de migrar
export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const result = await pool.query(`
      SELECT u.id, u.nombre, u.abono, u.total,
             (SELECT COUNT(*) FROM inscripciones WHERE usuario_id = u.id) as tiene_inscripcion
      FROM usuarios u
      WHERE u.abono IS NOT NULL AND u.abono > 0
      ORDER BY u.nombre
    `);

    return NextResponse.json({
      total_usuarios_con_abono: result.rows.length,
      suma_total_abonos: result.rows.reduce((sum, r) => sum + parseFloat(r.abono || 0), 0),
      usuarios: result.rows
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Error al consultar' }, { status: 500 });
  }
}
