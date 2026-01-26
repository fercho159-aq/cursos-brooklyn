'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5215625813428?text=Hola,%20me%20interesa%20informaci%C3%B3n%20sobre%20los%20cursos%20de%20Brooklyn"
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="Contactanos por WhatsApp"
    >
      <FontAwesomeIcon icon={faWhatsapp} />
      <span className="whatsapp-tooltip">¿Necesitas ayuda?</span>
    </a>
  )
}
