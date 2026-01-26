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
      `SELECT id, nombre, descripcion, costo, duracion_semanas, activo, created_at
       FROM cursos ORDER BY nombre`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, descripcion, costo, duracion_semanas, activo } = body;

    if (!nombre) {
      return NextResponse.json({ error: 'El nombre es requerido' }, { status: 400 });
    }

    const result = await pool.query(
      `INSERT INTO cursos (nombre, descripcion, costo, duracion_semanas, activo)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [nombre, descripcion || '', costo || 1700, duracion_semanas || 4, activo !== false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear curso:', error);
    return NextResponse.json({ error: 'Error al crear curso' }, { status: 500 });
  }
}
