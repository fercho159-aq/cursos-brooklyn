import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Headway Elementary - Lecciones en Video',
  description: 'Lecciones en video del curso Headway Elementary. Nivel elemental para desarrollar vocabulario y gramatica.',
}

const lecciones = [
  { numero: 1, slug: 'unit-1', titulo: 'Unit 1 Elementary', videos: 1 },
  { numero: 2, slug: 'unit-2', titulo: 'Unit 2 Elementary', videos: 1 },
  { numero: 3, slug: 'unit-3', titulo: 'Unit 3 Elementary', videos: 1 },
  { numero: 4, slug: 'unit-4', titulo: 'Unit 4 Elementary', videos: 1 },
  { numero: 5, slug: 'unit-5', titulo: 'Unit 5 Elementary', videos: 2 },
  { numero: 6, slug: 'unit-6', titulo: 'Unit 6 Elementary', videos: 3 },
  { numero: 7, slug: 'unit-7', titulo: 'Unit 7 Elementary', videos: 1 },
  { numero: 8, slug: 'unit-8', titulo: 'Unit 8 Elementary', videos: 3 },
  { numero: 9, slug: 'unit-9', titulo: 'Unit 9 Elementary', videos: 2 },
]

export default function HeadwayElementaryPage() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Headway Elementary</span>
            <h1>Headway <span className="gradient-text">Elementary</span></h1>
            <p>Nivel elemental para desarrollar vocabulario y gramatica</p>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <span>Headway Elementary</span>
          </div>

          <div className="lessons-list">
            {lecciones.map((leccion) => (
              <Link href={`/lecciones/headway-elementary/${leccion.slug}`} key={leccion.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className="lesson-card">
                  <div className="lesson-card-number">{leccion.numero}</div>
                  <h3>{leccion.titulo}</h3>
                  <div className="lesson-card-meta">
                    <FontAwesomeIcon icon={faPlayCircle} /> {leccion.videos} {leccion.videos > 1 ? 'videos' : 'video'}
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
