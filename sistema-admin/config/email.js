const nodemailer = require('nodemailer');
require('dotenv').config();

// Configurar transporter de email
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Función para enviar email de bienvenida
const enviarEmailBienvenida = async (alumno, inscripcion, curso, horario) => {
    const fechaInicio = new Date(inscripcion.fecha_inicio).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const fechaFin = new Date(inscripcion.fecha_fin).toLocaleDateString('es-MX', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #f5f5f5; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #fff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.1); }
            .header { background: linear-gradient(135deg, #431407 0%, #7c2d12 50%, #9b3411 100%); color: white; padding: 40px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; }
            .header p { margin: 10px 0 0; opacity: 0.9; }
            .content { padding: 40px; }
            .welcome { font-size: 24px; color: #431407; margin-bottom: 20px; }
            .info-box { background: linear-gradient(135deg, #fff7ed, #ffedd5); border-left: 4px solid #fa7315; padding: 20px; border-radius: 10px; margin: 20px 0; }
            .info-row { display: flex; margin: 10px 0; }
            .info-label { font-weight: bold; color: #7c2d12; min-width: 120px; }
            .info-value { color: #431407; }
            .cta { text-align: center; margin: 30px 0; }
            .cta a { display: inline-block; background: linear-gradient(135deg, #fa7315, #c3410b); color: white; padding: 15px 40px; border-radius: 30px; text-decoration: none; font-weight: bold; }
            .footer { background: #f8f8f8; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .social { margin: 15px 0; }
            .social a { margin: 0 10px; color: #fa7315; text-decoration: none; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎓 ¡Bienvenido a Cursos Brooklyn!</h1>
                <p>Tu camino hacia el éxito comienza aquí</p>
            </div>
            <div class="content">
                <p class="welcome">¡Hola, ${alumno.nombre}! 👋</p>
                <p>Nos emociona mucho tenerte con nosotros. Tu inscripción ha sido registrada exitosamente. Aquí están los detalles de tu curso:</p>
                
                <div class="info-box">
                    <div class="info-row">
                        <span class="info-label">📚 Curso:</span>
                        <span class="info-value">${curso.nombre}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">🗓️ Horario:</span>
                        <span class="info-value">${horario.nombre}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">📅 Inicio:</span>
                        <span class="info-value">${fechaInicio}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">🏁 Fin:</span>
                        <span class="info-value">${fechaFin}</span>
                    </div>
                    <div class="info-row">
                        <span class="info-label">💰 Inversión:</span>
                        <span class="info-value">$${inscripcion.costo_total} MXN</span>
                    </div>
                </div>

                <p>Recuerda que puedes consultar tu historial de pagos y estado de tu curso en cualquier momento desde nuestro portal de alumnos.</p>

                <div class="cta">
                    <a href="https://wa.me/5215625813428">📲 Contáctanos por WhatsApp</a>
                </div>
            </div>
            <div class="footer">
                <div class="social">
                    <a href="https://www.instagram.com/cursosbrooklynchimalhuacan">Instagram</a>
                    <a href="https://www.facebook.com/share/1ErZWi2BwZ/">Facebook</a>
                    <a href="https://www.tiktok.com/@cursosbrooklynchimal">TikTok</a>
                </div>
                <p>© 2025 Cursos Brooklyn. Transformando vidas a través de la educación.</p>
                <p>Av Patos Manzana 019 Lote 70, San Pablo, Chimalhuacán</p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        // Solo enviar si hay configuración de email
        if (process.env.EMAIL_USER && process.env.EMAIL_PASS && alumno.email) {
            await transporter.sendMail({
                from: process.env.EMAIL_FROM || '"Cursos Brooklyn" <noreply@cursosbrooklyn.com>',
                to: alumno.email,
                subject: '🎓 ¡Bienvenido a Cursos Brooklyn! - Confirmación de Inscripción',
                html: htmlContent
            });
            console.log(`✅ Email de bienvenida enviado a ${alumno.email}`);
            return true;
        } else {
            console.log('⚠️ Email no configurado o alumno sin email');
            return false;
        }
    } catch (error) {
        console.error('❌ Error al enviar email:', error);
        return false;
    }
};

module.exports = { enviarEmailBienvenida };
