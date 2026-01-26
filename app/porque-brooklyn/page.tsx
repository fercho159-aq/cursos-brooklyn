import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHeart, faGraduationCap, faHandshake, faCertificate,
  faCheckCircle, faCalendarAlt, faUsers, faSun, faMoon,
  faCalendarWeek, faUser, faStar, faArrowRight, faBook,
  faWifi, faParking, faCoffee, faCheck, faTimes, faQuestion
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: '¿Por que Brooklyn?',
  description: 'Descubre por que Cursos Brooklyn es la mejor opcion para tu educacion. Certificaciones internacionales, horarios flexibles y mas.',
}

export default function PorqueBrooklynPage() {
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Conocenos</span>
            <h1>¿Por que elegir <span className="gradient-text">Brooklyn</span>?</h1>
            <p>Descubre lo que nos hace diferentes y por que somos tu mejor opcion</p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="our-story">
        <div className="container">
          <div className="story-grid">
            <div className="story-content">
              <span className="section-badge">Nuestra Historia</span>
              <h2>Transformando <span className="gradient-text">vidas</span> a traves de la educacion</h2>
              <p>
                Cursos Brooklyn nacio con una mision clara: hacer la educacion de calidad accesible para todos.
                Desde nuestros inicios, nos hemos comprometido a ofrecer programas educativos que realmente
                transformen la vida de nuestros estudiantes.
              </p>
              <p>
                Creemos que aprender un nuevo idioma o habilidades digitales no deberia ser un lujo,
                sino una oportunidad al alcance de todos. Por eso combinamos calidad educativa con
                precios accesibles y horarios flexibles.
              </p>
              <div className="story-values">
                <div className="value-item">
                  <FontAwesomeIcon icon={faHeart} /> Compromiso
                </div>
                <div className="value-item">
                  <FontAwesomeIcon icon={faGraduationCap} /> Excelencia
                </div>
                <div className="value-item">
                  <FontAwesomeIcon icon={faHandshake} /> Accesibilidad
                </div>
              </div>
            </div>
            <div className="story-visual">
              <div className="visual-card">
                <span className="stat-big">500+</span>
                <span className="stat-text">Estudiantes</span>
              </div>
              <div className="visual-card secondary">
                <span className="stat-big">95%</span>
                <span className="stat-text">Satisfaccion</span>
              </div>
              <div className="visual-card accent">
                <span className="stat-big">2</span>
                <span className="stat-text">Sedes en CDMX y Edo. Mex.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Benefits */}
      <section className="main-benefits">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Nuestras Fortalezas</span>
            <h2 className="section-title">Lo que nos <span className="gradient-text">distingue</span></h2>
          </div>

          <div className="benefits-showcase">
            <div className="benefit-large">
              <div className="benefit-large-icon">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <div className="benefit-large-content">
                <h3>Certificaciones Internacionales</h3>
                <p>
                  Somos centro autorizado para certificaciones Oxford y preparacion SELPIP.
                  Nuestros certificados son reconocidos mundialmente y te abren puertas en el ambito laboral y academico.
                </p>
                <ul className="benefit-list">
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Certificacion Oxford</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Preparacion SELPIP</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Validez internacional</li>
                  <li><FontAwesomeIcon icon={faCheckCircle} /> Reconocido por empresas</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="benefits-grid-alt">
            <div className="benefit-card-alt">
              <div className="benefit-icon-alt">
                <FontAwesomeIcon icon={faCalendarAlt} />
              </div>
              <h3>Horarios Flexibles</h3>
              <p>Adaptamos nuestros horarios a tu vida. Elige entre clases matutinas, vespertinas o sabatinas.</p>
              <div className="schedule-visual">
                <div className="schedule-option">
                  <FontAwesomeIcon icon={faSun} />
                  <span>Mañana</span>
                </div>
                <div className="schedule-option">
                  <FontAwesomeIcon icon={faMoon} />
                  <span>Tarde</span>
                </div>
                <div className="schedule-option">
                  <FontAwesomeIcon icon={faCalendarWeek} />
                  <span>Sabado</span>
                </div>
              </div>
            </div>

            <div className="benefit-card-alt">
              <div className="benefit-icon-alt">
                <FontAwesomeIcon icon={faUsers} />
              </div>
              <h3>Grupos Reducidos</h3>
              <p>Maximo 15 alumnos por grupo para garantizar atencion personalizada y mejor aprendizaje.</p>
              <div className="group-visual">
                <div className="student-icons">
                  {[...Array(5)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faUser} />
                  ))}
                </div>
                <span>Max. 15 estudiantes por grupo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Extra Benefits */}
      <section className="extra-benefits">
        <div className="container">
          <div className="section-header light">
            <span className="section-badge">Beneficios Adicionales</span>
            <h2 className="section-title">Todo lo que <span className="gradient-text">incluimos</span></h2>
          </div>
          <div className="extras-grid">
            <div className="extra-item">
              <div className="extra-icon"><FontAwesomeIcon icon={faBook} /></div>
              <h4>Material Incluido</h4>
              <p>Libros, cuadernos de trabajo y recursos digitales sin costo adicional.</p>
            </div>
            <div className="extra-item">
              <div className="extra-icon"><FontAwesomeIcon icon={faWifi} /></div>
              <h4>Plataforma Online</h4>
              <p>Acceso a nuestra plataforma digital para practicar desde casa.</p>
            </div>
            <div className="extra-item">
              <div className="extra-icon"><FontAwesomeIcon icon={faGraduationCap} /></div>
              <h4>Profesores Certificados</h4>
              <p>Docentes con certificaciones internacionales y experiencia comprobada.</p>
            </div>
            <div className="extra-item">
              <div className="extra-icon"><FontAwesomeIcon icon={faParking} /></div>
              <h4>Estacionamiento</h4>
              <p>Estacionamiento gratuito disponible en nuestras instalaciones.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Large */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Testimonios</span>
            <h2 className="section-title">Historias de <span className="gradient-text">exito</span></h2>
          </div>
          <div className="testimonials-grid-large">
            <div className="testimonial-large">
              <div className="testimonial-quote">&ldquo;</div>
              <p className="testimonial-text">
                Gracias a Brooklyn logre mi certificacion Oxford en solo un año. Los profesores son
                excelentes y el ambiente de estudio es muy agradable. ¡100% recomendado!
              </p>
              <div className="testimonial-author-large">
                <div className="author-avatar-large">MG</div>
                <div className="author-details">
                  <h4>Maria Garcia</h4>
                  <span>Estudiante de Ingles - 2024</span>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="testimonial-large">
              <div className="testimonial-quote">&ldquo;</div>
              <p className="testimonial-text">
                El curso de Marketing Digital me abrio las puertas a mi primer trabajo en el area.
                Los conocimientos que adquiri son muy practicos y actualizados.
              </p>
              <div className="testimonial-author-large">
                <div className="author-avatar-large">CR</div>
                <div className="author-details">
                  <h4>Carlos Rodriguez</h4>
                  <span>Egresado Marketing - 2024</span>
                  <div className="testimonial-stars">
                    {[...Array(5)].map((_, i) => (
                      <FontAwesomeIcon key={i} icon={faStar} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="comparison-section">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Comparativa</span>
            <h2 className="section-title">Brooklyn vs <span className="gradient-text">Otros</span></h2>
          </div>
          <div className="comparison-table">
            <div className="comparison-header">
              <div className="comparison-feature">Caracteristica</div>
              <div className="comparison-brooklyn"><span>Brooklyn</span></div>
              <div className="comparison-others">Otros</div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Certificacion Oxford</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="maybe"><FontAwesomeIcon icon={faQuestion} /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Preparacion SELPIP</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="no"><FontAwesomeIcon icon={faTimes} /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Material incluido</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="no"><FontAwesomeIcon icon={faTimes} /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Horarios flexibles</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="maybe"><FontAwesomeIcon icon={faQuestion} /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Grupos reducidos</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="no"><FontAwesomeIcon icon={faTimes} /></div>
            </div>
            <div className="comparison-row">
              <div className="comparison-feature">Precios accesibles</div>
              <div className="yes"><FontAwesomeIcon icon={faCheck} /></div>
              <div className="maybe"><FontAwesomeIcon icon={faQuestion} /></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para <span className="gradient-text">transformar</span> tu futuro?</h2>
            <p>Unete a la familia Brooklyn y comienza tu camino hacia el exito.</p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/5215625813428?text=Hola,%20me%20interesa%20inscribirme%20en%20Cursos%20Brooklyn"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-lg"
              >
                <FontAwesomeIcon icon={faWhatsapp} /> Inscribirme Ahora
              </a>
              <Link href="/cursos" className="btn btn-outline btn-lg">
                Ver cursos disponibles
              </Link>
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
