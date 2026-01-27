const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function importarAlumnos() {
  const client = await pool.connect();

  try {
    console.log('🔄 Conectando a la base de datos...');

    // Leer el CSV
    const csvPath = '/Users/fernandotrejo/Downloads/Control_de_Pagos_Cursos_Ajustado - Sheet1.csv';
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    // Saltar la cabecera
    const dataLines = lines.slice(1);

    console.log(`📋 Encontrados ${dataLines.length} alumnos en el CSV`);

    // Iniciar transacción
    await client.query('BEGIN');

    // Agregar columnas nuevas si no existen
    console.log('🔧 Verificando/agregando columnas nuevas...');

    const columnasNuevas = [
      { nombre: 'genero', tipo: 'VARCHAR(20)' },
      { nombre: 'tipo_curso', tipo: 'VARCHAR(100)' },
      { nombre: 'turno', tipo: 'VARCHAR(50)' },
      { nombre: 'dia', tipo: 'VARCHAR(100)' },
      { nombre: 'abono', tipo: 'DECIMAL(10,2)' },
      { nombre: 'total', tipo: 'DECIMAL(10,2)' },
      { nombre: 'estado_pago', tipo: 'VARCHAR(50)' },
      { nombre: 'estado', tipo: 'VARCHAR(50)' },
      { nombre: 'lunes', tipo: 'BOOLEAN DEFAULT false' },
      { nombre: 'martes', tipo: 'BOOLEAN DEFAULT false' },
      { nombre: 'miercoles', tipo: 'BOOLEAN DEFAULT false' },
      { nombre: 'jueves', tipo: 'BOOLEAN DEFAULT false' },
      { nombre: 'sabado', tipo: 'BOOLEAN DEFAULT false' },
      { nombre: 'horario', tipo: 'VARCHAR(50)' }
    ];

    for (const col of columnasNuevas) {
      await client.query(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                        WHERE table_name='usuarios' AND column_name='${col.nombre}')
          THEN
            ALTER TABLE usuarios ADD COLUMN ${col.nombre} ${col.tipo};
          END IF;
        END $$;
      `);
    }

    // 1. Eliminar pagos de alumnos (no admins)
    console.log('🗑️  Eliminando pagos de alumnos...');
    await client.query(`
      DELETE FROM pagos
      WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = 'alumno')
    `);

    // 2. Eliminar progreso de alumnos
    console.log('🗑️  Eliminando progreso de alumnos...');
    await client.query(`
      DELETE FROM progreso_alumno
      WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = 'alumno')
    `);

    // 3. Eliminar inscripciones de alumnos
    console.log('🗑️  Eliminando inscripciones de alumnos...');
    await client.query(`
      DELETE FROM inscripciones
      WHERE usuario_id IN (SELECT id FROM usuarios WHERE rol = 'alumno')
    `);

    // 4. Eliminar usuarios alumnos
    console.log('🗑️  Eliminando usuarios alumnos...');
    await client.query(`DELETE FROM usuarios WHERE rol = 'alumno'`);

    // 5. Insertar nuevos alumnos con todos los campos
    console.log('➕ Insertando nuevos alumnos con todos los datos...');

    let insertados = 0;
    for (const line of dataLines) {
      // Parsear CSV
      const campos = line.split(',');

      const nombre = campos[0]?.trim();
      const celular = campos[1]?.trim().replace(/\s+/g, '');
      const email = campos[2]?.trim() || null;
      const edad = campos[3]?.trim() ? parseInt(campos[3].trim()) : null;
      const genero = campos[4]?.trim() || null;
      const tipoCurso = campos[5]?.trim() || null;
      const turno = campos[6]?.trim() || null;
      const dia = campos[7]?.trim() || null;
      const abono = campos[8]?.trim() ? parseFloat(campos[8].trim()) : null;
      const total = campos[9]?.trim() ? parseFloat(campos[9].trim()) : null;
      const estadoPago = campos[10]?.trim() || null;
      const estado = campos[11]?.trim() || null;
      const lunes = campos[12]?.trim().toLowerCase() === 'sí';
      const martes = campos[13]?.trim().toLowerCase() === 'sí';
      const miercoles = campos[14]?.trim().toLowerCase() === 'sí';
      const jueves = campos[15]?.trim().toLowerCase() === 'sí';
      const sabado = campos[16]?.trim().toLowerCase() === 'sí';
      const horario = campos[17]?.trim() || null;

      if (!nombre || !celular) {
        console.log(`⚠️  Saltando línea sin nombre o celular`);
        continue;
      }

      await client.query(`
        INSERT INTO usuarios (
          nombre, celular, email, edad, genero, tipo_curso, turno, dia,
          abono, total, estado_pago, estado, lunes, martes, miercoles,
          jueves, sabado, horario, rol, activo
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, 'alumno', true)
      `, [
        nombre, celular, email, edad, genero, tipoCurso, turno, dia,
        abono, total, estadoPago, estado, lunes, martes, miercoles,
        jueves, sabado, horario
      ]);

      insertados++;
      console.log(`   ✓ ${nombre}`);
    }

    // Confirmar transacción
    await client.query('COMMIT');

    console.log(`\n✅ Importación completada exitosamente!`);
    console.log(`   - Alumnos insertados: ${insertados}`);

    // Mostrar resumen
    const resumen = await client.query(`
      SELECT rol, COUNT(*) as total FROM usuarios GROUP BY rol
    `);
    console.log('\n📊 Resumen de usuarios:');
    resumen.rows.forEach(row => {
      console.log(`   - ${row.rol}: ${row.total}`);
    });

  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

importarAlumnos();
