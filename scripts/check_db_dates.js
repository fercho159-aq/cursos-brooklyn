const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function query() {
  try {
    const p = await pool.query('SELECT id, fecha_pago FROM pagos LIMIT 10');
    console.log("Pagos:", p.rows);
    const g = await pool.query('SELECT id, fecha FROM gastos LIMIT 10');
    console.log("Gastos:", g.rows);
  } catch (e) {
    console.error(e);
  } finally {
    pool.end();
  }
}
query();
