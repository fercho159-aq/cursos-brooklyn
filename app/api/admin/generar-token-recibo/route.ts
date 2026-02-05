import { NextResponse } from 'next/server';
import { getUsuarioFromRequest } from '@/lib/auth';
import pool from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function POST(request: Request) {
    // 1. Verificar que sea ADMIN
    const usuario = await getUsuarioFromRequest(request);

    if (!usuario || usuario.rol !== 'admin') {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    try {
        const { inscriptionId } = await request.json();

        // 2. Verificar que la inscripcion exista (no importa de quien sea)
        const result = await pool.query(
            'SELECT id FROM inscripciones WHERE id = $1',
            [inscriptionId]
        );

        if (result.rows.length === 0) {
            return NextResponse.json({ error: 'Inscripción no encontrada' }, { status: 404 });
        }

        // 3. Generar el Token
        const secret = process.env.JWT_SECRET || 'fallback_secret_change_me';

        // El token expira en 30 dias
        const token = jwt.sign(
            { inscriptionId, type: 'receipt_access' },
            secret,
            { expiresIn: '30d' }
        );

        return NextResponse.json({ token });

    } catch (error) {
        console.error('Error generando token de recibo (admin):', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
