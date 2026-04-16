const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

pool.query("SELECT column_name, is_nullable, data_type FROM information_schema.columns WHERE table_name = 'pagos';").then(res => {
  console.table(res.rows);
  pool.end();
});
