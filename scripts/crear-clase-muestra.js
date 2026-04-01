const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function crearTablaClaseMuestra() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando creación de tabla clase_muestra_registros...\n');
    await client.query('BEGIN');

    await client.query(`
      CREATE TABLE IF NOT EXISTS clase_muestra_registros (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(150) NOT NULL,
        celular VARCHAR(20) NOT NULL,
        email VARCHAR(150),
        edad INTEGER,
        fecha_cumpleanos DATE,
        genero VARCHAR(50),
        horario_elegido VARCHAR(100),
        estado VARCHAR(20) DEFAULT 'pendiente',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    console.log('✅ Tabla clase_muestra_registros creada o verificada correctamente.');
    
    await client.query('COMMIT');
    console.log('\n✅ Proceso completado exitosamente!');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error al crear la tabla:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

crearTablaClaseMuestra();
