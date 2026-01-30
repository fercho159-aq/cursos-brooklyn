'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faUser, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { faInstagram, faFacebookF, faTiktok } from '@fortawesome/free-brands-svg-icons'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`} id="navbar">
      <div className="nav-container">
        <Link href="/" className="nav-logo">
          <FontAwesomeIcon icon={faGraduationCap} className="highlight" />
          Cursos <span className="highlight">Brooklyn</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`} id="nav-menu">
          <ul className="nav-list">
            <li><Link href="/#inicio" className="nav-link">Inicio</Link></li>
            <li><Link href="/cursos" className="nav-link">Cursos</Link></li>
            <li><Link href="/porque-brooklyn" className="nav-link">¿Por qué Brooklyn?</Link></li>
            <li><Link href="/#promociones" className="nav-link">Promociones</Link></li>
            <li><Link href="/#sedes" className="nav-link">Sedes</Link></li>
            <li><Link href="/#contacto" className="nav-link">Contacto</Link></li>
          </ul>
        </div>

        <div className="nav-actions">
          <div className="nav-social">
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
          <Link href="/login" className="btn btn-nav" style={{ background: 'transparent', border: '2px solid var(--primary)', color: 'var(--primary)' }}>
            <FontAwesomeIcon icon={faUser} /> Iniciar sesion
          </Link>
          <Link href="/inscripcion" className="btn btn-primary btn-nav">
            Inscribete <FontAwesomeIcon icon={faArrowRight} />
          </Link>
          <button
            className="nav-toggle"
            id="nav-toggle"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className="hamburger"></span>
          </button>
        </div>
      </div>
    </nav>
  )
}
