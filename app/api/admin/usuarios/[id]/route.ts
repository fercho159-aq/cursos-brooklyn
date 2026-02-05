import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { getUsuarioFromRequest } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Credentials': 'true',
    },
  });
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await pool.query(
      `SELECT id, nombre, celular, email, edad, fecha_cumpleanos, rol, activo, created_at
       FROM usuarios WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return NextResponse.json({ error: 'Error al obtener usuario' }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const body = await request.json();

    const allowedFields = [
      'nombre', 'celular', 'email', 'edad', 'fecha_cumpleanos', 'rol', 'activo',
      'genero', 'tipo_curso', 'turno', 'dia', 'abono', 'total', 'estado_pago', 'estado',
      'lunes', 'martes', 'miercoles', 'jueves', 'sabado', 'horario', 'grupo_id'
    ];
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    // Campos que necesitan conversión especial
    const numericFields = ['edad', 'abono', 'total', 'grupo_id'];
    const dateFields = ['fecha_cumpleanos'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);

        let value = body[field];

        // Convertir campos numéricos vacíos a null
        if (numericFields.includes(field)) {
          value = value && value !== '' ? parseFloat(value) : null;
        }
        // Convertir campos de fecha vacíos a null
        else if (dateFields.includes(field)) {
          value = value && value !== '' ? value : null;
        }
        // Convertir strings vacíos a null para otros campos de texto
        else if (typeof value === 'string' && value === '') {
          value = null;
        }

        values.push(value);
        paramIndex++;
      }
    }

    if (body.password) {
      updates.push(`password = $${paramIndex}`);
      values.push(await bcrypt.hash(body.password, 10));
      paramIndex++;
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE usuarios SET ${updates.join(', ')} WHERE id = $${paramIndex}
                   RETURNING id, nombre, celular, email, edad, fecha_cumpleanos, rol, activo, created_at,
                   genero, tipo_curso, turno, dia, abono, total, estado_pago, estado,
                   lunes, martes, miercoles, jueves, sabado, horario`;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    return NextResponse.json({ error: 'Error al actualizar usuario' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { id } = await params;
    const result = await pool.query('DELETE FROM usuarios WHERE id = $1 RETURNING id', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
