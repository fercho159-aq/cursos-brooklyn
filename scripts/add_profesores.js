const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function main() {
  try {
    // 1. Modificar tabla grupos
    console.log('Añadiendo columna profesor_id a grupos...');
    await pool.query(`
      ALTER TABLE grupos 
      ADD COLUMN IF NOT EXISTS profesor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL;
    `);

    // 2. Crear tabla asistencias_profesores
    console.log('Creando tabla asistencias_profesores...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS asistencias_profesores (
        id SERIAL PRIMARY KEY,
        profesor_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        fecha DATE NOT NULL,
        hora_entrada TIME NOT NULL,
        hora_salida TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(profesor_id, fecha)
      );
    `);

    // 3. Crear tabla asistencias_alumnos
    console.log('Creando tabla asistencias_alumnos...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS asistencias_alumnos (
        id SERIAL PRIMARY KEY,
        alumno_id INTEGER REFERENCES usuarios(id) ON DELETE CASCADE,
        grupo_id INTEGER REFERENCES grupos(id) ON DELETE CASCADE,
        profesor_id INTEGER REFERENCES usuarios(id) ON DELETE SET NULL,
        fecha DATE NOT NULL,
        estado VARCHAR(20) NOT NULL CHECK (estado IN ('presente', 'ausente')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(alumno_id, fecha)
      );
    `);

    console.log('¡Migración completada exitosamente!');
  } catch (error) {
    console.error('Error durante la migración:', error);
  } finally {
    process.exit(0);
  }
}

main();
