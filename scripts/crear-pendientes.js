const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function crearPendientes() {
  const client = await pool.connect();

  try {
    console.log('🔄 Creando tabla de pendientes...\n');

    await client.query('BEGIN');

    // Crear tabla de pendientes
    await client.query(`
      CREATE TABLE IF NOT EXISTS pendientes (
        id SERIAL PRIMARY KEY,
        titulo VARCHAR(255) NOT NULL,
        descripcion TEXT,
        categoria VARCHAR(50) NOT NULL,
        prioridad VARCHAR(50) NOT NULL,
        completado BOOLEAN DEFAULT false,
        fecha_limite DATE,
        registrado_por INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla pendientes creada');

    // Crear índices para mejorar consultas
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pendientes_categoria ON pendientes(categoria)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pendientes_prioridad ON pendientes(prioridad)
    `);
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_pendientes_completado ON pendientes(completado)
    `);
    console.log('✅ Índices creados');

    await client.query('COMMIT');

    // Mostrar estructura de la tabla
    console.log('\n📊 Estructura de la tabla pendientes:');
    const estructura = await client.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'pendientes'
      ORDER BY ordinal_position
    `);
    estructura.rows.forEach(col => {
      console.log(`   ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? 'NOT NULL' : ''} ${col.column_default ? `DEFAULT ${col.column_default}` : ''}`);
    });

    console.log('\n✅ Tabla de pendientes creada exitosamente!');
    console.log('\n📝 Categorías disponibles: Operaciones, Marketing, Ventas, Administrativo');
    console.log('📝 Prioridades disponibles: Urgente, Moderado, No urge');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

crearPendientes();
