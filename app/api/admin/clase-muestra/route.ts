import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const estado = searchParams.get('estado');

    let query = `
      SELECT id, nombre, celular, email, edad, fecha_cumpleanos, genero, 
             horario_elegido, estado, created_at
      FROM clase_muestra_registros
      WHERE 1=1
    `;
    const params: string[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (nombre ILIKE $${paramIndex} OR celular ILIKE $${paramIndex} OR email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (estado) {
      query += ` AND estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    query += ` ORDER BY created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener registros de clase muestra:', error);
    return NextResponse.json({ error: 'Error al obtener registros' }, { status: 500 });
  }
}
