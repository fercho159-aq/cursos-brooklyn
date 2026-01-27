const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function crearGrupos() {
  const client = await pool.connect();

  try {
    console.log('🔄 Creando tabla de grupos...\n');

    await client.query('BEGIN');

    // Crear tabla de grupos
    await client.query(`
      CREATE TABLE IF NOT EXISTS grupos (
        id SERIAL PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        dias VARCHAR(100) NOT NULL,
        turno VARCHAR(50),
        horario VARCHAR(50),
        color VARCHAR(20) DEFAULT '#3b82f6',
        activo BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabla grupos creada');

    // Agregar columna grupo_id a usuarios si no existe
    await client.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                      WHERE table_name='usuarios' AND column_name='grupo_id')
        THEN
          ALTER TABLE usuarios ADD COLUMN grupo_id INTEGER REFERENCES grupos(id) ON DELETE SET NULL;
        END IF;
      END $$;
    `);
    console.log('✅ Columna grupo_id agregada a usuarios');

    // Insertar grupos por defecto basados en los patrones actuales
    const gruposDefault = [
      { nombre: 'Lunes y Miércoles', dias: 'Lunes y Miércoles', color: '#3b82f6' },
      { nombre: 'Martes y Jueves', dias: 'Martes y Jueves', color: '#8b5cf6' },
      { nombre: 'Sábado', dias: 'Sábado', color: '#10b981' }
    ];

    for (const grupo of gruposDefault) {
      const exists = await client.query('SELECT id FROM grupos WHERE nombre = $1', [grupo.nombre]);
      if (exists.rows.length === 0) {
        await client.query(
          'INSERT INTO grupos (nombre, dias, color) VALUES ($1, $2, $3)',
          [grupo.nombre, grupo.dias, grupo.color]
        );
        console.log(`   ✓ Grupo "${grupo.nombre}" creado`);
      } else {
        console.log(`   - Grupo "${grupo.nombre}" ya existe`);
      }
    }

    // Asignar automáticamente los usuarios a grupos basándose en sus días actuales
    console.log('\n🔄 Asignando usuarios a grupos automáticamente...');

    // Lunes y Miércoles
    const grupoLunesMiercoles = await client.query("SELECT id FROM grupos WHERE nombre = 'Lunes y Miércoles'");
    if (grupoLunesMiercoles.rows.length > 0) {
      const result = await client.query(`
        UPDATE usuarios
        SET grupo_id = $1
        WHERE lunes = true AND miercoles = true AND martes = false AND jueves = false AND sabado = false
        RETURNING nombre
      `, [grupoLunesMiercoles.rows[0].id]);
      console.log(`   ✓ ${result.rowCount} usuarios asignados a "Lunes y Miércoles"`);
    }

    // Martes y Jueves
    const grupoMartesJueves = await client.query("SELECT id FROM grupos WHERE nombre = 'Martes y Jueves'");
    if (grupoMartesJueves.rows.length > 0) {
      const result = await client.query(`
        UPDATE usuarios
        SET grupo_id = $1
        WHERE martes = true AND jueves = true AND lunes = false AND miercoles = false AND sabado = false
        RETURNING nombre
      `, [grupoMartesJueves.rows[0].id]);
      console.log(`   ✓ ${result.rowCount} usuarios asignados a "Martes y Jueves"`);
    }

    // Sábado
    const grupoSabado = await client.query("SELECT id FROM grupos WHERE nombre = 'Sábado'");
    if (grupoSabado.rows.length > 0) {
      const result = await client.query(`
        UPDATE usuarios
        SET grupo_id = $1
        WHERE sabado = true AND lunes = false AND martes = false AND miercoles = false AND jueves = false
        RETURNING nombre
      `, [grupoSabado.rows[0].id]);
      console.log(`   ✓ ${result.rowCount} usuarios asignados a "Sábado"`);
    }

    await client.query('COMMIT');

    // Mostrar resumen
    console.log('\n📊 Resumen de grupos:');
    const resumen = await client.query(`
      SELECT g.nombre, g.color, COUNT(u.id) as total_alumnos
      FROM grupos g
      LEFT JOIN usuarios u ON u.grupo_id = g.id
      GROUP BY g.id, g.nombre, g.color
      ORDER BY g.nombre
    `);
    resumen.rows.forEach(r => {
      console.log(`   ${r.nombre}: ${r.total_alumnos} alumnos`);
    });

    const sinGrupo = await client.query("SELECT COUNT(*) as total FROM usuarios WHERE grupo_id IS NULL AND rol = 'alumno'");
    console.log(`   Sin grupo: ${sinGrupo.rows[0].total} alumnos`);

    console.log('\n✅ Migración completada exitosamente!');

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

crearGrupos();
