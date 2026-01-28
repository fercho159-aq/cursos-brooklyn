import jsPDF from 'jspdf';
import { PDF_CONFIG, formatFecha, formatMonto } from '../config';

interface DatosRecibo {
  pago: {
    id: number;
    monto: number;
    metodo_pago: string;
    fecha_pago: string;
    comprobante: string | null;
    notas: string | null;
  };
  alumno: {
    nombre: string;
    celular: string;
  };
  inscripcion: {
    id: number;
    curso_nombre: string;
    costo_total: number;
    saldo_pendiente: number;
  };
}

export function generarReciboPago(datos: DatosRecibo): jsPDF {
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
  doc.text('RECIBO DE PAGO', pageWidth / 2, y, { align: 'center' });

  y += 8;
  doc.setFontSize(fuentes.normal);
  doc.setTextColor(...colores.grayRGB);
  doc.text(`No. ${datos.pago.id.toString().padStart(5, '0')}`, pageWidth / 2, y, { align: 'center' });

  // Linea separadora
  y += 10;
  doc.setDrawColor(...colores.grayLightRGB);
  doc.setLineWidth(0.5);
  doc.line(margenes.left, y, pageWidth - margenes.right, y);

  // Datos del alumno
  y += 15;
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

  // Linea separadora
  y += 12;
  doc.line(margenes.left, y, pageWidth - margenes.right, y);

  // Detalles del pago - Cuadro destacado
  y += 10;
  doc.setFillColor(...colores.grayLightRGB);
  doc.roundedRect(margenes.left, y, pageWidth - margenes.left - margenes.right, 45, 3, 3, 'F');

  y += 12;
  const col1 = margenes.left + 10;
  const col2 = pageWidth / 2 + 10;

  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.text('MONTO PAGADO', col1, y);
  doc.text('METODO DE PAGO', col2, y);

  y += 8;
  doc.setTextColor(...colores.successRGB);
  doc.setFontSize(fuentes.large);
  doc.setFont('helvetica', 'bold');
  doc.text(formatMonto(datos.pago.monto), col1, y);

  doc.setTextColor(...colores.blackRGB);
  doc.setFontSize(fuentes.normal);
  doc.setFont('helvetica', 'normal');
  const metodoPago = datos.pago.metodo_pago.charAt(0).toUpperCase() + datos.pago.metodo_pago.slice(1);
  doc.text(metodoPago, col2, y);

  y += 12;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.text('FECHA DE PAGO', col1, y);
  if (datos.pago.comprobante) {
    doc.text('COMPROBANTE', col2, y);
  }

  y += 8;
  doc.setTextColor(...colores.blackRGB);
  doc.setFontSize(fuentes.normal);
  doc.text(formatFecha(datos.pago.fecha_pago), col1, y);
  if (datos.pago.comprobante) {
    doc.text(datos.pago.comprobante, col2, y);
  }

  // Resumen financiero
  y += 25;
  doc.setDrawColor(...colores.grayLightRGB);
  doc.line(margenes.left, y, pageWidth - margenes.right, y);

  y += 15;
  doc.setFontSize(fuentes.normal);

  const labelX = margenes.left;
  const valueX = pageWidth - margenes.right;

  // Costo total
  doc.setTextColor(...colores.grayRGB);
  doc.text('Costo total del curso:', labelX, y);
  doc.setTextColor(...colores.blackRGB);
  doc.text(formatMonto(datos.inscripcion.costo_total), valueX, y, { align: 'right' });

  // Total pagado (costo_total - saldo_pendiente + monto actual ya descontado)
  y += 10;
  const totalPagado = datos.inscripcion.costo_total - datos.inscripcion.saldo_pendiente;
  doc.setTextColor(...colores.grayRGB);
  doc.text('Total pagado a la fecha:', labelX, y);
  doc.setTextColor(...colores.successRGB);
  doc.text(formatMonto(totalPagado), valueX, y, { align: 'right' });

  // Saldo pendiente
  y += 10;
  doc.setTextColor(...colores.grayRGB);
  doc.text('Saldo pendiente:', labelX, y);
  if (datos.inscripcion.saldo_pendiente > 0) {
    doc.setTextColor(...colores.dangerRGB);
  } else {
    doc.setTextColor(...colores.successRGB);
  }
  doc.setFont('helvetica', 'bold');
  doc.text(formatMonto(datos.inscripcion.saldo_pendiente), valueX, y, { align: 'right' });

  // Notas si existen
  if (datos.pago.notas) {
    y += 20;
    doc.setTextColor(...colores.grayRGB);
    doc.setFontSize(fuentes.small);
    doc.setFont('helvetica', 'normal');
    doc.text('Notas:', margenes.left, y);
    y += 5;
    doc.setTextColor(...colores.blackRGB);
    const notasLines = doc.splitTextToSize(datos.pago.notas, pageWidth - margenes.left - margenes.right);
    doc.text(notasLines, margenes.left, y);
  }

  // Footer
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setTextColor(...colores.grayRGB);
  doc.setFontSize(fuentes.small);
  doc.text('Gracias por su pago', pageWidth / 2, footerY, { align: 'center' });
  doc.text(`Generado el ${formatFecha(new Date())}`, pageWidth / 2, footerY + 5, { align: 'center' });

  return doc;
}
