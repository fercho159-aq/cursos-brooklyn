const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function analizar() {
  const result = await pool.query(`
    SELECT nombre, lunes, martes, miercoles, jueves, sabado, turno, horario
    FROM usuarios
    WHERE rol = 'alumno'
    ORDER BY nombre
  `);

  console.log('=== ANÁLISIS DE DÍAS POR ALUMNO ===\n');

  const patrones = {};

  result.rows.forEach(u => {
    const dias = [];
    if (u.lunes) dias.push('Lunes');
    if (u.martes) dias.push('Martes');
    if (u.miercoles) dias.push('Miércoles');
    if (u.jueves) dias.push('Jueves');
    if (u.sabado) dias.push('Sábado');

    const patron = dias.join(' y ') || 'Sin días asignados';
    if (!patrones[patron]) patrones[patron] = [];
    patrones[patron].push({ nombre: u.nombre, turno: u.turno, horario: u.horario });
  });

  console.log('=== PATRONES DE DÍAS ENCONTRADOS ===\n');

  const patronesOrdenados = Object.keys(patrones).sort((a, b) => patrones[b].length - patrones[a].length);

  patronesOrdenados.forEach(patron => {
    console.log(`📅 ${patron}: ${patrones[patron].length} alumno(s)`);
    console.log('─'.repeat(50));
    patrones[patron].forEach(u => {
      console.log(`   • ${u.nombre}`);
      console.log(`     Turno: ${u.turno || '-'} | Horario: ${u.horario || '-'}`);
    });
    console.log('');
  });

  console.log('=== RESUMEN ===\n');
  patronesOrdenados.forEach(patron => {
    console.log(`${patron}: ${patrones[patron].length} alumno(s)`);
  });

  await pool.end();
}

analizar();
