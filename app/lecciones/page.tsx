import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlayCircle, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Lecciones en Video',
  description: 'Accede a las lecciones en video de todos nuestros cursos de ingles. Pre-basico, Beginner, Elementary y Pre-Intermediate.',
}

const cursos = [
  {
    slug: 'pre-basico',
    nombre: 'Pre-basico',
    descripcion: 'Lecciones introductorias para comenzar desde cero con el idioma ingles.',
    lecciones: 5,
    emoji: '🌱',
  },
  {
    slug: 'headway-beginner',
    nombre: 'Headway Beginner',
    descripcion: 'Nivel principiante con el metodo Oxford Headway. Construye bases solidas.',
    lecciones: 14,
    emoji: '📗',
  },
  {
    slug: 'headway-elementary',
    nombre: 'Headway Elementary',
    descripcion: 'Nivel elemental para desarrollar vocabulario y gramatica esencial.',
    lecciones: 9,
    emoji: '📘',
  },
  {
    slug: 'headway-pre-intermediate',
    nombre: 'Headway Pre-Intermediate',
    descripcion: 'Nivel pre-intermedio para ganar fluidez en conversaciones cotidianas.',
    lecciones: 6,
    emoji: '📙',
  },
]

export default function LeccionesPage() {
  return (
    <>
      <Navbar />

      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Clases en Video</span>
            <h1>Lecciones de <span className="gradient-text">Ingles</span></h1>
            <p>Repasa las lecciones de tu curso con nuestros videos exclusivos</p>
          </div>
        </div>
      </section>

      <section className="course-detail">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Selecciona tu Curso</span>
            <h2 className="section-title">Cursos <span className="gradient-text">Disponibles</span></h2>
            <p className="section-subtitle">Elige tu nivel y accede a todas las lecciones en video</p>
          </div>
          <div className="courses-grid">
            {cursos.map((curso) => (
              <Link href={`/lecciones/${curso.slug}`} key={curso.slug} style={{ textDecoration: 'none' }}>
                <div className="course-card" style={{ cursor: 'pointer' }}>
                  <div className="course-icon">{curso.emoji}</div>
                  <h3>{curso.nombre}</h3>
                  <p>{curso.descripcion}</p>
                  <div className="course-meta">
                    <span><FontAwesomeIcon icon={faPlayCircle} /> {curso.lecciones} lecciones</span>
                  </div>
                  <span className="btn btn-primary">
                    Ver Lecciones <FontAwesomeIcon icon={faArrowRight} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  )
}
