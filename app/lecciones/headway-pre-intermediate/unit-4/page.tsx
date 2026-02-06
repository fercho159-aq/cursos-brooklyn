import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Unit 4 Pre Intermediate - Headway Pre-Intermediate',
  description: 'Video de Unit 4 Pre Intermediate del curso Headway Pre-Intermediate de Cursos Brooklyn.',
}

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Headway Pre-Intermediate</span>
            <h1><span className="gradient-text">Unit 4 Pre Intermediate</span></h1>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <Link href="/lecciones/headway-pre-intermediate">Headway Pre-Intermediate</Link>
            <span>/</span>
            <span>Unit 4 Pre Intermediate</span>
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/1FeSPlUmRWU"
              title="Unit 4 Pre Intermediate"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-info">
            <span className="lesson-info-tag">Headway Pre-Intermediate</span>
            <div className="lesson-nav">
              <Link href="/lecciones/headway-pre-intermediate/unit-3"><FontAwesomeIcon icon={faArrowLeft} /> Anterior</Link>
              <Link href="/lecciones/headway-pre-intermediate/unit-5">Siguiente <FontAwesomeIcon icon={faArrowRight} /></Link>
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
