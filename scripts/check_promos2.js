const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  const p = await pool.query("SELECT SUM(monto) as total, metodo_pago FROM pagos GROUP BY metodo_pago");
  const g = await pool.query("SELECT SUM(monto) as total, metodo_pago FROM gastos GROUP BY metodo_pago");
  console.log('Pagos:', p.rows);
  console.log('Gastos:', g.rows);
  pool.end();
}

run().catch(console.error);
