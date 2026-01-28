import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_CONFIG, formatFecha, formatMonto } from '../config';

interface Pago {
  id: number;
  monto: number;
  metodo_pago: string;
  fecha_pago: string;
  curso_nombre: string;
}

interface Inscripcion {
  id: number;
  curso_nombre: string;
  costo_total: number;
  saldo_pendiente: number;
  estado: string;
}

interface DatosHistorial {
  alumno: {
    id: number;
    nombre: string;
    celular: string;
    email: string | null;
  };
  inscripciones: Inscripcion[];
  pagos: Pago[];
}

export function generarHistorialPagos(datos: DatosHistorial): jsPDF {
  const { empresa, colores, margenes, fuentes } = PDF_CONFIG;
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  let y = margenes.top;

  // Header con fondo azul
  doc.setFillColor(...colores.primaryRGB);
  doc.rect(0, 0, pageWidth, 45, 'F');

  // Nombre de la empresa
  doc.setTextColor(...colores.whiteRGB);
  doc.setFontSize(fuentes.header);
  doc.setFont('helvetica', 'bold');
  doc.text(empresa.nombre, pageWidth / 2, y, { align: 'center' });

  y += 8;
  doc.setFontSize(fuentes.normal);
  doc.setFont('helvetica', 'normal');
  doc.text(empresa.subtitulo, pageWidth / 2, y, { align: 'center' });

  y += 6;
  doc.setFontSize(fuentes.small);
  doc.text(`Tel: ${empresa.telefono}`, pageWidth / 2, y, { align: 'center' });

  // Titulo del documento
  y = 55;
  doc.setTextColor(...colores.blackRGB);
  doc.setFontSize(fuentes.title);
  doc.setFont('helvetica', 'bold');
  doc.text('HISTORIAL DE PAGOS', pageWidth / 2, y, { align: 'center' });

  // Linea separadora
  y += 10;
  doc.setDrawColor(...colores.grayLightRGB);
  doc.setLineWidth(0.5);
  doc.line(margenes.left, y, pageWidth - margenes.right, y);

  // Datos del alumno
  y += 12;
  doc.setTextColor(...colores.blackRGB);
  doc.setFontSize(fuentes.normal);
  doc.setFont('helvetica', 'bold');
  doc.text('Alumno:', margenes.left, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.alumno.nombre, margenes.left + 25, y);

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Telefono:', margenes.left, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.alumno.celular, margenes.left + 25, y);

  if (datos.alumno.email) {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Email:', margenes.left, y);
    doc.setFont('helvetica', 'normal');
    doc.text(datos.alumno.email, margenes.left + 25, y);
  }

  // Inscripciones activas
  y += 15;
  doc.setFontSize(fuentes.large);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colores.primaryRGB);
  doc.text('Inscripciones Activas', margenes.left, y);

  if (datos.inscripciones.length > 0) {
    const inscripcionesData = datos.inscripciones.map(i => [
      i.curso_nombre,
      formatMonto(i.costo_total),
      formatMonto(i.saldo_pendiente),
      i.estado.charAt(0).toUpperCase() + i.estado.slice(1)
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: [['Curso', 'Costo Total', 'Saldo Pendiente', 'Estado']],
      body: inscripcionesData,
      theme: 'striped',
      headStyles: {
        fillColor: colores.primaryRGB,
        textColor: colores.whiteRGB,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { halign: 'right' },
        2: { halign: 'right' },
        3: { halign: 'center' }
      },
      margin: { left: margenes.left, right: margenes.right }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 15;
  } else {
    y += 10;
    doc.setTextColor(...colores.grayRGB);
    doc.setFontSize(fuentes.normal);
    doc.setFont('helvetica', 'normal');
    doc.text('No hay inscripciones activas', margenes.left, y);
    y += 15;
  }

  // Historial de pagos
  doc.setFontSize(fuentes.large);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colores.primaryRGB);
  doc.text('Historial de Pagos', margenes.left, y);

  if (datos.pagos.length > 0) {
    const pagosData = datos.pagos.map(p => [
      formatFecha(p.fecha_pago),
      p.curso_nombre,
      formatMonto(p.monto),
      p.metodo_pago.charAt(0).toUpperCase() + p.metodo_pago.slice(1)
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: [['Fecha', 'Curso', 'Monto', 'Metodo']],
      body: pagosData,
      theme: 'striped',
      headStyles: {
        fillColor: colores.primaryRGB,
        textColor: colores.whiteRGB,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 45 },
        1: { cellWidth: 60 },
        2: { halign: 'right', cellWidth: 35 },
        3: { halign: 'center', cellWidth: 30 }
      },
      margin: { left: margenes.left, right: margenes.right }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 10;
  } else {
    y += 10;
    doc.setTextColor(...colores.grayRGB);
    doc.setFontSize(fuentes.normal);
    doc.setFont('helvetica', 'normal');
    doc.text('No hay pagos registrados', margenes.left, y);
    y += 10;
  }

  // Resumen total
  const totalPagado = datos.pagos.reduce((sum, p) => sum + p.monto, 0);
  const saldoTotal = datos.inscripciones.reduce((sum, i) => sum + i.saldo_pendiente, 0);

  y += 5;
  doc.setDrawColor(...colores.grayLightRGB);
  doc.line(margenes.left, y, pageWidth - margenes.right, y);

  y += 12;
  doc.setFillColor(...colores.grayLightRGB);
  doc.roundedRect(margenes.left, y - 5, pageWidth - margenes.left - margenes.right, 30, 3, 3, 'F');

  const col1 = margenes.left + 10;
  const col2 = pageWidth / 2 + 10;

  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.text('TOTAL HISTORICO PAGADO', col1, y);
  doc.text('SALDO PENDIENTE TOTAL', col2, y);

  y += 10;
  doc.setTextColor(...colores.successRGB);
  doc.setFontSize(fuentes.large);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMonto(totalPagado), col1, y);

  if (saldoTotal > 0) {
    doc.setTextColor(...colores.dangerRGB);
  } else {
    doc.setTextColor(...colores.successRGB);
  }
  doc.text(formatMonto(saldoTotal), col2, y);

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 15;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el ${formatFecha(new Date())}`, pageWidth / 2, footerY, { align: 'center' });

  return doc;
}
