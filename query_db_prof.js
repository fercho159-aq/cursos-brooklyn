const { default: pool } = require('./lib/db.js');

async function checkData() {
  try {
    // Buscar profesor
    const prof = await pool.query(`SELECT id, nombre FROM usuarios WHERE rol = 'profesor'`);
    console.log("Profesores:", prof.rows);

    const grupos = await pool.query(`SELECT * FROM grupos`);
    console.log("Grupos:", grupos.rows);

    const ghp = await pool.query(`SELECT * FROM grupo_horarios_profesores`);
    console.log("GHP:", ghp.rows);

    const alumnos = await pool.query(`
      SELECT id, nombre, turno, horario, grupo_id 
      FROM usuarios 
      WHERE rol = 'alumno' AND grupo_id IS NOT NULL 
      LIMIT 10
    `);
    console.log("Alumnos:", alumnos.rows);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
checkData();
