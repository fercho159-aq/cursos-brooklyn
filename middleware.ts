import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  // Rutas protegidas
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');
  const isAlumnoRoute = request.nextUrl.pathname.startsWith('/alumno');

  // Si no hay token y es ruta protegida, redirigir a login
  if (!token && (isAdminRoute || isAlumnoRoute)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/alumno/:path*']
};
