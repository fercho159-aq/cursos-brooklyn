import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const result = await pool.query(`
      SELECT g.*,
             COUNT(u.id) as total_alumnos
      FROM grupos g
      LEFT JOIN usuarios u ON u.grupo_id = g.id AND u.rol = 'alumno'
      GROUP BY g.id
      ORDER BY g.nombre
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener grupos:', error);
    return NextResponse.json({ error: 'Error al obtener grupos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, dias, turno, horario, color, activo } = body;

    if (!nombre || !dias) {
      return NextResponse.json({ error: 'Nombre y días son requeridos' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO grupos (nombre, dias, turno, horario, color, activo)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nombre, dias, turno || null, horario || null, color || '#3b82f6', activo !== false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear grupo:', error);
    return NextResponse.json({ error: 'Error al crear grupo' }, { status: 500 });
  }
}
