import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Pre-basico - Lecciones en Video',
  description: 'Lecciones en video del curso Pre-basico de ingles. Comienza desde cero con nuestras clases grabadas.',
}

const lecciones = [
  { numero: 1, slug: 'leccion-1', titulo: 'Leccion 1 Pre-basico' },
  { numero: 3, slug: 'leccion-3', titulo: 'Leccion 3 Pre-basico' },
  { numero: 4, slug: 'leccion-4', titulo: 'Leccion 4 Pre-basico' },
  { numero: 6, slug: 'leccion-6', titulo: 'Leccion 6 Pre-basico' },
  { numero: 10, slug: 'leccion-10', titulo: 'Leccion 10 Pre-basico' },
]

export default function PreBasicoPage() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Pre-basico</span>
            <h1>Curso <span className="gradient-text">Pre-basico</span></h1>
            <p>Lecciones en video para comenzar desde cero</p>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <span>Pre-basico</span>
          </div>

          <div className="lessons-list">
            {lecciones.map((leccion) => (
              <Link href={`/lecciones/pre-basico/${leccion.slug}`} key={leccion.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="lesson-card">
                  <div className="lesson-card-number">{leccion.numero}</div>
                  <h3>{leccion.titulo}</h3>
                  <div className="lesson-card-meta">
                    <FontAwesomeIcon icon={faPlayCircle} /> 1 video
                  </div>
                  <span className="btn btn-primary">
                    Ver Leccion <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div style={{ marginTop: '40px', textAlign: 'center' }}>
            <Link href="/lecciones" className="btn btn-outline">
              <FontAwesomeIcon icon={faArrowLeft} /> Volver a Cursos
            </Link>
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
