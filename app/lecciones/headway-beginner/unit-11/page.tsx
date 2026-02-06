import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Unit 11 Beginner - Headway Beginner',
  description: 'Video de Unit 11 Beginner del curso Headway Beginner de Cursos Brooklyn.',
}

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Headway Beginner</span>
            <h1><span className="gradient-text">Unit 11 Beginner</span></h1>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <Link href="/lecciones/headway-beginner">Headway Beginner</Link>
            <span>/</span>
            <span>Unit 11 Beginner</span>
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/5oT430NEXFo"
              title="Unit 11 Beginner"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-info">
            <span className="lesson-info-tag">Headway Beginner</span>
            <div className="lesson-nav">
              <Link href="/lecciones/headway-beginner/unit-10"><FontAwesomeIcon icon={faArrowLeft} /> Anterior</Link>
              <Link href="/lecciones/headway-beginner/unit-12">Siguiente <FontAwesomeIcon icon={faArrowRight} /></Link>
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
