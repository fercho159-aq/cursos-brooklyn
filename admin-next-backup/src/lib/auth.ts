import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'cursos_brooklyn_jwt_secret_2025';

export interface Usuario {
  id: number;
  nombre: string;
  celular: string;
  email: string | null;
  rol: string;
}

export function createToken(usuario: Usuario): string {
  return jwt.sign(usuario, JWT_SECRET, { expiresIn: '24h' });
}

export function verifyToken(token: string): Usuario | null {
  try {
    return jwt.verify(token, JWT_SECRET) as Usuario;
  } catch {
    return null;
  }
}

export async function getUsuarioFromRequest(request: Request): Promise<Usuario | null> {
  // Intentar obtener token del header Authorization
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return verifyToken(token);
  }

  // Intentar obtener de las cookies
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (token) {
    return verifyToken(token);
  }

  return null;
}

export function setTokenCookie(token: string): string {
  const isProduction = process.env.VERCEL === '1';
  return `token=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Lax; Max-Age=86400; Path=/`;
}

export function clearTokenCookie(): string {
  return 'token=; HttpOnly; SameSite=Lax; Max-Age=0; Path=/';
}
