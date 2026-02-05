/**
 * Script para migrar los abonos de la tabla usuarios a la tabla pagos
 *
 * Ejecutar con: npx ts-node scripts/migrar-abonos.ts
 * O desde la API temporal que se creará
 */

import pool from '../lib/db';

async function migrarAbonos() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Iniciando migración de abonos...');

    // 1. Obtener usuarios con abonos > 0
    const usuariosConAbono = await client.query(`
      SELECT id, nombre, abono, total, grupo_id
      FROM usuarios
      WHERE abono IS NOT NULL AND abono > 0
    `);

    console.log(`Encontrados ${usuariosConAbono.rows.length} usuarios con abonos`);

    for (const usuario of usuariosConAbono.rows) {
      console.log(`Procesando: ${usuario.nombre} - Abono: $${usuario.abono}`);

      // 2. Verificar si el usuario tiene una inscripción activa
      let inscripcion = await client.query(`
        SELECT id FROM inscripciones
        WHERE usuario_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [usuario.id]);

      let inscripcionId: number;

      if (inscripcion.rows.length === 0) {
        // 3. Si no tiene inscripción, crear una
        console.log(`  - Creando inscripción para usuario ${usuario.id}`);

        // Obtener el primer curso activo
        const curso = await client.query(`
          SELECT id FROM cursos WHERE activo = true LIMIT 1
        `);

        const cursoId = curso.rows.length > 0 ? curso.rows[0].id : 1;
        const costoTotal = usuario.total || 1900;
        const saldoPendiente = costoTotal - (usuario.abono || 0);

        const nuevaInscripcion = await client.query(`
          INSERT INTO inscripciones (usuario_id, curso_id, costo_total, saldo_pendiente, estado)
          VALUES ($1, $2, $3, $4, 'activo')
          RETURNING id
        `, [usuario.id, cursoId, costoTotal, saldoPendiente]);

        inscripcionId = nuevaInscripcion.rows[0].id;
        console.log(`  - Inscripción creada con ID: ${inscripcionId}`);
      } else {
        inscripcionId = inscripcion.rows[0].id;
        console.log(`  - Usando inscripción existente ID: ${inscripcionId}`);
      }

      // 4. Crear el pago con el abono
      await client.query(`
        INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, notas, fecha_pago)
        VALUES ($1, $2, $3, 'efectivo', 'Migrado desde campo abono', NOW())
      `, [inscripcionId, usuario.id, usuario.abono]);

      console.log(`  - Pago creado: $${usuario.abono}`);

      // 5. Actualizar saldo pendiente de la inscripción
      await client.query(`
        UPDATE inscripciones
        SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1)
        WHERE id = $2
      `, [usuario.abono, inscripcionId]);
    }

    // 6. Eliminar columna abono de usuarios (comentado por seguridad)
    // await client.query('ALTER TABLE usuarios DROP COLUMN abono');
    // console.log('Columna abono eliminada de la tabla usuarios');

    // En su lugar, ponemos los abonos en NULL
    await client.query('UPDATE usuarios SET abono = NULL WHERE abono IS NOT NULL');
    console.log('Abonos establecidos en NULL');

    await client.query('COMMIT');
    console.log('Migración completada exitosamente!');

    return { success: true, migrados: usuariosConAbono.rows.length };

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error en migración:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Si se ejecuta directamente
if (require.main === module) {
  migrarAbonos()
    .then(result => {
      console.log('Resultado:', result);
      process.exit(0);
    })
    .catch(err => {
      console.error('Error:', err);
      process.exit(1);
    });
}

export { migrarAbonos };
