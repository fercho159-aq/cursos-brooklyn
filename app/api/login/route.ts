import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/lib/db';
import { createToken, setTokenCookie } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { celular, password } = await request.json();

    const result = await pool.query('SELECT * FROM usuarios WHERE celular = $1', [celular]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 });
    }

    const usuario = result.rows[0];

    if (usuario.password) {
      if (!password) {
        return NextResponse.json({ error: 'Contraseña requerida' }, { status: 401 });
      }
      const validPassword = await bcrypt.compare(password, usuario.password);
      if (!validPassword) {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 });
      }
    }

    const token = createToken({
      id: usuario.id,
      nombre: usuario.nombre,
      celular: usuario.celular,
      email: usuario.email,
      rol: usuario.rol
    });

    const response = NextResponse.json({
      success: true,
      token: token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        celular: usuario.celular,
        email: usuario.email,
        rol: usuario.rol
      },
      redirect: usuario.rol === 'admin' ? '/admin' : '/alumno'
    });

    response.headers.set('Set-Cookie', setTokenCookie(token));

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json({ error: 'Error al iniciar sesion' }, { status: 500 });
  }
}
