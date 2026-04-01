require('dotenv').config();
const fs = require('fs');
const { Pool } = require('pg');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const g = await pool.query('SELECT * FROM grupos ORDER BY id');
  const ghp = await pool.query('SELECT * FROM grupo_horarios_profesores');
  const al = await pool.query(`SELECT id, nombre, turno, horario FROM usuarios WHERE rol='alumno' AND grupo_id=2`);
  
  fs.writeFileSync('query_out.json', JSON.stringify({
    grupos: g.rows,
    mappings: ghp.rows,
    alumnos: al.rows
  }, null, 2));
  
  process.exit(0);
}
run();
