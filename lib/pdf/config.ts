export const PDF_CONFIG = {
  empresa: {
    nombre: 'CURSOS BROOKLYN',
    subtitulo: 'Ingles y Marketing Digital',
    telefono: '(555) 123-4567',
    direccion: 'Ciudad de Mexico'
  },
  colores: {
    primary: '#2563eb',
    primaryRGB: [37, 99, 235] as [number, number, number],
    gray: '#6b7280',
    grayRGB: [107, 114, 128] as [number, number, number],
    grayLight: '#f3f4f6',
    grayLightRGB: [243, 244, 246] as [number, number, number],
    success: '#16a34a',
    successRGB: [22, 163, 74] as [number, number, number],
    danger: '#dc2626',
    dangerRGB: [220, 38, 38] as [number, number, number],
    black: '#000000',
    blackRGB: [0, 0, 0] as [number, number, number],
    white: '#ffffff',
    whiteRGB: [255, 255, 255] as [number, number, number]
  },
  margenes: {
    top: 20,
    left: 20,
    right: 20,
    bottom: 20
  },
  fuentes: {
    normal: 10,
    small: 8,
    large: 14,
    title: 18,
    header: 24
  }
};

export const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export function formatFecha(fecha: string | Date): string {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = MESES[date.getMonth()];
  const año = date.getFullYear();
  return `${dia} de ${mes}, ${año}`;
}

export function formatMonto(monto: number): string {
  return `$${monto.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} MXN`;
}
