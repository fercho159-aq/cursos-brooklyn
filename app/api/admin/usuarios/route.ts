import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const rol = searchParams.get('rol');

    let query = `
      SELECT id, nombre, celular, email, edad, fecha_cumpleanos, rol, activo, created_at
      FROM usuarios
      WHERE 1=1
    `;
    const params: string[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (nombre ILIKE $${paramIndex} OR celular ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (rol) {
      query += ` AND rol = $${paramIndex}`;
      params.push(rol);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { nombre, celular, email, edad, fecha_cumpleanos, password, rol, activo } = body;

    if (!nombre || !celular) {
      return NextResponse.json({ error: 'Nombre y celular son requeridos' }, { status: 400 });
    }

    const existing = await pool.query('SELECT id FROM usuarios WHERE celular = $1', [celular]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese celular' }, { status: 400 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash(celular, 10);

    const result = await pool.query(
      `INSERT INTO usuarios (nombre, celular, email, edad, fecha_cumpleanos, password, rol, activo)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, nombre, celular, email, edad, fecha_cumpleanos, rol, activo, created_at`,
      [nombre, celular, email || null, edad || null, fecha_cumpleanos || null, hashedPassword, rol || 'alumno', activo !== false]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
  }
}
