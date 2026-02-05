const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function migrarAbonos() {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    console.log('Iniciando migración de abonos...\n');

    // 1. Obtener usuarios con abonos > 0
    const usuariosConAbono = await client.query(`
      SELECT id, nombre, abono, total, grupo_id
      FROM usuarios
      WHERE abono IS NOT NULL AND abono > 0
    `);

    console.log(`Encontrados ${usuariosConAbono.rows.length} usuarios con abonos\n`);

    if (usuariosConAbono.rows.length === 0) {
      console.log('No hay abonos para migrar.');
      await client.query('ROLLBACK');
      return;
    }

    const migrados = [];

    for (const usuario of usuariosConAbono.rows) {
      console.log(`Procesando: ${usuario.nombre} - Abono: $${usuario.abono}`);

      // 2. Verificar si el usuario tiene una inscripción
      let inscripcion = await client.query(`
        SELECT id FROM inscripciones
        WHERE usuario_id = $1
        ORDER BY created_at DESC
        LIMIT 1
      `, [usuario.id]);

      let inscripcionId;

      if (inscripcion.rows.length === 0) {
        // 3. Si no tiene inscripción, crear una
        console.log(`  -> Creando inscripción...`);

        const curso = await client.query(`SELECT id FROM cursos WHERE activo = true LIMIT 1`);
        const cursoId = curso.rows.length > 0 ? curso.rows[0].id : 1;
        const costoTotal = usuario.total || 1900;
        const saldoPendiente = costoTotal - (usuario.abono || 0);

        const nuevaInscripcion = await client.query(`
          INSERT INTO inscripciones (usuario_id, curso_id, costo_total, saldo_pendiente, estado)
          VALUES ($1, $2, $3, $4, 'activo')
          RETURNING id
        `, [usuario.id, cursoId, costoTotal, saldoPendiente]);

        inscripcionId = nuevaInscripcion.rows[0].id;
        console.log(`  -> Inscripción creada con ID: ${inscripcionId}`);
      } else {
        inscripcionId = inscripcion.rows[0].id;
        console.log(`  -> Usando inscripción existente ID: ${inscripcionId}`);
      }

      // 4. Crear el pago
      await client.query(`
        INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, notas, fecha_pago)
        VALUES ($1, $2, $3, 'efectivo', 'Migrado desde campo abono', NOW())
      `, [inscripcionId, usuario.id, usuario.abono]);

      console.log(`  -> Pago creado: $${usuario.abono}`);

      // 5. Actualizar saldo pendiente
      await client.query(`
        UPDATE inscripciones
        SET saldo_pendiente = GREATEST(0, saldo_pendiente - $1)
        WHERE id = $2
      `, [usuario.abono, inscripcionId]);

      migrados.push({ nombre: usuario.nombre, abono: usuario.abono, inscripcion_id: inscripcionId });
    }

    // 6. Limpiar abonos
    await client.query('UPDATE usuarios SET abono = NULL WHERE abono IS NOT NULL');
    console.log('\nAbonos limpiados de la tabla usuarios');

    await client.query('COMMIT');

    console.log('\n========================================');
    console.log('MIGRACIÓN COMPLETADA EXITOSAMENTE!');
    console.log(`Total migrados: ${migrados.length}`);
    console.log('========================================\n');

    migrados.forEach(m => {
      console.log(`  - ${m.nombre}: $${m.abono} -> Inscripción #${m.inscripcion_id}`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('ERROR en migración:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrarAbonos()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
