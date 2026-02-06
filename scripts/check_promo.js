const { Pool } = require('pg');

const connectionString = 'postgresql://neondb_owner:npg_sO2y1UEGwFBK@ep-ancient-union-ahy36uvu-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require';

const pool = new Pool({
    connectionString,
    ssl: { rejectUnauthorized: false }
});

async function checkPromo() {
    try {
        // Folio BRO-000008 corresponds to ID 8
        const res = await pool.query('SELECT id, promocion, estado FROM inscripciones WHERE id = 8');
        if (res.rows.length > 0) {
            console.log('Record found:', res.rows[0]);
        } else {
            console.log('Record with ID 8 not found');
        }
    } catch (err) {
        console.error('Error executing query', err);
    } finally {
        await pool.end();
    }
}

checkPromo();
