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
      SELECT u.id, u.nombre, u.celular, u.email, u.edad, u.fecha_cumpleanos, u.rol, u.activo, u.created_at,
             u.genero, u.tipo_curso, u.turno, u.dia, u.abono, u.total, u.estado_pago, u.estado,
             u.lunes, u.martes, u.miercoles, u.jueves, u.sabado, u.horario, u.grupo_id,
             g.nombre as grupo_nombre, g.color as grupo_color
      FROM usuarios u
      LEFT JOIN grupos g ON u.grupo_id = g.id
      WHERE 1=1
    `;
    const params: string[] = [];
    let paramIndex = 1;

    if (search) {
      query += ` AND (u.nombre ILIKE $${paramIndex} OR u.celular ILIKE $${paramIndex} OR u.email ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    if (rol) {
      query += ` AND u.rol = $${paramIndex}`;
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
    console.log('Datos recibidos:', JSON.stringify(body, null, 2));

    const { nombre, celular, email, password, rol, activo } = body;

    if (!nombre || !celular) {
      return NextResponse.json({ error: 'Nombre y celular son requeridos' }, { status: 400 });
    }

    const existing = await pool.query('SELECT id FROM usuarios WHERE celular = $1', [celular]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese celular' }, { status: 400 });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : await bcrypt.hash(celular, 10);

    // Función helper para limpiar valores
    const cleanString = (val: unknown): string | null => {
      if (val === undefined || val === null || val === '') return null;
      return String(val);
    };

    const cleanNumber = (val: unknown): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = Number(val);
      return isNaN(num) ? null : num;
    };

    const cleanBoolean = (val: unknown): boolean => {
      return val === true || val === 'true';
    };

    // Preparar valores
    const values = [
      nombre,
      celular,
      cleanString(email),
      cleanNumber(body.edad),
      cleanString(body.fecha_cumpleanos),
      hashedPassword,
      rol || 'alumno',
      activo !== false,
      cleanString(body.genero),
      cleanString(body.tipo_curso),
      cleanString(body.turno),
      cleanString(body.dia),
      cleanNumber(body.abono),
      cleanNumber(body.total),
      cleanString(body.estado_pago),
      cleanString(body.estado),
      cleanBoolean(body.lunes),
      cleanBoolean(body.martes),
      cleanBoolean(body.miercoles),
      cleanBoolean(body.jueves),
      cleanBoolean(body.sabado),
      cleanString(body.horario),
      cleanNumber(body.grupo_id)
    ];

    console.log('Valores a insertar:', values);

    const result = await pool.query(
      `INSERT INTO usuarios (
        nombre, celular, email, edad, fecha_cumpleanos, password, rol, activo,
        genero, tipo_curso, turno, dia, abono, total, estado_pago, estado,
        lunes, martes, miercoles, jueves, sabado, horario, grupo_id
      )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23)
       RETURNING id, nombre, celular, email, edad, fecha_cumpleanos, rol, activo, created_at,
                 genero, tipo_curso, turno, dia, abono, total, estado_pago, estado,
                 lunes, martes, miercoles, jueves, sabado, horario, grupo_id`,
      values
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return NextResponse.json({ error: `Error al crear usuario: ${errorMessage}` }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

    const body = await request.json();

    const allowedFields = [
      'nombre', 'celular', 'email', 'edad', 'fecha_cumpleanos', 'rol', 'activo',
      'genero', 'tipo_curso', 'turno', 'dia', 'abono', 'total', 'estado_pago', 'estado',
      'lunes', 'martes', 'miercoles', 'jueves', 'sabado', 'horario', 'grupo_id'
    ];
    const updates: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let paramIndex = 1;

    const numericFields = ['edad', 'abono', 'total', 'grupo_id'];
    const dateFields = ['fecha_cumpleanos'];

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);

        let value = body[field];

        if (numericFields.includes(field)) {
          value = value && value !== '' ? parseFloat(value) : null;
        } else if (dateFields.includes(field)) {
          value = value && value !== '' ? value : null;
        } else if (typeof value === 'string' && value === '') {
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

export async function DELETE(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID es requerido' }, { status: 400 });
    }

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
