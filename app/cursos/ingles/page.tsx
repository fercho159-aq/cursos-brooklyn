import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faCertificate, faGlobe, faUserGraduate, faClock, faUsers,
  faBook, faCalendarAlt, faCheckCircle, faArrowRight, faGift
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Curso de Ingles con Certificacion Oxford',
  description: 'Aprende ingles con certificacion Oxford y SELPIP en Cursos Brooklyn. Todos los niveles disponibles.',
}

export default function CursoInglesPage() {
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Programa de Ingles</span>
            <h1>Domina el <span className="gradient-text">Ingles</span></h1>
            <p>Certificaciones internacionales Oxford y preparacion SELPIP</p>
          </div>
        </div>
      </section>

      {/* Course Detail */}
      <section className="course-detail">
        <div className="container">
          <div className="course-detail-grid">
            <div className="course-detail-content">
              <span className="course-tag">Mas Popular</span>
              <h2>Programa Completo de <span className="gradient-text">Ingles</span></h2>
              <p className="course-intro">
                Nuestro programa de ingles esta diseñado para llevarte desde nivel basico hasta avanzado,
                con certificaciones reconocidas internacionalmente. Aprende con metodologia practica y
                profesores certificados que te guiaran en cada paso de tu aprendizaje.
              </p>

              <div className="course-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faCertificate} />
                  </div>
                  <div>
                    <h4>Certificacion Oxford</h4>
                    <p>Obten tu certificacion respaldada por la Universidad de Oxford, reconocida mundialmente.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                  <div>
                    <h4>Preparacion SELPIP</h4>
                    <p>Te preparamos para el examen SELPIP, ideal para tramites migratorios a Canada.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faUserGraduate} />
                  </div>
                  <div>
                    <h4>Profesores Certificados</h4>
                    <p>Todos nuestros profesores cuentan con certificaciones internacionales en enseñanza del ingles.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-detail-sidebar">
              <div className="course-info-card">
                <div className="course-emoji">🇬🇧</div>
                <h3>Curso de Ingles</h3>
                <div className="course-price">
                  <span className="price-from">Desde</span>
                  <span className="price-value">$1,500<small>/mes</small></span>
                </div>
                <ul className="course-specs">
                  <li><FontAwesomeIcon icon={faClock} /> Duracion: 2 años completos</li>
                  <li><FontAwesomeIcon icon={faUsers} /> Grupos de max. 15 alumnos</li>
                  <li><FontAwesomeIcon icon={faBook} /> Material incluido</li>
                  <li><FontAwesomeIcon icon={faCalendarAlt} /> 3 clases por semana</li>
                </ul>
                <div className="course-schedules">
                  <h4><FontAwesomeIcon icon={faCalendarAlt} /> Horarios Disponibles</h4>
                  <div className="schedule-options">
                    <div className="schedule-item">
                      <span className="schedule-time">Matutino</span>
                      <span className="schedule-hours">9:00 - 11:00 AM</span>
                    </div>
                    <div className="schedule-item">
                      <span className="schedule-time">Vespertino</span>
                      <span className="schedule-hours">4:00 - 6:00 PM</span>
                    </div>
                    <div className="schedule-item">
                      <span className="schedule-time">Sabatino</span>
                      <span className="schedule-hours">9:00 AM - 1:00 PM</span>
                    </div>
                  </div>
                </div>
                <a
                  href="https://wa.me/5215625813428?text=Hola,%20me%20interesa%20el%20curso%20de%20Ingl%C3%A9s"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg btn-block"
                >
                  <FontAwesomeIcon icon={faWhatsapp} /> Inscribirme Ahora
                </a>
                <p className="promo-note">
                  <FontAwesomeIcon icon={faGift} /> ¡Inscripcion GRATIS en enero!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Levels */}
      <section className="course-levels">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Niveles del Programa</span>
            <h2 className="section-title">Tu camino al <span className="gradient-text">dominio del ingles</span></h2>
          </div>
          <div className="levels-timeline">
            <div className="level-item">
              <div className="level-number">1</div>
              <div className="level-content">
                <h3>Nivel Basico</h3>
                <p>Aprende las bases del idioma: vocabulario esencial, gramatica fundamental y pronunciacion correcta.</p>
                <span className="level-duration"><FontAwesomeIcon icon={faClock} /> 8 meses</span>
              </div>
            </div>
            <div className="level-item">
              <div className="level-number">2</div>
              <div className="level-content">
                <h3>Nivel Intermedio</h3>
                <p>Desarrolla fluidez en conversaciones, comprension de textos complejos y escritura formal.</p>
                <span className="level-duration"><FontAwesomeIcon icon={faClock} /> 8 meses</span>
              </div>
            </div>
            <div className="level-item">
              <div className="level-number">3</div>
              <div className="level-content">
                <h3>Nivel Avanzado</h3>
                <p>Perfecciona tu ingles con enfasis en certificaciones Oxford y preparacion SELPIP.</p>
                <span className="level-duration"><FontAwesomeIcon icon={faClock} /> 8 meses</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para dominar el <span className="gradient-text">ingles</span>?</h2>
            <p>Inscribete hoy y comienza tu transformacion con certificacion internacional.</p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/5215625813428?text=Hola,%20quiero%20inscribirme%20al%20curso%20de%20Ingl%C3%A9s"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-lg"
              >
                <FontAwesomeIcon icon={faWhatsapp} /> Inscribirme Ahora
              </a>
              <Link href="/cursos" className="btn btn-outline btn-lg">
                Ver otros cursos
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
