import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      nombre, 
      celular, 
      email, 
      edad, 
      fecha_cumpleanos, 
      genero, 
      horario_elegido 
    } = body;

    if (!nombre || !celular || !horario_elegido) {
      return NextResponse.json(
        { error: 'Nombre, celular y horario son requeridos' }, 
        { status: 400 }
      );
    }

    // Funciones helper para limpiar valores
    const cleanString = (val: unknown): string | null => {
      if (val === undefined || val === null || val === '') return null;
      return String(val);
    };

    const cleanNumber = (val: unknown): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const values = [
      nombre,
      celular,
      cleanString(email),
      cleanNumber(edad),
      cleanString(fecha_cumpleanos),
      cleanString(genero),
      horario_elegido
    ];

    const result = await pool.query(
      `INSERT INTO clase_muestra_registros (
        nombre, celular, email, edad, fecha_cumpleanos, genero, horario_elegido, estado
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 'pendiente')
      RETURNING id, nombre, celular, horario_elegido, estado, created_at`,
      values
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al registrar clase muestra:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json(
      { error: `Error al registrar: ${errorMessage}` }, 
      { status: 500 }
    );
  }
}
