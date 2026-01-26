'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap, faBook, faMoneyBill, faSignOutAlt, faHome
} from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  celular: string
  email: string | null
  rol: string
}

interface Inscripcion {
  id: number
  curso_nombre: string
  horario_nombre: string
  fecha_inicio: string
  fecha_fin: string
  saldo_pendiente: number
  estado: string
}

export default function AlumnoPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRes = await fetch('/api/me', { credentials: 'include' })
        const userData = await userRes.json()

        if (userData.error) {
          router.push('/login')
          return
        }

        setUsuario(userData)

        const inscRes = await fetch('/api/alumno/inscripciones', { credentials: 'include' })
        if (inscRes.ok) {
          const inscData = await inscRes.json()
          setInscripciones(inscData)
        }
      } catch (error) {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    router.push('/login')
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light)'
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)' }}>
      {/* Header */}
      <header style={{
        background: 'var(--white)',
        padding: '15px 30px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>Mi Portal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <span style={{ color: 'var(--gray)' }}>Hola, {usuario?.nombre}</span>
          <Link href="/" style={{ color: 'var(--gray)' }}>
            <FontAwesomeIcon icon={faHome} />
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--gray)'
            }}
          >
            <FontAwesomeIcon icon={faSignOutAlt} />
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '30px' }}>Bienvenido, {usuario?.nombre}</h1>

        {/* Inscripciones */}
        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon icon={faBook} style={{ color: 'var(--primary)' }} />
            Mis Inscripciones
          </h2>

          {inscripciones.length === 0 ? (
            <div style={{
              background: 'var(--white)',
              padding: '40px',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              textAlign: 'center'
            }}>
              <p style={{ color: 'var(--gray)' }}>No tienes inscripciones activas.</p>
              <Link href="/#contacto" className="btn btn-primary" style={{ marginTop: '15px', display: 'inline-block' }}>
                Inscribirme a un curso
              </Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '20px' }}>
              {inscripciones.map((insc) => (
                <div
                  key={insc.id}
                  style={{
                    background: 'var(--white)',
                    padding: '25px',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 style={{ marginBottom: '5px' }}>{insc.curso_nombre}</h3>
                      <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Horario: {insc.horario_nombre}</p>
                      <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                        {new Date(insc.fecha_inicio).toLocaleDateString('es-MX')} - {new Date(insc.fecha_fin).toLocaleDateString('es-MX')}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: insc.estado === 'activo' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(100, 116, 139, 0.1)',
                        color: insc.estado === 'activo' ? 'var(--accent)' : 'var(--gray)'
                      }}>
                        {insc.estado}
                      </span>
                      {insc.saldo_pendiente > 0 && (
                        <p style={{ marginTop: '10px', color: 'var(--secondary)', fontWeight: 600 }}>
                          Saldo: ${insc.saldo_pendiente.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Info */}
        <div style={{
          background: 'var(--white)',
          padding: '30px',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '15px' }}>¿Necesitas ayuda?</h3>
          <p style={{ color: 'var(--gray)', marginBottom: '20px' }}>
            Contactanos por WhatsApp para cualquier duda sobre tus cursos o pagos.
          </p>
          <a
            href="https://wa.me/5215625813428?text=Hola,%20necesito%20ayuda%20con%20mi%20cuenta"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            Contactar por WhatsApp
          </a>
        </div>
      </main>
    </div>
  )
}
