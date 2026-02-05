import { notFound } from 'next/navigation';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';
import ReciboDisplay from '@/components/ReciboDisplay';

// Deshabilitamos cache para asegurar datos frescos
export const dynamic = 'force-dynamic';

interface PageProps {
    params: {
        token: string;
    };
}

export default async function ReciboPage({ params }: PageProps) {
    const { token } = params;

    if (!token) {
        return notFound();
    }

    let inscriptionId: number | null = null;

    try {
        const secret = process.env.JWT_SECRET || 'fallback_secret_change_me';
        const decoded = jwt.verify(token, secret) as any;

        if (!decoded || !decoded.inscriptionId) {
            return (
                <div style={{ padding: '50px', textAlign: 'center', color: 'red' }}>
                    <h1>Enlace inválido o expirado</h1>
                </div>
            );
        }

        inscriptionId = decoded.inscriptionId;

    } catch (error) {
        return (
            <div style={{ padding: '50px', textAlign: 'center', color: '#666' }}>
                <h1>Enlace expirado</h1>
                <p>Por favor, solicita un nuevo enlace de recibo.</p>
            </div>
        );
    }

    // Obtener datos del recibo
    let reciboData = null;
    try {
        const result = await pool.query(`
      SELECT i.id, i.fecha_inicio, i.costo_total, i.saldo_pendiente, i.estado,
             u.nombre as alumno_nombre,
             c.nombre as curso_nombre,
             COALESCE(i.nombre_curso_especifico, c.nombre) as curso_display
      FROM inscripciones i
      JOIN usuarios u ON i.usuario_id = u.id
      LEFT JOIN cursos c ON i.curso_id = c.id
      WHERE i.id = $1
    `, [inscriptionId]);

        if (result.rows.length === 0) {
            return notFound();
        }

        const row = result.rows[0];

        const costoTotal = parseFloat(row.costo_total);
        const saldoPendiente = parseFloat(row.saldo_pendiente);
        const totalPagado = costoTotal - saldoPendiente;

        // Formatear datos para el componente visual
        reciboData = {
            folio: `BRO-${row.id.toString().padStart(6, '0')}`,
            fecha: new Date(row.fecha_inicio).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' }),
            alumno: row.alumno_nombre,
            curso: row.curso_display || row.curso_nombre || 'Curso General',
            costo_total: costoTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
            saldo_pendiente: saldoPendiente.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
            total_pagado: totalPagado.toLocaleString('es-MX', { minimumFractionDigits: 2 }),
            concepto: `Estado de Cuenta`,
            estado: row.estado === 'activo' ? 'Activo' : row.estado,
        };

    } catch (dbError) {
        console.error('Error fetching receipt data:', dbError);
        return <div>Error al cargar los datos del recibo.</div>;
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f5f7fa', padding: '40px 20px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: '#2c3e50', marginBottom: '10px' }}>Detalles del Recibo</h1>
                <p style={{ color: '#7f8c8d' }}>Cursos Brooklyn</p>
            </div>

            <ReciboDisplay data={reciboData} />

            <div style={{ textAlign: 'center', marginTop: '40px', fontSize: '0.9rem', color: '#bdc3c7' }}>
                <p>© {new Date().getFullYear()} Cursos Brooklyn. Todos los derechos reservados.</p>
            </div>
        </div>
    );
}
