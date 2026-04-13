require('dotenv').config();
const { Pool } = require('pg');
const pool = new Pool({connectionString: process.env.DATABASE_URL});
pool.query("ALTER TABLE gastos ADD COLUMN metodo_pago VARCHAR(50) DEFAULT 'efectivo'")
  .then(res => { console.log("Column added"); pool.end(); })
  .catch(err => { console.error(err); pool.end(); });
