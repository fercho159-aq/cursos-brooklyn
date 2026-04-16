const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  await pool.query("INSERT INTO pagos (monto, metodo_pago, notas, fecha_pago, registrado_por) VALUES (10000, 'efectivo', 'Restaurar ajuste Efectivo (Mto +10000)', NOW(), 1);");
  console.log("Ajuste complementario insertado +10000");
  const p = await pool.query("SELECT SUM(monto) as total, metodo_pago FROM pagos GROUP BY metodo_pago");
  const g = await pool.query("SELECT SUM(monto) as total, metodo_pago FROM gastos GROUP BY metodo_pago");
  console.log('Nuevos Pagos:', p.rows);
  console.log('Nuevos Gastos:', g.rows);
  pool.end();
}

run().catch(console.error);
