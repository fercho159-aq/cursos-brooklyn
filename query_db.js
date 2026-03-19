const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});
pool.query("SELECT count(*) as count FROM inscripciones WHERE usuario_id IN (SELECT id FROM usuarios WHERE LOWER(estado) = 'inactivo')").then(res => {
    console.log(res.rows);
    process.exit();
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
