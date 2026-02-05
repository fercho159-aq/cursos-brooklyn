import Image from 'next/image'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faStar, faArrowRight, faPlayCircle, faLanguage, faBullhorn,
  faCheckCircle, faClock, faUsers, faLaptopHouse, faCertificate,
  faCalendarAlt, faChalkboardTeacher, faLaptopCode, faGift,
  faBullseye, faPercent, faMapMarkerAlt, faLocationDot
} from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faTiktok, faWhatsapp, faGoogle } from '@fortawesome/free-brands-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export default function HomePage() {
  return (
    <>
      <Navbar />

      {/* Promo Banner */}
      <div className="promo-banner">
        <span><FontAwesomeIcon icon={faGift} /> <strong>¡Inscripcion GRATIS</strong> todo enero 2025!</span>
        <Link href="#contacto" className="promo-cta">Aprovecha ahora →</Link>
      </div>

      {/* Hero Section */}
      <section className="hero" id="inicio">
        <div className="hero-bg"></div>
        <div className="hero-container">
          <div className="hero-content">
            <div className="hero-badge">
              <FontAwesomeIcon icon={faStar} style={{ color: '#FBBF24' }} /> +500 estudiantes confian en nosotros
            </div>
            <h1 className="hero-title">
              Transforma tu <span className="gradient-text">futuro</span> con educacion de calidad
            </h1>
            <p className="hero-subtitle">
              Domina el ingles con <strong>certificaciones Oxford y SELPIP</strong>, o
              conviertete en experto en <strong>Marketing Digital</strong>.
            </p>
            <div className="hero-cta">
              <Link href="/inscripcion" className="btn btn-primary btn-lg">
                Inscribete con descuento <FontAwesomeIcon icon={faArrowRight} />
              </Link>
              <Link href="#cursos" className="btn btn-outline btn-lg">
                <FontAwesomeIcon icon={faPlayCircle} /> Ver cursos
              </Link>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Estudiantes</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">95%</span>
                <span className="stat-label">Satisfaccion</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">2</span>
                <span className="stat-label">Sedes</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <Image
              src="/hero-student.png"
              alt="Estudiante feliz aprendiendo en Cursos Brooklyn"
              width={550}
              height={600}
              priority
              className="hero-image"
            />
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="courses" id="cursos">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Nuestros Programas</span>
            <h2 className="section-title">Cursos diseñados para tu <span className="gradient-text">exito</span></h2>
          </div>
          <div className="courses-grid">
            <div className="course-card featured">
              <div className="course-badge">Mas Popular</div>
              <div className="course-icon"><FontAwesomeIcon icon={faLanguage} /></div>
              <h3>Curso de Ingles</h3>
              <p>Domina el idioma mas importante del mundo con nuestra metodologia probada.</p>
              <div className="course-features">
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Certificacion Oxford</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Preparacion SELPIP</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Todos los niveles</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Material incluido</div>
              </div>
              <div className="course-meta">
                <span><FontAwesomeIcon icon={faClock} /> 2 años</span>
                <span><FontAwesomeIcon icon={faUsers} /> Grupos reducidos</span>
              </div>
              <div className="course-pricing">
                <span className="price-label">Desde</span>
                <span className="price-amount">$1,500<small>/mes</small></span>
              </div>
              <Link href="#contacto" className="btn btn-primary btn-block">
                Mas informacion <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            <div className="course-card">
              <div className="course-badge new">Nuevo</div>
              <div className="course-icon"><FontAwesomeIcon icon={faBullhorn} /></div>
              <h3>Marketing Digital</h3>
              <p>Aprende las estrategias mas efectivas del marketing digital.</p>
              <div className="course-features">
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Redes Sociales</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Publicidad Digital</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> SEO & SEM</div>
                <div className="feature"><FontAwesomeIcon icon={faCheckCircle} /> Proyectos reales</div>
              </div>
              <div className="course-meta">
                <span><FontAwesomeIcon icon={faClock} /> Modulos de 2 meses</span>
                <span><FontAwesomeIcon icon={faLaptopHouse} /> Presencial u Online</span>
              </div>
              <div className="course-pricing">
                <span className="price-label">Planes</span>
                <span className="price-amount flexible">Flexibles</span>
              </div>
              <Link href="#contacto" className="btn btn-secondary btn-block">
                Mas informacion <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits" id="beneficios">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Nuestras Ventajas</span>
            <h2 className="section-title">¿Por que elegir <span className="gradient-text">Brooklyn</span>?</h2>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon"><FontAwesomeIcon icon={faCertificate} /></div>
              <h3>Certificaciones Internacionales</h3>
              <p>Obten certificaciones Oxford y SELPIP reconocidas mundialmente.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FontAwesomeIcon icon={faCalendarAlt} /></div>
              <h3>Horarios Flexibles</h3>
              <p>Clases matutinas, vespertinas y sabatinas disponibles.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FontAwesomeIcon icon={faChalkboardTeacher} /></div>
              <h3>Profesores Certificados</h3>
              <p>Equipo docente con certificaciones internacionales.</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon"><FontAwesomeIcon icon={faLaptopCode} /></div>
              <h3>Metodologia Practica</h3>
              <p>Aprende haciendo con practica real y efectiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Promotions Section */}
      <section className="promotions" id="promociones">
        <div className="container">
          <div className="section-header light">
            <span className="section-badge">Ofertas Especiales</span>
            <h2 className="section-title">Promociones <span className="gradient-text">Exclusivas</span></h2>
          </div>
          <div className="promos-grid">
            <div className="promo-card main-promo">
              <div className="promo-ribbon">¡HOT!</div>
              <div className="promo-icon"><FontAwesomeIcon icon={faGift} /></div>
              <h3>Inscripcion GRATIS</h3>
              <p className="promo-period">Todo enero 2025</p>
              <p>¡No pagues inscripcion! Inicia tu camino hacia el exito sin costo.</p>
              <div className="promo-value">
                <span className="original">$500</span>
                <span className="current">$0</span>
              </div>
              <Link href="#contacto" className="btn btn-light btn-block">
                ¡Lo quiero! <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
            <div className="promo-card">
              <div className="promo-ribbon">50% OFF</div>
              <div className="promo-icon"><FontAwesomeIcon icon={faBullseye} /></div>
              <h3>Segundo a Mitad de Precio</h3>
              <p className="promo-period">Promocion permanente</p>
              <p>Inscribe a un familiar o amigo y el segundo paga solo la mitad.</p>
              <div className="promo-benefit">
                <FontAwesomeIcon icon={faPercent} /> 50% de descuento en segunda inscripcion
              </div>
              <Link href="#contacto" className="btn btn-primary btn-block">
                Aprovechar oferta <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonios</span>
            <h2 className="section-title">Lo que dicen nuestros <span className="gradient-text">estudiantes</span></h2>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <p>&ldquo;Gracias a Brooklyn logre mi certificacion Oxford. ¡100% recomendado!&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">MG</div>
                <div>
                  <h4>Maria Garcia</h4>
                  <span>Estudiante de Ingles</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <p>&ldquo;El curso de Marketing Digital me abrio las puertas a mi primer trabajo.&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">CR</div>
                <div>
                  <h4>Carlos Rodriguez</h4>
                  <span>Egresado Marketing</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-stars">
                {[...Array(5)].map((_, i) => (
                  <FontAwesomeIcon key={i} icon={faStar} />
                ))}
              </div>
              <p>&ldquo;Los horarios flexibles me permitieron estudiar mientras trabajaba.&rdquo;</p>
              <div className="testimonial-author">
                <div className="author-avatar">AL</div>
                <div>
                  <h4>Ana Lopez</h4>
                  <span>Estudiante de Ingles</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="locations" id="sedes">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Encuentranos</span>
            <h2 className="section-title">Nuestras <span className="gradient-text">Sedes</span></h2>
          </div>
          <div className="locations-grid">
            <div className="location-card">
              <div className="location-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
              <h3>Sede Chimalhuacan</h3>
              <p><FontAwesomeIcon icon={faLocationDot} /> Av Patos Manzana 019 Lote 70, San Pablo, 56364 Chimalhuacan, Mex.</p>
              <p><FontAwesomeIcon icon={faClock} /> Lun - Sab: 9:00 AM - 8:00 PM</p>
              <div className="map-container">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3762.6809767472732!2d-98.9488782!3d19.426185299999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1e328445acaef%3A0xda605a5c250e97df!2sCursos%20Brooklyn!5e0!3m2!1ses!2smx!4v1769184749635!5m2!1ses!2smx"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <a
                href="https://share.google/qmY8IFP0B3EIlB0Ns"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-block"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <FontAwesomeIcon icon={faGoogle} /> Dejar una recomendacion
              </a>
            </div>
            <div className="location-card">
              <div className="location-icon"><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
              <h3>Sede Ciudad de Mexico</h3>
              <p><FontAwesomeIcon icon={faLocationDot} /> Av. Popocatepetl 415, Sta Cruz Atoyac, Benito Juarez, 03310 CDMX</p>
              <p><FontAwesomeIcon icon={faClock} /> Lun - Sab: 9:00 AM - 8:00 PM</p>
              <div className="map-container">
                <iframe
                  src="https://maps.google.com/maps?q=Av.+Popocatépetl+415,+Sta+Cruz+Atoyac,+Benito+Juárez,+03310+Ciudad+de+México,+CDMX&z=15&output=embed"
                  allowFullScreen
                ></iframe>
              </div>
              <a
                href="https://maps.app.goo.gl/6GuuK8ULLNijYZqW6"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline btn-block"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}
              >
                <FontAwesomeIcon icon={faGoogle} /> Dejar una recomendacion
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Social Media */}
      <section className="social-section">
        <div className="container">
          <h2>Siguenos en <span className="gradient-text">Redes Sociales</span></h2>
          <p>Tips, promociones y contenido exclusivo</p>
          <div className="social-links">
            <a href="https://www.instagram.com/cursosbrooklynchimalhuacan" target="_blank" rel="noopener noreferrer" className="social-btn instagram">
              <FontAwesomeIcon icon={faInstagram} /> Instagram
            </a>
            <a href="https://www.facebook.com/share/1ErZWi2BwZ/" target="_blank" rel="noopener noreferrer" className="social-btn facebook">
              <FontAwesomeIcon icon={faFacebookF} /> Facebook
            </a>
            <a href="https://www.tiktok.com/@cursosbrooklynchimal" target="_blank" rel="noopener noreferrer" className="social-btn tiktok">
              <FontAwesomeIcon icon={faTiktok} /> TikTok
            </a>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="contact" id="contacto">
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <span className="section-badge">Contactanos</span>
              <h2>¿Listo para <span className="gradient-text">transformar</span> tu futuro?</h2>
              <p>Envianos un mensaje y te asesoraremos personalmente.</p>
              <div className="contact-benefits">
                <div><FontAwesomeIcon icon={faCheckCircle} /> Asesoria sin compromiso</div>
                <div><FontAwesomeIcon icon={faCheckCircle} /> Respuesta en 24 horas</div>
                <div><FontAwesomeIcon icon={faCheckCircle} /> Clase de prueba gratuita</div>
              </div>
            </div>
            <div className="contact-action" style={{ textAlign: 'center', width: '100%' }}>
              <a
                href="https://wa.me/5215625813428?text=Hola,%20quisiera%20m%C3%A1s%20informaci%C3%B3n%20sobre%20los%20cursos"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary btn-lg"
                style={{ fontSize: '1.5rem', padding: '20px 40px', boxShadow: '0 10px 30px rgba(37, 211, 102, 0.4)' }}
              >
                <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: '2rem' }} /> Enviar WhatsApp
              </a>
              <p style={{ marginTop: '15px', fontSize: '0.9rem', opacity: 0.8 }}>Respuesta inmediata</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
