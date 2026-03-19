import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';

export async function GET(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'profesor') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    // 1. Obtener el grupo asignado al profesor
    const grupoRes = await pool.query(`
      SELECT * FROM grupos WHERE profesor_id = $1 LIMIT 1
    `, [usuario.id]);

    if (grupoRes.rows.length === 0) {
      return NextResponse.json({ grupo: null, alumnos: [] });
    }

    const grupo = grupoRes.rows[0];

    // 2. Obtener los alumnos del grupo (SOLO ACTIVOS)
    const alumnosRes = await pool.query(`
      SELECT id, nombre, email, celular, estado, genero 
      FROM usuarios 
      WHERE grupo_id = $1 
        AND rol = 'alumno'
        AND activo = true
        AND (estado IS NULL OR LOWER(estado) NOT IN ('inactivo', 'cancelado'))
      ORDER BY nombre
    `, [grupo.id]);

    return NextResponse.json({
      grupo,
      alumnos: alumnosRes.rows
    });
  } catch (error) {
    console.error('Error al obtener grupo del profesor:', error);
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 });
  }
}
