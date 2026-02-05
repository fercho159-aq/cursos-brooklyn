import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { PDF_CONFIG, formatFecha, formatMonto } from '../config';

interface Pago {
  id: number;
  monto: number;
  fecha_pago: string;
  metodo_pago: string;
}

interface DatosAdeudo {
  alumno: {
    nombre: string;
    celular: string;
  };
  inscripcion: {
    id: number;
    curso_nombre: string;
    costo_total: number;
    saldo_pendiente: number;
    fecha_inicio: string | null;
  };
  pagos: Pago[];
}

export function generarNotaAdeudo(datos: DatosAdeudo): jsPDF {
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
  doc.setTextColor(...colores.dangerRGB);
  doc.setFontSize(fuentes.title);
  doc.setFont('helvetica', 'bold');
  doc.text('NOTA DE ADEUDO', pageWidth / 2, y, { align: 'center' });

  y += 8;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha: ${formatFecha(new Date())}`, pageWidth / 2, y, { align: 'center' });

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

  y += 7;
  doc.setFont('helvetica', 'bold');
  doc.text('Curso:', margenes.left, y);
  doc.setFont('helvetica', 'normal');
  doc.text(datos.inscripcion.curso_nombre, margenes.left + 25, y);

  if (datos.inscripcion.fecha_inicio) {
    y += 7;
    doc.setFont('helvetica', 'bold');
    doc.text('Inicio:', margenes.left, y);
    doc.setFont('helvetica', 'normal');
    doc.text(formatFecha(datos.inscripcion.fecha_inicio), margenes.left + 25, y);
  }

  // Cuadro de saldo pendiente destacado
  y += 15;
  doc.setFillColor(...colores.dangerRGB);
  doc.roundedRect(margenes.left, y, pageWidth - margenes.left - margenes.right, 35, 3, 3, 'F');

  y += 12;
  doc.setTextColor(...colores.whiteRGB);
  doc.setFontSize(fuentes.small);
  doc.text('SALDO PENDIENTE', pageWidth / 2, y, { align: 'center' });

  y += 12;
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMonto(datos.inscripcion.saldo_pendiente), pageWidth / 2, y, { align: 'center' });

  // Desglose
  y += 25;
  doc.setTextColor(...colores.blackRGB);
  doc.setFontSize(fuentes.large);
  doc.setFont('helvetica', 'bold');
  doc.text('Desglose', margenes.left, y);

  y += 5;
  const totalPagado = datos.inscripcion.costo_total - datos.inscripcion.saldo_pendiente;

  const desgloseData = [
    ['Costo total del curso', formatMonto(datos.inscripcion.costo_total)],
    ['Total de abonos realizados', formatMonto(totalPagado)],
    ['Saldo pendiente', formatMonto(datos.inscripcion.saldo_pendiente)]
  ];

  autoTable(doc, {
    startY: y,
    body: desgloseData,
    theme: 'plain',
    bodyStyles: {
      fontSize: 10
    },
    columnStyles: {
      0: { cellWidth: 100 },
      1: { halign: 'right', fontStyle: 'bold' }
    },
    margin: { left: margenes.left, right: margenes.right },
    didParseCell: (data) => {
      if (data.row.index === 2) {
        data.cell.styles.textColor = colores.dangerRGB;
      }
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = (doc as any).lastAutoTable.finalY + 10;

  // Historial de abonos
  if (datos.pagos.length > 0) {
    doc.setTextColor(...colores.blackRGB);
    doc.setFontSize(fuentes.large);
    doc.setFont('helvetica', 'bold');
    doc.text('Abonos Realizados', margenes.left, y);

    const pagosData = datos.pagos.map(p => [
      formatFecha(p.fecha_pago),
      formatMonto(p.monto),
      p.metodo_pago.charAt(0).toUpperCase() + p.metodo_pago.slice(1)
    ]);

    autoTable(doc, {
      startY: y + 5,
      head: [['Fecha', 'Monto', 'Metodo']],
      body: pagosData,
      theme: 'striped',
      headStyles: {
        fillColor: colores.grayRGB,
        textColor: colores.whiteRGB,
        fontStyle: 'bold',
        fontSize: 9
      },
      bodyStyles: {
        fontSize: 9
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { halign: 'right', cellWidth: 50 },
        2: { halign: 'center' }
      },
      margin: { left: margenes.left, right: margenes.right }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    y = (doc as any).lastAutoTable.finalY + 15;
  }

  // Mensaje amable
  y += 5;
  doc.setFillColor(...colores.grayLightRGB);
  doc.roundedRect(margenes.left, y, pageWidth - margenes.left - margenes.right, 25, 3, 3, 'F');

  y += 10;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.normal);
  doc.setFont('helvetica', 'normal');
  const mensaje = 'Le recordamos amablemente que tiene un saldo pendiente. Agradecemos su pronta atencion.';
  doc.text(mensaje, pageWidth / 2, y, { align: 'center', maxWidth: pageWidth - margenes.left - margenes.right - 20 });

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.text('Para cualquier aclaracion, comuniquese con nosotros.', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Tel: ${empresa.telefono}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc;
}
