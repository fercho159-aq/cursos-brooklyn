import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Unit 9 Elementary - Headway Elementary',
  description: 'Video de Unit 9 Elementary del curso Headway Elementary de Cursos Brooklyn.',
}

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Headway Elementary</span>
            <h1><span className="gradient-text">Unit 9 Elementary</span></h1>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <Link href="/lecciones/headway-elementary">Headway Elementary</Link>
            <span>/</span>
            <span>Unit 9 Elementary</span>
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/ukf1Cu8ZlBk"
              title="Unit 9 Elementary - Video 1"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/kZdmV1r15Ng"
              title="Unit 9 Elementary - Video 2"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-info">
            <span className="lesson-info-tag">Headway Elementary</span>
            <div className="lesson-nav">
              <Link href="/lecciones/headway-elementary/unit-8"><FontAwesomeIcon icon={faArrowLeft} /> Anterior</Link>
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
