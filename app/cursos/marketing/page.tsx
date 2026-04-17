import type { Metadata } from 'next'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faHashtag, faBullhorn, faChartLine, faPenNib, faClock,
  faLaptopHouse, faCalendarAlt, faArrowRight, faGift
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp, faInstagram, faFacebook, faTiktok } from '@fortawesome/free-brands-svg-icons'
import { Navbar, Footer, WhatsAppButton, BackToTop } from '@/components/layout'

export const metadata: Metadata = {
  title: 'Curso de Marketing Digital',
  description: 'Aprende Marketing Digital en Cursos Brooklyn. Domina redes sociales, publicidad digital y creacion de contenido.',
}

export default function CursoMarketingPage() {
  return (
    <>
      <Navbar />

      {/* Page Hero */}
      <section className="page-hero">
        <div className="page-hero-bg"></div>
        <div className="container">
          <div className="page-hero-content">
            <span className="page-badge">Programa de Marketing</span>
            <h1>Marketing <span className="gradient-text">Digital</span></h1>
            <p>Domina las estrategias mas efectivas del mundo digital</p>
          </div>
        </div>
      </section>

      {/* Course Detail */}
      <section className="course-detail">
        <div className="container">
          <div className="course-detail-grid">
            <div className="course-detail-content">
              <span className="course-tag new">Nuevo Programa</span>
              <h2>Conviertete en experto en <span className="gradient-text">Marketing Digital</span></h2>
              <p className="course-intro">
                Aprende las habilidades mas demandadas del mercado actual. Desde redes sociales hasta
                publicidad digital, te enseñamos todo lo necesario para impulsar cualquier negocio
                en el mundo digital.
              </p>

              <div className="course-highlights">
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faHashtag} />
                  </div>
                  <div>
                    <h4>Redes Sociales</h4>
                    <p>Domina Instagram, Facebook, TikTok y otras plataformas para crear contenido viral.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faBullhorn} />
                  </div>
                  <div>
                    <h4>Publicidad Digital</h4>
                    <p>Aprende a crear campañas efectivas en Meta Ads, Google Ads y otras plataformas.</p>
                  </div>
                </div>
                <div className="highlight-item">
                  <div className="highlight-icon">
                    <FontAwesomeIcon icon={faChartLine} />
                  </div>
                  <div>
                    <h4>Analitica y Estrategia</h4>
                    <p>Mide resultados y optimiza tus estrategias basandote en datos reales.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="course-detail-sidebar">
              <div className="course-info-card marketing-card">
                <div className="course-emoji">📱</div>
                <h3>Marketing Digital</h3>
                <div className="course-price">
                  <span className="price-from">Planes</span>
                  <span className="price-value flexible">Flexibles</span>
                </div>
                <ul className="course-specs">
                  <li style={{ padding: '0.5rem 0' }}>
                    <FontAwesomeIcon icon={faClock} style={{ color: '#f39c12' }} /> <strong>1 Módulo por mes</strong>
                  </li>
                  <li style={{ padding: '0.5rem 0' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#e74c3c' }} /> <strong style={{ color: '#e74c3c', fontSize: '1.1rem', borderBottom: '2px solid #e74c3c' }}>Horarios Flexibles</strong>
                  </li>
                  <li style={{ padding: '0.5rem 0' }}>
                    <FontAwesomeIcon icon={faLaptopHouse} /> Presencial u Online
                  </li>
                  <li style={{ padding: '0.5rem 0' }}>
                    <FontAwesomeIcon icon={faPenNib} /> Proyectos reales
                  </li>
                </ul>
                <div className="course-modules">
                  <h4><FontAwesomeIcon icon={faCalendarAlt} /> Modulos Disponibles</h4>
                  <div className="module-list">
                    <span className="module-tag">Redes Sociales</span>
                    <span className="module-tag">Publicidad</span>
                    <span className="module-tag">Contenido</span>
                    <span className="module-tag">SEO</span>
                  </div>
                </div>
                <a
                  href="https://wa.me/5215625813428?text=Hola,%20me%20interesa%20el%20curso%20de%20Marketing%20Digital"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary btn-lg btn-block"
                >
                  <FontAwesomeIcon icon={faWhatsapp} /> Solicitar Informacion
                </a>
                <p className="promo-note">
                  <FontAwesomeIcon icon={faGift} /> ¡Inscripcion GRATIS en enero!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketing Modules */}
      <section className="marketing-modules">
        <div className="container">
          <div className="section-header">
            <span className="section-badge">Modulos del Programa</span>
            <h2 className="section-title">Aprende paso a <span className="gradient-text">paso</span></h2>
          </div>
          <div className="modules-grid">
            <div className="module-card">
              <div className="module-icon">
                <FontAwesomeIcon icon={faInstagram} />
              </div>
              <h3>Redes Sociales</h3>
              <p>Domina las principales plataformas: Instagram, Facebook, TikTok y mas.</p>
              <span className="module-duration"><FontAwesomeIcon icon={faClock} /> 2 meses</span>
            </div>
            <div className="module-card">
              <div className="module-icon">
                <FontAwesomeIcon icon={faPenNib} />
              </div>
              <h3>Creacion de Contenido</h3>
              <p>Aprende a crear contenido visual y escrito que conecte con tu audiencia.</p>
              <span className="module-duration"><FontAwesomeIcon icon={faClock} /> 2 meses</span>
            </div>
            <div className="module-card">
              <div className="module-icon">
                <FontAwesomeIcon icon={faBullhorn} />
              </div>
              <h3>Publicidad Digital</h3>
              <p>Crea campañas efectivas en Meta Ads y Google Ads.</p>
              <span className="module-duration"><FontAwesomeIcon icon={faClock} /> 2 meses</span>
            </div>
            <div className="module-card">
              <div className="module-icon">
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h3>Analitica Web</h3>
              <p>Mide, analiza y optimiza tus estrategias digitales.</p>
              <span className="module-duration"><FontAwesomeIcon icon={faClock} /> 2 meses</span>
            </div>
          </div>
        </div>
      </section>

      {/* Promociones Section */}
      <section className="promotions-section" style={{ padding: '6rem 0', backgroundColor: '#fdfbfa' }}>
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span className="section-badge" style={{ backgroundColor: '#ffeaa7', color: '#d35400' }}>¡Ofertas Especiales!</span>
            <h2 className="section-title">Aprovecha nuestras <span className="gradient-text">Promociones</span></h2>
          </div>
          <div className="modules-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
            <div className="module-card" style={{ borderTop: '4px solid #f39c12', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div className="module-icon" style={{ backgroundColor: '#fff3e0', color: '#f39c12', marginBottom: '1.5rem', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                <FontAwesomeIcon icon={faGift} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>50% de Descuento</h3>
              <p style={{ color: '#555', lineHeight: '1.6', flexGrow: 1 }}>Inscribe tu segundo curso con un increíble <strong>50% de descuento</strong>. No pierdas la oportunidad de expandir tus conocimientos en Inglés y otras áreas.</p>
            </div>
            
            <div className="module-card" style={{ borderTop: '4px solid #e74c3c', position: 'relative', display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ position: 'absolute', top: '-16px', right: '20px', background: '#e74c3c', color: 'white', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 4px 6px rgba(231, 76, 60, 0.2)' }}>
                PAQUETE ESTELAR
              </div>
              <div className="module-icon" style={{ backgroundColor: '#fdecea', color: '#e74c3c', marginBottom: '1.5rem', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
                <FontAwesomeIcon icon={faLaptopHouse} />
              </div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: '#2c3e50' }}>Inglés + Marketing Digital</h3>
              <p style={{ color: '#555', lineHeight: '1.6', marginBottom: '1.5rem', flexGrow: 1 }}>El combo definitivo para potenciar tu currículum y carrera profesional por un precio exclusivo e inigualable.</p>
              <div style={{ marginTop: 'auto', fontSize: '1.6rem', fontWeight: '800', color: '#e74c3c', background: '#fdf0ed', padding: '1rem', borderRadius: '10px', textAlign: 'center', border: '2px dashed #e74c3c' }}>
                ¡Oferta Especial!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>¿Listo para dominar el <span className="gradient-text">marketing digital</span>?</h2>
            <p>Inscribete hoy y comienza a transformar negocios en el mundo digital.</p>
            <div className="cta-buttons">
              <a
                href="https://wa.me/5215625813428?text=Hola,%20quiero%20inscribirme%20al%20curso%20de%20Marketing%20Digital"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-light btn-lg"
              >
                <FontAwesomeIcon icon={faWhatsapp} /> Inscribirme Ahora
              </a>
              <Link href="/cursos" className="btn btn-outline btn-lg">
                Ver otros cursos
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
