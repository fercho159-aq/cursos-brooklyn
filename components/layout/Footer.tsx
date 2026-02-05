import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <Link href="/">
              <FontAwesomeIcon icon={faGraduationCap} className="highlight" /> Cursos <span className="highlight">Brooklyn</span>
            </Link>
            <p>Transformando vidas a traves de la educacion.</p>
            <div className="footer-social">
              <a href="https://www.instagram.com/cursosbrooklynchimalhuacan" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <FontAwesomeIcon icon={faInstagram} />
              </a>
              <a href="https://www.facebook.com/share/1ErZWi2BwZ/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <FontAwesomeIcon icon={faFacebookF} />
              </a>
              <a href="https://www.tiktok.com/@cursosbrooklynchimal" target="_blank" rel="noopener noreferrer" aria-label="TikTok">
                <FontAwesomeIcon icon={faTiktok} />
              </a>
            </div>
          </div>
          <div className="footer-links">
            <h4>Cursos</h4>
            <ul>
              <li><Link href="/cursos/ingles">Ingles</Link></li>
              <li><Link href="/cursos/marketing">Marketing Digital</Link></li>
            </ul>
          </div>
          <div className="footer-links">
            <h4>Info</h4>
            <ul>
              <li><Link href="/porque-brooklyn">¿Por que Brooklyn?</Link></li>
              <li><Link href="/#sedes">Sedes</Link></li>
              <li><Link href="/#contacto">Contacto</Link></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Cursos Brooklyn. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
