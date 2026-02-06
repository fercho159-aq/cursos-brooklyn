import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowRight, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Headway Beginner - Lecciones en Video',
  description: 'Lecciones en video del curso Headway Beginner. Nivel principiante con el metodo Oxford Headway.',
}

const lecciones = [
  { numero: 1, slug: 'unit-1', titulo: 'Unit 1 Beginner', videos: 1 },
  { numero: 2, slug: 'unit-2', titulo: 'Unit 2 Beginner', videos: 1 },
  { numero: 3, slug: 'unit-3', titulo: 'Unit 3 Beginner', videos: 1 },
  { numero: 4, slug: 'unit-4', titulo: 'Unit 4 Beginner', videos: 1 },
  { numero: 6, slug: 'unit-6', titulo: 'Unit 6 Beginner', videos: 1 },
  { numero: 7, slug: 'unit-7', titulo: 'Unit 7 Beginner', videos: 1 },
  { numero: 8, slug: 'unit-8', titulo: 'Unit 8 Beginner', videos: 1 },
  { numero: 9, slug: 'unit-9', titulo: 'Unit 9 Beginner', videos: 1 },
  { numero: 10, slug: 'unit-10', titulo: 'Unit 10 Beginner', videos: 3 },
  { numero: 11, slug: 'unit-11', titulo: 'Unit 11 Beginner', videos: 1 },
  { numero: 12, slug: 'unit-12', titulo: 'Unit 12 Beginner', videos: 1 },
  { numero: 13, slug: 'unit-13', titulo: 'Unit 13 Beginner', videos: 1 },
  { numero: 14, slug: 'unit-14', titulo: 'Unit 14 Beginner', videos: 1 },
]

export default function HeadwayBeginnerPage() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Headway Beginner</span>
            <h1>Headway <span className="gradient-text">Beginner</span></h1>
            <p>Nivel principiante con el metodo Oxford Headway</p>
          </div>
        </div>
      </section>

      <section className="lesson-video-section">
        <div className="container">
          <div className="lesson-breadcrumb">
            <Link href="/lecciones">Lecciones</Link>
            <span>/</span>
            <span>Headway Beginner</span>
          </div>

          <div className="lessons-list">
            {lecciones.map((leccion) => (
              <Link href={`/lecciones/headway-beginner/${leccion.slug}`} key={leccion.slug} style={{ textDecoration: 'none', color: 'inherit' }}>
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
