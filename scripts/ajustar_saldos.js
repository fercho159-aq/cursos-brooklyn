const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function run() {
  try {
    await pool.query("INSERT INTO pagos (monto, metodo_pago, notas, fecha_pago, registrado_por) VALUES (19071, 'efectivo', 'Ajuste de Saldo Efectivo a favor (Corrección)', NOW(), 1);");
    console.log("Ajuste Efectivo insertado Mto +19071");

    await pool.query("INSERT INTO gastos (tipo, descripcion, monto, fecha, metodo_pago) VALUES ('Otro', 'Ajuste de Saldo Transferencia (Corrección)', 10850, NOW(), 'transferencia');");
    console.log("Ajuste Transferencia insertado Mto -10850");

    await pool.query("INSERT INTO gastos (tipo, descripcion, monto, fecha, metodo_pago) VALUES ('Otro', 'Ajuste de Saldo General (Descuadre contable)', 18221, NOW(), 'ajuste_sistema');");
    console.log("Ajuste General_Oculto insertado Mto -18221");

  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

run();
