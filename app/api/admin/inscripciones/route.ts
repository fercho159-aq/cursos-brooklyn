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
    const estado = searchParams.get('estado');
    const usuario_id = searchParams.get('usuario_id');

    let query = `
      SELECT i.*, u.nombre as usuario_nombre, u.celular as usuario_celular,
             c.nombre as curso_nombre_ref, h.nombre as horario_nombre
      FROM inscripciones i
      LEFT JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN cursos c ON i.curso_id = c.id
      LEFT JOIN horarios h ON i.horario_id = h.id
      WHERE 1=1
    `;
    const params: (string | number)[] = [];
    let paramIndex = 1;

    if (estado) {
      query += ` AND i.estado = $${paramIndex}`;
      params.push(estado);
      paramIndex++;
    }

    if (usuario_id) {
      query += ` AND i.usuario_id = $${paramIndex}`;
      params.push(parseInt(usuario_id));
      paramIndex++;
    }

    query += ` ORDER BY i.created_at DESC`;

    const result = await pool.query(query, params);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error al obtener inscripciones:', error);
    return NextResponse.json({ error: 'Error al obtener inscripciones' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario || usuario.rol !== 'admin') {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const {
      usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin,
      costo_total, saldo_pendiente, estado, notas, nombre_curso_especifico,
      horario_otro, modulo_numero, promocion
    } = body;

    if (!usuario_id || !curso_id) {
      return NextResponse.json({ error: 'usuario_id y curso_id son requeridos' }, { status: 400 });
    }

    const today = new Date().toISOString().split('T')[0];
    const defaultFechaInicio = fecha_inicio || today;
    const defaultFechaFin = fecha_fin || (() => {
      const d = new Date(defaultFechaInicio);
      d.setDate(d.getDate() + 28);
      return d.toISOString().split('T')[0];
    })();

    const result = await pool.query(
      `INSERT INTO inscripciones (usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin,
       costo_total, saldo_pendiente, estado, notas, nombre_curso_especifico, horario_otro, modulo_numero, promocion)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
       RETURNING *`,
      [
        usuario_id, curso_id, horario_id || null, defaultFechaInicio, defaultFechaFin,
        costo_total || 1700, saldo_pendiente || costo_total || 1700, estado || 'activo',
        notas || null, nombre_curso_especifico || null, horario_otro || null,
        modulo_numero || 1, promocion || null
      ]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Error al crear inscripcion:', error);
    return NextResponse.json({ error: 'Error al crear inscripcion' }, { status: 500 });
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
      'curso_id', 'horario_id', 'fecha_inicio', 'fecha_fin', 'costo_total',
      'saldo_pendiente', 'estado', 'notas', 'nombre_curso_especifico', 'horario_otro',
      'modulo_numero', 'promocion'
    ];
    const updates: string[] = [];
    const values: (string | number | null)[] = [];
    let paramIndex = 1;

    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updates.push(`${field} = $${paramIndex}`);
        values.push(body[field] === '' ? null : body[field]);
        paramIndex++;
      }
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 });
    }

    values.push(id);
    const query = `UPDATE inscripciones SET ${updates.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Error al actualizar inscripción:', error);
    return NextResponse.json({ error: 'Error al actualizar inscripción' }, { status: 500 });
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

    const result = await pool.query('DELETE FROM inscripciones WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Inscripción eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar inscripción:', error);
    return NextResponse.json({ error: 'Error al eliminar inscripción' }, { status: 500 });
  }
}
