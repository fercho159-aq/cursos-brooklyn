import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Customer Stories - Testimonios',
  description: 'Video de Customer Stories de Cursos Brooklyn.',
}

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Testimonios</span>
            <h1><span className="gradient-text">Customer Stories</span></h1>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <span>Customer Stories</span>
          </div>

          <div className="lesson-video-wrapper">
            <iframe
              src="https://www.youtube-nocookie.com/embed/JLE228ZuGGA"
              title="Customer Stories"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <div className="lesson-info">
            <span className="lesson-info-tag">Testimonios</span>
            <div className="lesson-nav">
              <Link href="/lecciones"><FontAwesomeIcon icon={faArrowLeft} /> Volver a Lecciones</Link>
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
