const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Crear tablas si no existen
const initDatabase = async () => {
    const client = await pool.connect();
    try {
        // Tabla de cursos
        await client.query(`
            CREATE TABLE IF NOT EXISTS cursos (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                descripcion TEXT,
                costo DECIMAL(10,2) DEFAULT 1900,
                duracion_semanas INTEGER DEFAULT 4,
                activo BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabla de horarios
        await client.query(`
            CREATE TABLE IF NOT EXISTS horarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(100) NOT NULL,
                dias VARCHAR(100) NOT NULL,
                hora_inicio TIME,
                hora_fin TIME,
                activo BOOLEAN DEFAULT true
            )
        `);

        // Tabla de usuarios (alumnos y admins) - con edad y fecha_cumpleanos
        await client.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id SERIAL PRIMARY KEY,
                nombre VARCHAR(150) NOT NULL,
                celular VARCHAR(20) NOT NULL,
                email VARCHAR(150),
                edad INTEGER,
                fecha_cumpleanos DATE,
                password VARCHAR(255),
                rol VARCHAR(20) DEFAULT 'alumno',
                activo BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Agregar columnas edad y fecha_cumpleanos si no existen
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='usuarios' AND column_name='edad') 
                THEN 
                    ALTER TABLE usuarios ADD COLUMN edad INTEGER;
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='usuarios' AND column_name='fecha_cumpleanos') 
                THEN 
                    ALTER TABLE usuarios ADD COLUMN fecha_cumpleanos DATE;
                END IF;
            END $$;
        `);

        // Tabla de inscripciones
        await client.query(`
            CREATE TABLE IF NOT EXISTS inscripciones (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id),
                curso_id INTEGER REFERENCES cursos(id),
                horario_id INTEGER REFERENCES horarios(id),
                nombre_curso_especifico VARCHAR(200),
                horario_otro VARCHAR(200),
                fecha_inicio DATE NOT NULL,
                fecha_fin DATE NOT NULL,
                modulo_numero INTEGER DEFAULT 1,
                costo_total DECIMAL(10,2) NOT NULL,
                saldo_pendiente DECIMAL(10,2) NOT NULL,
                promocion VARCHAR(200),
                estado VARCHAR(20) DEFAULT 'activo',
                notas TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Agregar columnas nuevas a inscripciones si no existen
        await client.query(`
            DO $$ 
            BEGIN 
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='inscripciones' AND column_name='promocion') 
                THEN 
                    ALTER TABLE inscripciones ADD COLUMN promocion VARCHAR(200);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='inscripciones' AND column_name='nombre_curso_especifico') 
                THEN 
                    ALTER TABLE inscripciones ADD COLUMN nombre_curso_especifico VARCHAR(200);
                END IF;
                IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                              WHERE table_name='inscripciones' AND column_name='horario_otro') 
                THEN 
                    ALTER TABLE inscripciones ADD COLUMN horario_otro VARCHAR(200);
                END IF;
            END $$;
        `);

        // Tabla de pagos
        await client.query(`
            CREATE TABLE IF NOT EXISTS pagos (
                id SERIAL PRIMARY KEY,
                inscripcion_id INTEGER REFERENCES inscripciones(id),
                usuario_id INTEGER REFERENCES usuarios(id),
                monto DECIMAL(10,2) NOT NULL,
                metodo_pago VARCHAR(50),
                comprobante VARCHAR(255),
                notas TEXT,
                fecha_pago TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                registrado_por INTEGER REFERENCES usuarios(id)
            )
        `);

        // Tabla de gastos
        await client.query(`
            CREATE TABLE IF NOT EXISTS gastos (
                id SERIAL PRIMARY KEY,
                tipo VARCHAR(50) NOT NULL,
                descripcion TEXT,
                monto DECIMAL(10,2) NOT NULL,
                fecha DATE DEFAULT CURRENT_DATE,
                registrado_por INTEGER REFERENCES usuarios(id),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Tabla de contenido/lecciones
        await client.query(`
            CREATE TABLE IF NOT EXISTS lecciones (
                id SERIAL PRIMARY KEY,
                tipo_curso VARCHAR(50) NOT NULL,
                curso_nombre VARCHAR(100) NOT NULL,
                modulo VARCHAR(100),
                numero_leccion INTEGER,
                titulo VARCHAR(200) NOT NULL,
                descripcion TEXT,
                video_url VARCHAR(500),
                duracion_minutos INTEGER,
                orden INTEGER DEFAULT 0,
                activo BOOLEAN DEFAULT true
            )
        `);

        // Tabla de progreso del alumno
        await client.query(`
            CREATE TABLE IF NOT EXISTS progreso_alumno (
                id SERIAL PRIMARY KEY,
                usuario_id INTEGER REFERENCES usuarios(id),
                leccion_id INTEGER REFERENCES lecciones(id),
                completado BOOLEAN DEFAULT false,
                fecha_completado TIMESTAMP,
                notas TEXT,
                UNIQUE(usuario_id, leccion_id)
            )
        `);

        // Actualizar horarios
        await client.query("DELETE FROM horarios");
        await client.query(`
            INSERT INTO horarios (nombre, dias) VALUES 
            ('Lunes y Miércoles', 'Lunes y Miércoles'),
            ('Martes y Jueves', 'Martes y Jueves'),
            ('Sábados', 'Sábados'),
            ('Otro', 'Otro')
        `);

        // Actualizar cursos
        await client.query("DELETE FROM cursos");
        await client.query(`
            INSERT INTO cursos (nombre, descripcion, costo, duracion_semanas) VALUES 
            ('Inglés', 'Cursos de inglés con certificación Oxford y SELPIP', 1900, 4),
            ('Marketing', 'Cursos de marketing digital y redes sociales', 1900, 4)
        `);

        // Insertar lecciones de ejemplo si no existen
        const leccionesExist = await client.query('SELECT COUNT(*) FROM lecciones');
        if (parseInt(leccionesExist.rows[0].count) === 0) {
            // Lecciones de Inglés - Headway 1
            const headway1 = [
                'Hello everybody!', 'Meeting people', 'The world of work',
                'Take it easy!', 'Where do you live?', "Can you speak English?",
                'Then and now', 'A date to remember', 'Food you like!',
                'Bigger and better!', 'Looking good!', "Life's an adventure!",
                'How terrific!', 'Have you ever?'
            ];
            for (let i = 0; i < headway1.length; i++) {
                await client.query(`
                    INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, orden) 
                    VALUES ('Inglés', 'Headway 1', 'Libro 1', $1, $2, $1)
                `, [i + 1, headway1[i]]);
            }

            // Lecciones de Inglés - Headway 2
            const headway2 = [
                'Getting to know you', 'The way we live', "What happened next?",
                'The market place', "What do you want to do?", "Places and things",
                'Fame!', 'Do\'s and don\'ts', 'Going places', 'Things that changed the world',
                "What will you do?", "Dreams and reality", 'Making a living', 'Love you and leave you'
            ];
            for (let i = 0; i < headway2.length; i++) {
                await client.query(`
                    INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, orden) 
                    VALUES ('Inglés', 'Headway 2', 'Libro 2', $1, $2, $1)
                `, [i + 1, headway2[i]]);
            }

            // Curso 1: Facebook Ads + TikTok Ads
            const adsLecciones = [
                'Introducción a Facebook Ads', 'Configurar Business Manager', 'Píxel de Facebook',
                'Crear tu primera campaña', 'Audiencias y segmentación', 'Creativos que convierten',
                'Optimización de campañas', 'Retargeting avanzado', 'Introducción a TikTok Ads',
                'Configurar TikTok Business', 'Creativos para TikTok', 'Campañas que funcionan'
            ];
            for (let i = 0; i < adsLecciones.length; i++) {
                await client.query(`
                    INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, orden) 
                    VALUES ('Marketing', 'Facebook Ads + TikTok Ads', 'Publicidad Digital', $1, $2, $1)
                `, [i + 1, adsLecciones[i]]);
            }

            // Curso 2: Contenido (CapCut + Canva)
            const contenidoLecciones = [
                'Introducción a CapCut', 'Edición básica de video', 'Efectos y transiciones',
                'Textos y subtítulos', 'Audio y música', 'Exportar para redes',
                'Introducción a Canva', 'Diseño de posts', 'Stories que destacan',
                'Carruseles efectivos', 'Plantillas personalizadas', 'Branding en Canva'
            ];
            for (let i = 0; i < contenidoLecciones.length; i++) {
                await client.query(`
                    INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, orden) 
                    VALUES ('Marketing', 'Contenido con CapCut y Canva', 'Creación de Contenido', $1, $2, $1)
                `, [i + 1, contenidoLecciones[i]]);
            }

            // Curso 3: Sitios Web con IA y WordPress
            const webLecciones = [
                'Introducción a WordPress', 'Hosting y dominio', 'Instalar WordPress',
                'Elegir tema perfecto', 'Configuración inicial', 'Elementor básico',
                'Diseño con IA', 'Imágenes con IA', 'Textos con IA',
                'SEO básico', 'Velocidad y optimización', 'Publicar tu sitio'
            ];
            for (let i = 0; i < webLecciones.length; i++) {
                await client.query(`
                    INSERT INTO lecciones (tipo_curso, curso_nombre, modulo, numero_leccion, titulo, orden) 
                    VALUES ('Marketing', 'Sitios Web con IA y WordPress', 'Desarrollo Web', $1, $2, $1)
                `, [i + 1, webLecciones[i]]);
            }
        }

        // Insertar usuario admin por defecto si no existe
        const adminExist = await client.query("SELECT COUNT(*) FROM usuarios WHERE rol = 'admin'");
        if (parseInt(adminExist.rows[0].count) === 0) {
            const bcrypt = require('bcryptjs');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await client.query(`
                INSERT INTO usuarios (nombre, celular, email, password, rol) VALUES 
                ('Administrador', '5625813428', 'admin@cursosbrooklyn.com', $1, 'admin')
            `, [hashedPassword]);
        }

        console.log('✅ Base de datos inicializada correctamente');
    } catch (error) {
        console.error('❌ Error al inicializar la base de datos:', error);
        throw error;
    } finally {
        client.release();
    }
};

module.exports = { pool, initDatabase };
