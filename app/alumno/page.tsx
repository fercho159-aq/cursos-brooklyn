'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap, faBook, faSignOutAlt, faHome, faPlayCircle, faChevronDown, faChevronUp
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
  curso_display: string
  horario_nombre: string | null
  horario_otro: string | null
  fecha_inicio: string | null
  fecha_fin: string | null
  costo_total: number
  saldo_pendiente: number
  estado: string
  modulo_numero: number | null
}

interface Leccion {
  id: number
  tipo_curso: string
  curso_nombre: string
  modulo: string
  numero_leccion: number
  titulo: string
  descripcion: string
  video_url: string | null
  duracion_minutos: number | null
  orden: number
}

export default function AlumnoPage() {
  const router = useRouter()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [lecciones, setLecciones] = useState<Leccion[]>([])
  const [loading, setLoading] = useState(true)
  const [modulosAbiertos, setModulosAbiertos] = useState<string[]>([])

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

        const lecRes = await fetch('/api/alumno/lecciones', { credentials: 'include' })
        if (lecRes.ok) {
          const lecData = await lecRes.json()
          setLecciones(lecData)
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

  const toggleModulo = (modulo: string) => {
    setModulosAbiertos(prev =>
      prev.includes(modulo)
        ? prev.filter(m => m !== modulo)
        : [...prev, modulo]
    )
  }

  // Agrupar lecciones por tipo_curso y modulo
  const leccionesAgrupadas = lecciones.reduce((acc, leccion) => {
    const key = `${leccion.tipo_curso}-${leccion.modulo}`
    if (!acc[key]) {
      acc[key] = {
        tipo_curso: leccion.tipo_curso,
        curso_nombre: leccion.curso_nombre,
        modulo: leccion.modulo,
        lecciones: []
      }
    }
    acc[key].lecciones.push(leccion)
    return acc
  }, {} as Record<string, { tipo_curso: string; curso_nombre: string; modulo: string; lecciones: Leccion[] }>)

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
                    boxShadow: 'var(--shadow)',
                    borderLeft: '4px solid var(--primary)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px' }}>
                    <div>
                      <h3 style={{ marginBottom: '10px', color: 'var(--dark)' }}>
                        {insc.curso_display || insc.curso_nombre}
                      </h3>
                      {insc.modulo_numero && (
                        <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '5px' }}>
                          Módulo {insc.modulo_numero}
                        </p>
                      )}
                      {(insc.horario_nombre || insc.horario_otro) && (
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                          Horario: {insc.horario_nombre || insc.horario_otro}
                        </p>
                      )}
                      {insc.fecha_inicio && insc.fecha_fin && (
                        <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                          {new Date(insc.fecha_inicio).toLocaleDateString('es-MX')} - {new Date(insc.fecha_fin).toLocaleDateString('es-MX')}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{
                        display: 'inline-block',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        background: insc.estado === 'activo' ? '#dcfce7' : 'rgba(100, 116, 139, 0.1)',
                        color: insc.estado === 'activo' ? '#16a34a' : 'var(--gray)'
                      }}>
                        {insc.estado === 'activo' ? 'Activo' : insc.estado}
                      </span>
                      <div style={{ marginTop: '15px' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>Costo del curso</p>
                        <p style={{ fontWeight: 600, fontSize: '1.1rem' }}>${parseFloat(String(insc.costo_total || 0)).toLocaleString()}</p>
                      </div>
                      {parseFloat(String(insc.saldo_pendiente)) > 0 && (
                        <div style={{ marginTop: '10px', padding: '10px', background: '#fef3c7', borderRadius: 'var(--radius)' }}>
                          <p style={{ fontSize: '0.85rem', color: '#92400e' }}>Saldo pendiente</p>
                          <p style={{ fontWeight: 700, fontSize: '1.1rem', color: '#dc2626' }}>
                            ${parseFloat(String(insc.saldo_pendiente)).toLocaleString()}
                          </p>
                        </div>
                      )}
                      {parseFloat(String(insc.saldo_pendiente)) <= 0 && (
                        <div style={{ marginTop: '10px', padding: '10px', background: '#dcfce7', borderRadius: 'var(--radius)' }}>
                          <p style={{ fontWeight: 600, color: '#16a34a' }}>Pagado</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Lecciones */}
        {lecciones.length > 0 && (
          <section style={{ marginBottom: '30px' }}>
            <h2 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faPlayCircle} style={{ color: 'var(--primary)' }} />
              Mis Lecciones
            </h2>

            <div style={{ display: 'grid', gap: '15px' }}>
              {Object.values(leccionesAgrupadas).map((grupo) => {
                const moduloKey = `${grupo.tipo_curso}-${grupo.modulo}`
                const isOpen = modulosAbiertos.includes(moduloKey)

                return (
                  <div
                    key={moduloKey}
                    style={{
                      background: 'var(--white)',
                      borderRadius: 'var(--radius)',
                      boxShadow: 'var(--shadow)',
                      overflow: 'hidden'
                    }}
                  >
                    <button
                      onClick={() => toggleModulo(moduloKey)}
                      style={{
                        width: '100%',
                        padding: '20px',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        textAlign: 'left'
                      }}
                    >
                      <div>
                        <h3 style={{ marginBottom: '5px', color: 'var(--dark)' }}>
                          {grupo.curso_nombre}
                        </h3>
                        <p style={{ color: 'var(--primary)', fontSize: '0.9rem', fontWeight: 600 }}>
                          {grupo.modulo} • {grupo.lecciones.length} lecciones
                        </p>
                      </div>
                      <FontAwesomeIcon
                        icon={isOpen ? faChevronUp : faChevronDown}
                        style={{ color: 'var(--gray)' }}
                      />
                    </button>

                    {isOpen && (
                      <div style={{ borderTop: '1px solid var(--light)', padding: '15px' }}>
                        {grupo.lecciones.map((leccion) => (
                          <div
                            key={leccion.id}
                            style={{
                              padding: '15px',
                              borderRadius: 'var(--radius)',
                              background: 'var(--light)',
                              marginBottom: '10px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '15px'
                            }}
                          >
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '50%',
                              background: 'var(--primary)',
                              color: 'var(--white)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 700,
                              flexShrink: 0
                            }}>
                              {leccion.numero_leccion}
                            </div>
                            <div style={{ flex: 1 }}>
                              <h4 style={{ marginBottom: '5px', color: 'var(--dark)' }}>
                                {leccion.titulo}
                              </h4>
                              {leccion.descripcion && (
                                <p style={{ fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '5px' }}>
                                  {leccion.descripcion}
                                </p>
                              )}
                              {leccion.duracion_minutos && (
                                <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                                  {leccion.duracion_minutos} min
                                </span>
                              )}
                            </div>
                            {leccion.video_url && (
                              <a
                                href={leccion.video_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  padding: '10px 15px',
                                  background: 'var(--primary)',
                                  color: 'var(--white)',
                                  borderRadius: 'var(--radius)',
                                  textDecoration: 'none',
                                  fontSize: '0.85rem',
                                  fontWeight: 600,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}
                              >
                                <FontAwesomeIcon icon={faPlayCircle} />
                                Ver
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

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
