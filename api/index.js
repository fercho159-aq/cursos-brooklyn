const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookie = require('cookie');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');

const app = express();

// Configuración
const JWT_SECRET = process.env.JWT_SECRET || process.env.SESSION_SECRET || 'cursos_brooklyn_jwt_secret_2025';
const DATABASE_URL = process.env.DATABASE_URL;

// Pool de conexiones
const pool = new Pool({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper para parsear cookies
const parseCookies = (req) => {
    return cookie.parse(req.headers.cookie || '');
};

// Helper para setear cookie
const setCookie = (res, token) => {
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24 horas
        path: '/'
    }));
};

// Helper para limpiar cookie
const clearCookie = (res) => {
    const isProduction = process.env.VERCEL === '1' || process.env.NODE_ENV === 'production';
    res.setHeader('Set-Cookie', cookie.serialize('token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax',
        maxAge: 0,
        path: '/'
    }));
};

// Middleware para verificar JWT
const verifyToken = (req) => {
    // Intentar obtener token del header Authorization primero
    let token = null;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
    }

    // Si no hay token en header, intentar cookie
    if (!token) {
        const cookies = parseCookies(req);
        token = cookies.token;
    }

    if (!token) {
        console.log('No se encontró token');
        return null;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        console.log('Token válido, usuario:', decoded.nombre);
        return decoded;
    } catch (e) {
        console.log('Token inválido:', e.message);
        return null;
    }
};

// Middleware de autenticación
const requireAuth = (req, res, next) => {
    const usuario = verifyToken(req);
    if (usuario) {
        req.usuario = usuario;
        next();
    } else {
        console.log('requireAuth: No autorizado');
        res.status(401).json({ error: 'No autorizado' });
    }
};

const requireAdmin = (req, res, next) => {
    const usuario = verifyToken(req);
    if (usuario && usuario.rol === 'admin') {
        req.usuario = usuario;
        next();
    } else {
        res.status(403).json({ error: 'Acceso denegado' });
    }
};

// Configuración de email
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.EMAIL_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

const enviarEmailBienvenida = async (usuario, inscripcion, curso, horario) => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log('Email no configurado, saltando envío');
        return;
    }

    try {
        const transporter = createTransporter();
        await transporter.sendMail({
            from: process.env.EMAIL_FROM || 'Cursos Brooklyn <noreply@cursosbrooklyn.com>',
            to: usuario.email,
            subject: '¡Bienvenido a Cursos Brooklyn!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #667eea;">¡Bienvenido ${usuario.nombre}!</h1>
                    <p>Te has inscrito exitosamente al curso de <strong>${curso?.nombre || 'Brooklyn'}</strong>.</p>
                    <p><strong>Horario:</strong> ${horario?.nombre || 'Por confirmar'}</p>
                    <p><strong>Inicio:</strong> ${new Date(inscripcion.fecha_inicio).toLocaleDateString('es-MX')}</p>
                    <p>¡Te esperamos!</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Error enviando email:', error);
    }
};

// ===================== RUTAS API =====================

// Obtener datos del usuario actual
app.get('/api/me', requireAuth, (req, res) => {
    res.json(req.usuario);
});

// Registro rápido
app.post('/api/registro-rapido', async (req, res) => {
    const { nombre, celular, curso_id, horario_id, email, fecha_inicio, fecha_fin, promocion,
        edad, fecha_cumpleanos, nombre_curso_especifico, horario_otro, password } = req.body;

    try {
        const existe = await pool.query('SELECT id FROM usuarios WHERE celular = $1', [celular]);

        let usuario;
        if (existe.rows.length > 0) {
            usuario = existe.rows[0];
            if (password) {
                const hashedPassword = await bcrypt.hash(password, 10);
                await pool.query(
                    'UPDATE usuarios SET nombre = $1, email = $2, edad = $3, fecha_cumpleanos = $4, password = $5 WHERE id = $6',
                    [nombre, email || null, edad || null, fecha_cumpleanos || null, hashedPassword, usuario.id]
                );
            } else {
                await pool.query(
                    'UPDATE usuarios SET nombre = $1, email = $2, edad = $3, fecha_cumpleanos = $4 WHERE id = $5',
                    [nombre, email || null, edad || null, fecha_cumpleanos || null, usuario.id]
                );
            }
        } else {
            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            const result = await pool.query(
                'INSERT INTO usuarios (nombre, celular, email, edad, fecha_cumpleanos, password) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [nombre, celular, email || null, edad || null, fecha_cumpleanos || null, hashedPassword]
            );
            usuario = result.rows[0];
        }

        const curso = await pool.query('SELECT * FROM cursos WHERE id = $1', [curso_id]);
        const horario = await pool.query('SELECT * FROM horarios WHERE id = $1', [horario_id]);

        let fechaInicioFinal, fechaFinFinal;
        if (fecha_inicio && fecha_fin) {
            fechaInicioFinal = new Date(fecha_inicio);
            fechaFinFinal = new Date(fecha_fin);
        } else if (fecha_inicio) {
            fechaInicioFinal = new Date(fecha_inicio);
            fechaFinFinal = new Date(fechaInicioFinal);
            fechaFinFinal.setDate(fechaFinFinal.getDate() + 28);
        } else {
            fechaInicioFinal = new Date();
            fechaFinFinal = new Date();
            fechaFinFinal.setDate(fechaFinFinal.getDate() + 28);
        }

        const costoTotal = curso.rows[0]?.costo || 1900;

        const inscripcion = await pool.query(
            `INSERT INTO inscripciones (usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin, costo_total, saldo_pendiente, promocion, nombre_curso_especifico, horario_otro)
             VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8, $9) RETURNING *`,
            [usuario.id, curso_id, horario_id, fechaInicioFinal, fechaFinFinal, costoTotal, promocion || null, nombre_curso_especifico || null, horario_otro || null]
        );

        if (email) {
            await enviarEmailBienvenida(
                { ...usuario, email },
                inscripcion.rows[0],
                curso.rows[0],
                horario.rows[0]
            );
        }

        res.json({
            success: true,
            message: '¡Registro exitoso!',
            usuario: usuario,
            inscripcion: inscripcion.rows[0]
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ error: 'Error al registrar. Intenta de nuevo.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { celular, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE celular = $1', [celular]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = result.rows[0];

        if (usuario.password) {
            if (!password) {
                return res.status(401).json({ error: 'Contraseña requerida' });
            }
            const validPassword = await bcrypt.compare(password, usuario.password);
            if (!validPassword) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }
        }

        // Crear JWT
        const token = jwt.sign({
            id: usuario.id,
            nombre: usuario.nombre,
            celular: usuario.celular,
            email: usuario.email,
            rol: usuario.rol
        }, JWT_SECRET, { expiresIn: '24h' });

        console.log('Login exitoso para:', usuario.nombre, '- Rol:', usuario.rol);

        // También setear cookie como backup
        setCookie(res, token);

        res.json({
            success: true,
            token: token, // Enviar token para localStorage
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                celular: usuario.celular,
                email: usuario.email,
                rol: usuario.rol
            },
            redirect: usuario.rol === 'admin' ? '/admin.html' : '/alumno.html'
        });

    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Logout
app.post('/api/logout', (req, res) => {
    clearCookie(res);
    res.json({ success: true });
});

// Obtener cursos
app.get('/api/cursos', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cursos WHERE activo = true ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cursos' });
    }
});

// Obtener horarios
app.get('/api/horarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM horarios WHERE activo = true ORDER BY id');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener horarios' });
    }
});

// ===================== RUTAS ALUMNO =====================

app.get('/api/alumno/inscripciones', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT i.*, c.nombre as curso_nombre, h.nombre as horario_nombre
            FROM inscripciones i
            JOIN cursos c ON i.curso_id = c.id
            JOIN horarios h ON i.horario_id = h.id
            WHERE i.usuario_id = $1
            ORDER BY i.created_at DESC
        `, [req.usuario.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inscripciones' });
    }
});

app.get('/api/alumno/pagos', requireAuth, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, c.nombre as curso_nombre
            FROM pagos p
            JOIN inscripciones i ON p.inscripcion_id = i.id
            JOIN cursos c ON i.curso_id = c.id
            WHERE p.usuario_id = $1
            ORDER BY p.fecha_pago DESC
        `, [req.usuario.id]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener pagos' });
    }
});

app.get('/api/alumno/lecciones', requireAuth, async (req, res) => {
    try {
        const inscripciones = await pool.query(`
            SELECT DISTINCT c.nombre as tipo_curso
            FROM inscripciones i
            JOIN cursos c ON i.curso_id = c.id
            WHERE i.usuario_id = $1 AND i.estado = 'activo'
        `, [req.usuario.id]);

        if (inscripciones.rows.length === 0) {
            return res.json({ cursos: [], lecciones: [] });
        }

        const tiposCurso = inscripciones.rows.map(i => i.tipo_curso);

        const lecciones = await pool.query(`
            SELECT l.*,
                   COALESCE(p.completado, false) as completado,
                   p.fecha_completado
            FROM lecciones l
            LEFT JOIN progreso_alumno p ON l.id = p.leccion_id AND p.usuario_id = $1
            WHERE l.tipo_curso = ANY($2) AND l.activo = true
            ORDER BY l.curso_nombre, l.orden
        `, [req.usuario.id, tiposCurso]);

        const cursosAgrupados = {};
        lecciones.rows.forEach(leccion => {
            if (!cursosAgrupados[leccion.curso_nombre]) {
                cursosAgrupados[leccion.curso_nombre] = {
                    nombre: leccion.curso_nombre,
                    tipo: leccion.tipo_curso,
                    modulo: leccion.modulo,
                    lecciones: [],
                    completadas: 0,
                    total: 0
                };
            }
            cursosAgrupados[leccion.curso_nombre].lecciones.push(leccion);
            cursosAgrupados[leccion.curso_nombre].total++;
            if (leccion.completado) {
                cursosAgrupados[leccion.curso_nombre].completadas++;
            }
        });

        res.json({
            tiposCurso,
            cursos: Object.values(cursosAgrupados)
        });
    } catch (error) {
        console.error('Error al obtener lecciones:', error);
        res.status(500).json({ error: 'Error al obtener lecciones' });
    }
});

app.post('/api/alumno/lecciones/:id/completar', requireAuth, async (req, res) => {
    try {
        const leccionId = req.params.id;
        const usuarioId = req.usuario.id;

        await pool.query(`
            INSERT INTO progreso_alumno (usuario_id, leccion_id, completado, fecha_completado)
            VALUES ($1, $2, true, NOW())
            ON CONFLICT (usuario_id, leccion_id)
            DO UPDATE SET completado = true, fecha_completado = NOW()
        `, [usuarioId, leccionId]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al marcar lección' });
    }
});

app.post('/api/alumno/lecciones/:id/desmarcar', requireAuth, async (req, res) => {
    try {
        const leccionId = req.params.id;
        const usuarioId = req.usuario.id;

        await pool.query(`
            UPDATE progreso_alumno SET completado = false, fecha_completado = NULL
            WHERE usuario_id = $1 AND leccion_id = $2
        `, [usuarioId, leccionId]);

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Error al desmarcar lección' });
    }
});

// ===================== RUTAS ADMIN =====================

app.get('/api/admin/alumnos', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*,
                   COUNT(DISTINCT i.id) as total_inscripciones,
                   COALESCE(SUM(p.monto), 0) as total_pagado
            FROM usuarios u
            LEFT JOIN inscripciones i ON u.id = i.usuario_id
            LEFT JOIN pagos p ON u.id = p.usuario_id
            WHERE u.rol = 'alumno'
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener alumnos' });
    }
});

app.get('/api/admin/buscar-alumno/:celular', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT u.*,
                   json_agg(DISTINCT jsonb_build_object(
                       'id', i.id,
                       'curso', c.nombre,
                       'horario', h.nombre,
                       'fecha_inicio', i.fecha_inicio,
                       'fecha_fin', i.fecha_fin,
                       'costo_total', i.costo_total,
                       'saldo_pendiente', i.saldo_pendiente,
                       'estado', i.estado
                   )) FILTER (WHERE i.id IS NOT NULL) as inscripciones
            FROM usuarios u
            LEFT JOIN inscripciones i ON u.id = i.usuario_id
            LEFT JOIN cursos c ON i.curso_id = c.id
            LEFT JOIN horarios h ON i.horario_id = h.id
            WHERE u.celular LIKE $1
            GROUP BY u.id
        `, [`%${req.params.celular}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar alumno' });
    }
});

app.get('/api/admin/alumno/:id', requireAdmin, async (req, res) => {
    try {
        const alumno = await pool.query('SELECT * FROM usuarios WHERE id = $1', [req.params.id]);
        const inscripciones = await pool.query(`
            SELECT i.*, c.nombre as curso_nombre, h.nombre as horario_nombre
            FROM inscripciones i
            JOIN cursos c ON i.curso_id = c.id
            JOIN horarios h ON i.horario_id = h.id
            WHERE i.usuario_id = $1
            ORDER BY i.created_at DESC
        `, [req.params.id]);
        const pagos = await pool.query(`
            SELECT p.*, c.nombre as curso_nombre
            FROM pagos p
            JOIN inscripciones i ON p.inscripcion_id = i.id
            JOIN cursos c ON i.curso_id = c.id
            WHERE p.usuario_id = $1
            ORDER BY p.fecha_pago DESC
        `, [req.params.id]);

        res.json({
            alumno: alumno.rows[0],
            inscripciones: inscripciones.rows,
            pagos: pagos.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener detalles del alumno' });
    }
});

app.post('/api/admin/inscripcion', requireAdmin, async (req, res) => {
    const { usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin, costo_total, promocion } = req.body;

    try {
        const inicio = new Date(fecha_inicio);
        let fin;
        if (fecha_fin) {
            fin = new Date(fecha_fin);
        } else {
            fin = new Date(inicio);
            fin.setDate(fin.getDate() + 28);
        }

        const result = await pool.query(
            `INSERT INTO inscripciones (usuario_id, curso_id, horario_id, fecha_inicio, fecha_fin, costo_total, saldo_pendiente, promocion)
             VALUES ($1, $2, $3, $4, $5, $6, $6, $7) RETURNING *`,
            [usuario_id, curso_id, horario_id, inicio, fin, costo_total || 1900, promocion || null]
        );

        const alumno = await pool.query('SELECT * FROM usuarios WHERE id = $1', [usuario_id]);
        const curso = await pool.query('SELECT * FROM cursos WHERE id = $1', [curso_id]);
        const horario = await pool.query('SELECT * FROM horarios WHERE id = $1', [horario_id]);

        if (alumno.rows[0].email) {
            await enviarEmailBienvenida(
                alumno.rows[0],
                result.rows[0],
                curso.rows[0],
                horario.rows[0]
            );
        }

        res.json({ success: true, inscripcion: result.rows[0] });
    } catch (error) {
        console.error('Error al crear inscripción:', error);
        res.status(500).json({ error: 'Error al crear inscripción' });
    }
});

app.post('/api/admin/pago', requireAdmin, async (req, res) => {
    const { inscripcion_id, monto, metodo_pago, notas } = req.body;

    try {
        const inscripcion = await pool.query('SELECT * FROM inscripciones WHERE id = $1', [inscripcion_id]);

        if (inscripcion.rows.length === 0) {
            return res.status(404).json({ error: 'Inscripción no encontrada' });
        }

        const pago = await pool.query(
            `INSERT INTO pagos (inscripcion_id, usuario_id, monto, metodo_pago, notas, registrado_por)
             VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [inscripcion_id, inscripcion.rows[0].usuario_id, monto, metodo_pago, notas, req.usuario.id]
        );

        const nuevoSaldo = Math.max(0, inscripcion.rows[0].saldo_pendiente - monto);
        await pool.query(
            'UPDATE inscripciones SET saldo_pendiente = $1 WHERE id = $2',
            [nuevoSaldo, inscripcion_id]
        );

        res.json({
            success: true,
            pago: pago.rows[0],
            nuevo_saldo: nuevoSaldo
        });
    } catch (error) {
        console.error('Error al registrar pago:', error);
        res.status(500).json({ error: 'Error al registrar pago' });
    }
});

app.get('/api/admin/stats', requireAdmin, async (req, res) => {
    try {
        const totalAlumnos = await pool.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'alumno'");
        const inscripcionesActivas = await pool.query("SELECT COUNT(*) FROM inscripciones WHERE estado = 'activo'");
        const pagosHoy = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE DATE(fecha_pago) = CURRENT_DATE");
        const pagosMes = await pool.query("SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE EXTRACT(MONTH FROM fecha_pago) = EXTRACT(MONTH FROM CURRENT_DATE)");
        const saldoPendiente = await pool.query("SELECT COALESCE(SUM(saldo_pendiente), 0) as total FROM inscripciones WHERE estado = 'activo'");

        res.json({
            totalAlumnos: parseInt(totalAlumnos.rows[0].count),
            inscripcionesActivas: parseInt(inscripcionesActivas.rows[0].count),
            pagosHoy: parseFloat(pagosHoy.rows[0].total),
            pagosMes: parseFloat(pagosMes.rows[0].total),
            saldoPendiente: parseFloat(saldoPendiente.rows[0].total)
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estadísticas' });
    }
});

app.get('/api/admin/buscar/:query', requireAdmin, async (req, res) => {
    try {
        const query = req.params.query;
        const result = await pool.query(`
            SELECT u.*,
                   json_agg(DISTINCT jsonb_build_object(
                       'id', i.id,
                       'curso', c.nombre,
                       'nombre_curso_especifico', i.nombre_curso_especifico,
                       'horario', h.nombre,
                       'fecha_inicio', i.fecha_inicio,
                       'fecha_fin', i.fecha_fin,
                       'costo_total', i.costo_total,
                       'saldo_pendiente', i.saldo_pendiente,
                       'estado', i.estado
                   )) FILTER (WHERE i.id IS NOT NULL) as inscripciones
            FROM usuarios u
            LEFT JOIN inscripciones i ON u.id = i.usuario_id
            LEFT JOIN cursos c ON i.curso_id = c.id
            LEFT JOIN horarios h ON i.horario_id = h.id
            WHERE u.nombre ILIKE $1 OR u.celular LIKE $1
            GROUP BY u.id
            LIMIT 20
        `, [`%${query}%`]);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar' });
    }
});

// ===================== RUTAS FINANZAS =====================

app.post('/api/admin/gasto', requireAdmin, async (req, res) => {
    const { tipo, descripcion, monto, fecha } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO gastos (tipo, descripcion, monto, fecha, registrado_por)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [tipo, descripcion || null, monto, fecha || new Date(), req.usuario.id]
        );
        res.json({ success: true, gasto: result.rows[0] });
    } catch (error) {
        console.error('Error al registrar gasto:', error);
        res.status(500).json({ error: 'Error al registrar gasto' });
    }
});

app.get('/api/admin/gastos', requireAdmin, async (req, res) => {
    const { desde, hasta } = req.query;

    try {
        let query = 'SELECT * FROM gastos';
        let params = [];

        if (desde && hasta) {
            query += ' WHERE fecha BETWEEN $1 AND $2';
            params = [desde, hasta];
        } else if (desde) {
            query += ' WHERE fecha >= $1';
            params = [desde];
        }

        query += ' ORDER BY fecha DESC, created_at DESC';

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener gastos' });
    }
});

app.get('/api/admin/finanzas/resumen', requireAdmin, async (req, res) => {
    const { mes, anio, desde, hasta } = req.query;

    try {
        let pagosQuery, gastosQuery;
        let params = [];

        if (desde && hasta) {
            pagosQuery = `SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE DATE(fecha_pago) BETWEEN $1 AND $2`;
            gastosQuery = `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE fecha BETWEEN $1 AND $2`;
            params = [desde, hasta];
        } else {
            const mesActual = mes || new Date().getMonth() + 1;
            const anioActual = anio || new Date().getFullYear();
            pagosQuery = `SELECT COALESCE(SUM(monto), 0) as total FROM pagos WHERE EXTRACT(MONTH FROM fecha_pago) = $1 AND EXTRACT(YEAR FROM fecha_pago) = $2`;
            gastosQuery = `SELECT COALESCE(SUM(monto), 0) as total FROM gastos WHERE EXTRACT(MONTH FROM fecha) = $1 AND EXTRACT(YEAR FROM fecha) = $2`;
            params = [mesActual, anioActual];
        }

        const ingresos = await pool.query(pagosQuery, params);
        const gastos = await pool.query(gastosQuery, params);

        let gastosDesglose;
        if (desde && hasta) {
            gastosDesglose = await pool.query(`
                SELECT tipo, COALESCE(SUM(monto), 0) as total
                FROM gastos WHERE fecha BETWEEN $1 AND $2
                GROUP BY tipo
            `, params);
        } else {
            gastosDesglose = await pool.query(`
                SELECT tipo, COALESCE(SUM(monto), 0) as total
                FROM gastos WHERE EXTRACT(MONTH FROM fecha) = $1 AND EXTRACT(YEAR FROM fecha) = $2
                GROUP BY tipo
            `, params);
        }

        res.json({
            ingresos: parseFloat(ingresos.rows[0].total),
            gastos: parseFloat(gastos.rows[0].total),
            utilidad: parseFloat(ingresos.rows[0].total) - parseFloat(gastos.rows[0].total),
            desglose: gastosDesglose.rows
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener resumen' });
    }
});

app.get('/api/admin/finanzas/movimientos', requireAdmin, async (req, res) => {
    const { fecha } = req.query;
    const fechaBuscar = fecha || new Date().toISOString().split('T')[0];

    try {
        const pagos = await pool.query(`
            SELECT p.*, u.nombre as alumno_nombre, c.nombre as curso_nombre
            FROM pagos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN inscripciones i ON p.inscripcion_id = i.id
            JOIN cursos c ON i.curso_id = c.id
            WHERE DATE(p.fecha_pago) = $1
            ORDER BY p.fecha_pago DESC
        `, [fechaBuscar]);

        const gastos = await pool.query(`
            SELECT * FROM gastos WHERE fecha = $1 ORDER BY created_at DESC
        `, [fechaBuscar]);

        const totalIngresos = pagos.rows.reduce((sum, p) => sum + parseFloat(p.monto), 0);
        const totalGastos = gastos.rows.reduce((sum, g) => sum + parseFloat(g.monto), 0);

        res.json({
            fecha: fechaBuscar,
            pagos: pagos.rows,
            gastos: gastos.rows,
            totalIngresos,
            totalGastos,
            balance: totalIngresos - totalGastos
        });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener movimientos' });
    }
});

app.get('/api/admin/pago/:id/recibo', requireAdmin, async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT p.*, u.nombre as alumno_nombre, u.celular, u.email,
                   c.nombre as curso_nombre, i.nombre_curso_especifico
            FROM pagos p
            JOIN usuarios u ON p.usuario_id = u.id
            JOIN inscripciones i ON p.inscripcion_id = i.id
            JOIN cursos c ON i.curso_id = c.id
            WHERE p.id = $1
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Pago no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener recibo' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export para Vercel
module.exports = app;
