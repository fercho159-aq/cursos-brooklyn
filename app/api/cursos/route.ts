import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET() {
  try {
    const result = await pool.query('SELECT * FROM cursos WHERE activo = true ORDER BY id');
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener cursos:', error);
    return NextResponse.json({ error: 'Error al obtener cursos' }, { status: 500 });
  }
}
