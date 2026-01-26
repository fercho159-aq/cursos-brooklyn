import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLanguage, faBullhorn, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Nuestros Cursos',
  description: 'Explora nuestros cursos de Ingles y Marketing Digital en Cursos Brooklyn. Elige tu camino al exito.',
}

export default function CursosPage() {
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Nuestra Oferta Educativa</span>
            <h1>Elige tu camino al <span className="gradient-text">Exito</span></h1>
            <p>Selecciona el programa que transformara tu futuro profesional</p>
          </div>
        </div>
      </section>

      {/* Courses Selection */}
      <section className="courses-selection" style={{ padding: '100px 0' }}>
        <div className="container">
          <div className="courses-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', maxWidth: '900px', margin: '0 auto', gap: '40px' }}>

            {/* English Card */}
            <div className="course-card featured" style={{ textAlign: 'center', padding: '50px 30px' }}>
              <div className="course-icon" style={{ fontSize: '4rem', marginBottom: '30px' }}>
                <FontAwesomeIcon icon={faLanguage} />
              </div>
              <h2>Ingles</h2>
              <p style={{ marginBottom: '30px' }}>Certificaciones Oxford y preparacion SELPIP. Domina el idioma universal.</p>
              <Link href="/cursos/ingles" className="btn btn-primary btn-lg btn-block">
                Ver Programa de Ingles <FontAwesomeIcon icon={faArrowRight} />
              </Link>
            </div>

            {/* Marketing Card */}
            <div className="course-card featured" style={{ textAlign: 'center', padding: '50px 30px' }}>
              <div className="course-badge new">Nuevo</div>
              <div className="course-icon" style={{ fontSize: '4rem', marginBottom: '30px' }}>
                <FontAwesomeIcon icon={faBullhorn} />
              </div>
              <h2>Marketing Digital</h2>
              <p style={{ marginBottom: '30px' }}>Domina redes sociales, creacion de contenido y publicidad digital.</p>
              <Link href="/cursos/marketing" className="btn btn-primary btn-lg btn-block">
                Ver Programa de Marketing <FontAwesomeIcon icon={faArrowRight} />
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
