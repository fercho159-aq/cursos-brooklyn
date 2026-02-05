import { NextResponse } from 'next/server';
import { getUsuarioFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
  const usuario = await getUsuarioFromRequest(request);

  if (!usuario) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  try {
    const { inscriptionId } = await request.json();

    // 1. Verificar q la inscripcion pertenezca al usuario
    const result = await pool.query(
      'SELECT id FROM inscripciones WHERE id = $1 AND usuario_id = $2',
      [inscriptionId, usuario.id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
    }

    // 2. Generar el Token
    // Usamos una clave secreta del env o un fallback (idealmente siempre ENV)
    const secret = process.env.JWT_SECRET || 'fallback_secret_change_me';
    
    // El token expira en 30 dias para permitir compartirlo
    const token = jwt.sign(
      { inscriptionId, type: 'receipt_access' }, 
      secret, 
      { expiresIn: '30d' }
    );

    return NextResponse.json({ token });

  } catch (error) {
    console.error('Error generando token de recibo:', error);
    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
