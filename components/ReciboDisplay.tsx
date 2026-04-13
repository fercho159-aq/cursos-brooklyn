'use client';

import { useRef } from 'react';
import jsPDF from 'jspdf';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload } from '@fortawesome/free-solid-svg-icons';

interface PagoItem {
    id: number;
    monto: string | number;
    metodo_pago: string;
    fecha_pago: string;
    notas?: string;
}

interface ReciboProps {
    data: {
        folio: string;
        fecha: string;
        alumno: string;
        curso: string;
        costo_total: string;
        saldo_pendiente: string;
        total_pagado: string;
        concepto: string;
        estado: string;
        forma_pago?: string;
        promocion?: string | null;
        historial_pagos?: PagoItem[];
    };
}

export default function ReciboDisplay({ data }: ReciboProps) {
    const reciboRef = useRef<HTMLDivElement>(null);

    const generarPDF = () => {
        const doc = new jsPDF();

        // Configuración de fuente y colores
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(22);
        doc.setTextColor(41, 128, 185); // Un azul profesional
        doc.text('ESTADO DE CUENTA', 105, 20, { align: 'center' });

        doc.setLineWidth(0.5);
        doc.setDrawColor(200, 200, 200);
        doc.line(20, 25, 190, 25);

        // Detalles de la empresa
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100);
        doc.text('Cursos Brooklyn', 20, 35);
        doc.text('contacto@cursosbrooklyn.com', 20, 40);

        // Folio y Fecha
        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`Folio: ${data.folio}`, 140, 35);
        doc.text(`Fecha: ${data.fecha}`, 140, 40);

        // Info del Alumno
        doc.setFillColor(245, 247, 250);
        doc.rect(20, 50, 170, 25, 'F');

        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text('Datos del Alumno:', 25, 60);
        doc.setFont('helvetica', 'normal');
        doc.text(data.alumno, 25, 68);

        // Tabla de concepto
        const startY = 85;
        doc.setFillColor(41, 128, 185);
        doc.rect(20, startY, 170, 10, 'F');
        doc.setTextColor(255);
        doc.setFont('helvetica', 'bold');
        doc.text('Concepto', 25, startY + 7);
        doc.text('Importe', 160, startY + 7);

        // Fila del concepto
        doc.setTextColor(0);
        doc.setFont('helvetica', 'bold'); // Curso en negrita
        doc.text(data.curso, 25, startY + 20);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(data.concepto, 25, startY + 26);

        doc.setFontSize(12);
        doc.setTextColor(0);
        doc.text(`$${data.costo_total}`, 160, startY + 20);


        // Desglose
        let currentY = startY + 35;

        // Si hay promoción
        if (data.promocion) {
            doc.setFontSize(10);
            doc.setTextColor(220, 38, 38); // Rojo para destacar
            doc.text(`Promoción: ${data.promocion}`, 25, startY + 34);
            currentY += 10;
        }

        doc.setFontSize(10);
        doc.setTextColor(0); // Reset color
        doc.text('Total Pagado:', 120, currentY);
        doc.setTextColor(22, 163, 74); // Verde
        doc.text(`$${data.total_pagado}`, 160, currentY);

        currentY += 10;
        doc.setTextColor(0);
        doc.text('Saldo Pendiente:', 120, currentY);
        doc.setTextColor(220, 38, 38); // Rojo
        doc.text(`$${data.saldo_pendiente}`, 160, currentY);


        // Historial de Pagos en PDF
        if (data.historial_pagos && data.historial_pagos.length > 0) {
            currentY += 15;
            doc.setFontSize(11);
            doc.setTextColor(41, 128, 185);
            doc.text('Desglose de Abonos:', 20, currentY);
            
            currentY += 5;
            doc.setFillColor(248, 249, 250);
            doc.rect(20, currentY, 170, 7, 'F');
            doc.setFontSize(9);
            doc.setTextColor(0);
            const headers = ['Fecha', 'Metodo', 'Notas', 'Monto'];
            doc.text(headers[0], 22, currentY + 5);
            doc.text(headers[1], 60, currentY + 5);
            doc.text(headers[2], 100, currentY + 5);
            doc.text(headers[3], 170, currentY + 5, { align: 'right' });

            currentY += 7;
            doc.setFont('helvetica', 'normal');
            
            data.historial_pagos.forEach((pago, index) => {
                if (index > 0) currentY += 6;
                const d = new Date(pago.fecha_pago).toLocaleDateString('es-MX', { timeZone: 'UTC' });
                doc.text(d, 22, currentY + 4);
                doc.text(pago.metodo_pago, 60, currentY + 4);
                const maxLen = 30;
                let nota = pago.notas || '-';
                if (nota.length > maxLen) nota = nota.substring(0, maxLen) + '...';
                doc.text(nota, 100, currentY + 4);
                
                doc.setTextColor(22, 163, 74);
                doc.text(`$${parseFloat(pago.monto.toString()).toLocaleString('es-MX', { minimumFractionDigits: 2 })}`, 170, currentY + 4, { align: 'right' });
                doc.setTextColor(0);
                
                doc.setDrawColor(230, 230, 230);
                doc.line(20, currentY + 6, 190, currentY + 6);
            });
            currentY += 10;
        }

        // Linea final
        doc.setDrawColor(200, 200, 200);
        doc.line(20, currentY, 190, currentY);

        // Pie de pagina
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Gracias por su preferencia.', 105, currentY + 15, { align: 'center' });

        doc.save(`EstadoCuenta-${data.folio}.pdf`);
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto', background: 'white', padding: '30px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>

            {/* Visualización en pantalla (versión simplificada HTML) */}
            <div ref={reciboRef} style={{ marginBottom: '30px', border: '1px solid #eee', padding: '20px', borderRadius: '8px' }}>
                <header style={{ borderBottom: '2px solid #f0f0f0', paddingBottom: '15px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ margin: 0, color: '#2c3e50' }}>Estado de Cuenta</h2>
                        <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>Cursos Brooklyn</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ margin: 0, fontWeight: 'bold', color: '#2c3e50' }}>Folio: #{data.folio}</p>
                        <p style={{ margin: '5px 0 0', color: '#7f8c8d', fontSize: '0.9rem' }}>{data.fecha}</p>
                    </div>
                </header>

                <section style={{ marginBottom: '20px' }}>
                    <p style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: '#95a5a6', fontWeight: 'bold', marginBottom: '8px' }}>Alumno</p>
                    <p style={{ fontSize: '1.1rem', margin: 0, fontWeight: 500 }}>{data.alumno}</p>
                </section>

                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                    <thead>
                        <tr style={{ background: '#f8f9fa', color: '#2c3e50' }}>
                            <th style={{ padding: '10px', textAlign: 'left', borderRadius: '6px 0 0 6px' }}>Concepto</th>
                            <th style={{ padding: '10px', textAlign: 'right', borderRadius: '0 6px 6px 0' }}>Importe</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ padding: '15px 10px', borderBottom: '1px solid #f0f0f0' }}>
                                <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: '#2c3e50' }}>{data.curso}</div>
                                <div style={{ fontSize: '0.85rem', color: '#7f8c8d', marginTop: '4px' }}>{data.concepto}</div>
                                {data.promocion && (
                                    <div style={{ fontSize: '0.9rem', color: '#dc2626', marginTop: '6px', fontWeight: 'bold' }}>
                                        Promoción: {data.promocion}
                                    </div>
                                )}
                            </td>
                            <td style={{ padding: '15px 10px', borderBottom: '1px solid #f0f0f0', textAlign: 'right', fontWeight: 'bold' }}>
                                ${data.costo_total}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#7f8c8d' }}>Abonado / Pagado</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>
                                ${data.total_pagado}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#7f8c8d' }}>Restante por Pagar</td>
                            <td style={{ padding: '10px', textAlign: 'right', color: '#dc2626', fontWeight: 'bold', fontSize: '1.1rem' }}>
                                ${data.saldo_pendiente}
                            </td>
                        </tr>
                    </tfoot>
                </table>

                {data.historial_pagos && data.historial_pagos.length > 0 && (
                    <div style={{ marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1rem', color: '#2c3e50', marginBottom: '10px' }}>Desglose de Abonos</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                            <thead>
                                <tr style={{ background: '#f8f9fa', color: '#7f8c8d' }}>
                                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Fecha</th>
                                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Método</th>
                                    <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #eee' }}>Notas</th>
                                    <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #eee' }}>Monto</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.historial_pagos.map((p, idx) => (
                                    <tr key={idx}>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#2c3e50' }}>{new Date(p.fecha_pago).toLocaleDateString('es-MX', { timeZone: 'UTC' })}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#7f8c8d', textTransform: 'capitalize' }}>{p.metodo_pago}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', color: '#7f8c8d' }}>{p.notas || '-'}</td>
                                        <td style={{ padding: '8px', borderBottom: '1px solid #eee', textAlign: 'right', color: '#16a34a', fontWeight: 'bold' }}>
                                            ${parseFloat(p.monto.toString()).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <div style={{ textAlign: 'center', marginTop: '30px' }}>
                    <span style={{
                        background: data.estado === 'Activo' ? '#dcfce7' : '#fee2e2',
                        color: data.estado === 'Activo' ? '#166534' : '#991b1b',
                        padding: '8px 20px',
                        borderRadius: '50px',
                        fontSize: '0.9rem',
                        fontWeight: 'bold',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        Estado: {data.estado}
                    </span>
                </div>
            </div>

            <button
                onClick={generarPDF}
                style={{
                    width: '100%',
                    padding: '15px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    boxShadow: '0 4px 6px -1px rgba(59, 130, 246, 0.5)'
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = '#2563eb')}
                onMouseOut={(e) => (e.currentTarget.style.background = '#3b82f6')}
            >
                <FontAwesomeIcon icon={faDownload} />
                Descargar PDF
            </button>

        </div>
    );
}
