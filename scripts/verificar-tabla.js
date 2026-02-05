const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function verificar() {
  try {
    // Verificar columnas de la tabla usuarios
    const result = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'usuarios'
      ORDER BY ordinal_position
    `);

    console.log('=== ESTRUCTURA DE LA TABLA USUARIOS ===\n');
    result.rows.forEach(col => {
      console.log(`${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
    });

    // Intentar insertar un usuario de prueba
    console.log('\n=== PROBANDO INSERCIÓN ===\n');

    const testResult = await pool.query(`
      INSERT INTO usuarios (nombre, celular, rol, activo)
      VALUES ('Test Usuario', '1234567890', 'alumno', true)
      RETURNING id, nombre
    `);

    console.log('Usuario de prueba creado:', testResult.rows[0]);

    // Eliminar usuario de prueba
    await pool.query('DELETE FROM usuarios WHERE celular = $1', ['1234567890']);
    console.log('Usuario de prueba eliminado');

  } catch (error) {
    console.error('ERROR:', error.message);
    console.error('Detalle:', error);
  } finally {
    await pool.end();
  }
}

verificar();
