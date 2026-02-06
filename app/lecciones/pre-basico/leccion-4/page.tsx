import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Leccion 4 Pre-basico',
  description: 'Video de la Leccion 4 Pre-basico de Cursos Brooklyn.',
}

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Pre-basico</span>
            <h1><span className="gradient-text">Leccion 4 Pre-basico</span></h1>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <Link href="/lecciones/pre-basico">Pre-basico</Link>
            <span>/</span>
            <span>Leccion 4 Pre-basico</span>
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/L_rzvbkwYFwh"
              title="Leccion 4 Pre-basico"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-info">
            <span className="lesson-info-tag">Pre-basico</span>
            <div className="lesson-nav">
              <Link href="/lecciones/pre-basico/leccion-3"><FontAwesomeIcon icon={faArrowLeft} /> Anterior</Link>
              <Link href="/lecciones/pre-basico/leccion-6">Siguiente <FontAwesomeIcon icon={faArrowRight} /></Link>
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
