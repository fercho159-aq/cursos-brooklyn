'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faGraduationCap, faPhone, faUser,
  faCalendarAlt, faArrowLeft,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons'

export default function RegistroClaseMuestraPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    horario_elegido: ''
  })

  const horarios = [
    'Lunes y Miércoles 10:00 am - 11:30 am',
    'Martes y Jueves 3:30 pm - 5:00 pm',
    'Sábados 9:00 am - 12:00 pm'
  ]

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.celular.trim() || !formData.horario_elegido) {
      setError('Por favor, llena los campos obligatorios (*).')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/registro-clase-muestra', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
      } else {
        setError(data.error || 'Ocurrió un error al enviar el formulario.')
      }
    } catch (err) {
      setError('Error de conexión. Por favor intenta más tarde.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--gradient-hero)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          padding: '50px 40px',
          maxWidth: '500px',
          width: '100%',
          boxShadow: 'var(--shadow-xl)',
          textAlign: 'center'
        }}>
          <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '4rem', color: '#10b981', marginBottom: '20px' }} />
          <h2 style={{ fontSize: '2rem', marginBottom: '15px', color: 'var(--dark)' }}>¡Registro Exitoso!</h2>
          <p style={{ color: 'var(--gray)', fontSize: '1.1rem', marginBottom: '30px', lineHeight: 1.6 }}>
            Hemos recibido tu solicitud para la clase muestra en el horario de <strong>{formData.horario_elegido}</strong>. 
            Pronto un asesor se pondrá en contacto contigo al número {formData.celular} para confirmar tu asistencia.
          </p>
          <Link href="/" className="btn btn-primary btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al Inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--white)',
      padding: '40px 20px',
      position: 'relative'
    }}>
      {/* Elementos de fondo decorativos */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: '350px',
        background: 'var(--gradient-hero)', zIndex: 0,
        borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 1,
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: '40px',
        maxWidth: '650px',
        width: '100%',
        margin: '0 auto',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
            <span style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              width: '80px', 
              height: '80px', 
              background: 'rgba(250, 115, 21, 0.1)', 
              borderRadius: '50%' 
            }}>
              <FontAwesomeIcon icon={faGraduationCap} style={{ color: 'var(--primary)', fontSize: '2.5rem' }} />
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '10px', color: 'var(--dark)' }}>Reserva tu Clase Muestra</h1>
          <p style={{ color: 'var(--gray)', fontSize: '1.1rem' }}>
            Vive la experiencia de Cursos Brooklyn y descubre cómo puedes dominar un nuevo idioma o habilidad.
          </p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2', color: '#DC2626', padding: '15px 20px',
            borderRadius: 'var(--radius)', marginBottom: '30px', fontSize: '1rem',
            borderLeft: '4px solid #DC2626'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '20px' }}>
            
            {/* Nombre */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--dark-light)' }}>
                Nombre Completo *
              </label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faUser} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input
                  type="text" name="nombre" value={formData.nombre} onChange={handleChange} required
                  placeholder="Ej. Juan Pérez"
                  style={{ width: '100%', padding: '12px 16px 12px 45px', border: '2px solid #eaeaea', borderRadius: 'var(--radius)', fontSize: '1rem', transition: 'border-color 0.3s' }}
                />
              </div>
            </div>

            {/* Celular */}
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--dark-light)' }}>
                Número de Celular *
              </label>
              <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faPhone} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }} />
                <input
                  type="tel" name="celular" value={formData.celular} onChange={handleChange} required
                  placeholder="10 dígitos"
                  style={{ width: '100%', padding: '12px 16px 12px 45px', border: '2px solid #eaeaea', borderRadius: 'var(--radius)', fontSize: '1rem' }}
                />
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '30px 0' }} />

          {/* Horario de Clase Muestra */}
          <div style={{ marginBottom: '35px' }}>
            <label style={{ display: 'block', marginBottom: '15px', fontWeight: 700, fontSize: '1.2rem', color: 'var(--dark)' }}>
              ¿En qué horario te gustaría tu clase muestra? *
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
              {horarios.map((h, i) => (
                <div 
                  key={i} 
                  onClick={() => setFormData({ ...formData, horario_elegido: h })}
                  style={{
                    border: formData.horario_elegido === h ? '2px solid var(--primary)' : '2px solid #eaeaea',
                    background: formData.horario_elegido === h ? 'rgba(250, 115, 21, 0.05)' : 'white',
                    padding: '20px 15px',
                    borderRadius: 'var(--radius)',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  {formData.horario_elegido === h && (
                    <div style={{ position: 'absolute', top: 0, right: 0, background: 'var(--primary)', color: 'white', padding: '2px 8px', borderBottomLeftRadius: '8px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                      ✓ Elegido
                    </div>
                  )}
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ fontSize: '1.5rem', color: formData.horario_elegido === h ? 'var(--primary)' : 'var(--gray)', marginBottom: '10px' }} />
                  <div style={{ fontWeight: 600, color: formData.horario_elegido === h ? 'var(--dark)' : 'var(--gray)', fontSize: '0.95rem' }}>
                    {h}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
            style={{ width: '100%', padding: '15px', fontSize: '1.1rem', fontWeight: 600 }}
          >
            {loading ? 'Procesando tu registro...' : (
              <>
                <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '8px' }} /> 
                Confirmar Registro
              </>
            )}
          </button>

          <div style={{ textAlign: 'center', marginTop: '25px' }}>
            <Link
              href="/"
              style={{ color: 'var(--gray)', fontSize: '0.95rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver a la página principal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
