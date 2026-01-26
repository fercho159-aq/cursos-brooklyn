import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const result = await pool.query(
      `SELECT id, nombre, dias, hora_inicio, hora_fin, activo
       FROM horarios ORDER BY id`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener horarios:', error);
    return NextResponse.json({ error: 'Error al obtener horarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, dias, hora_inicio, hora_fin, activo } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO horarios (nombre, dias, hora_inicio, hora_fin, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, dias || '', hora_inicio || null, hora_fin || null, activo !== false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear horario:', error);
    return NextResponse.json({ error: 'Error al crear horario' }, { status: 500 });
  }
}
