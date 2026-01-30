'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap, faUser, faPhone, faEnvelope, faCalendarAlt,
  faBook, faClock, faCheckCircle, faArrowLeft, faSpinner, faPen
} from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

interface Curso {
  id: number
  nombre: string
  descripcion: string
  costo: number
}

interface Horario {
  id: number
  nombre: string
  dias: string
  hora_inicio: string
  hora_fin: string
}

export default function InscripcionPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [credenciales, setCredenciales] = useState<{ celular: string; password: string } | null>(null)

  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
    edad: '',
    curso_id: '',
    horario_id: '',
    horario_otro: '',
    notas: ''
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/inscripcion')
      if (res.ok) {
        const data = await res.json()
        setCursos(data.cursos)
        setHorarios(data.horarios)
        if (data.cursos.length > 0) {
          setFormData(prev => ({ ...prev, curso_id: data.cursos[0].id.toString() }))
        }
      }
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/inscripcion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          curso_id: parseInt(formData.curso_id),
          horario_id: formData.horario_id && formData.horario_id !== 'otro' ? parseInt(formData.horario_id) : null,
          edad: formData.edad ? parseInt(formData.edad) : null
        })
      })

      const data = await res.json()

      if (res.ok) {
        setSuccess(true)
        setCredenciales(data.credenciales)
      } else {
        setError(data.error || 'Error al procesar la inscripcion')
      }
    } catch (err) {
      setError('Error de conexion. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  const cursoSeleccionado = cursos.find(c => c.id.toString() === formData.curso_id)

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
          <div style={{
            width: '80px',
            height: '80px',
            background: '#DCFCE7',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px',
            fontSize: '2.5rem',
            color: '#16A34A'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '15px', color: '#16A34A' }}>
            Inscripcion Exitosa
          </h1>
          <p style={{ color: 'var(--gray)', marginBottom: '30px' }}>
            Tu registro ha sido completado. Pronto nos pondremos en contacto contigo.
          </p>

          {credenciales && (
            <div style={{
              background: '#F0F9FF',
              border: '1px solid #0EA5E9',
              borderRadius: 'var(--radius)',
              padding: '20px',
              marginBottom: '30px',
              textAlign: 'left'
            }}>
              <h3 style={{ fontSize: '1rem', marginBottom: '15px', color: '#0369A1' }}>
                Tus credenciales de acceso:
              </h3>
              <p style={{ marginBottom: '10px' }}>
                <strong>Usuario:</strong> {credenciales.celular}
              </p>
              <p style={{ marginBottom: '0' }}>
                <strong>Contrasena:</strong> {credenciales.password}
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <Link href="/login" className="btn btn-primary btn-lg btn-block">
              Iniciar Sesion
            </Link>
            <a
              href="https://wa.me/5215625813428?text=Hola,%20acabo%20de%20inscribirme%20y%20quisiera%20mas%20informacion"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline btn-lg btn-block"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}
            >
              <FontAwesomeIcon icon={faWhatsapp} /> Contactar por WhatsApp
            </a>
            <Link
              href="/"
              style={{
                color: 'var(--gray)',
                fontSize: '0.9rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px'
              }}
            >
              <FontAwesomeIcon icon={faArrowLeft} /> Volver al inicio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      padding: '40px 20px'
    }}>
      <div style={{
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-xl)',
          overflow: 'hidden'
        }}>
          {/* Header */}
          <div style={{
            background: 'var(--primary)',
            padding: '30px',
            textAlign: 'center',
            color: 'white'
          }}>
            <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '3rem', marginBottom: '15px' }} />
            <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Inscribete Ahora</h1>
            <p style={{ opacity: 0.9 }}>Completa el formulario para registrarte</p>
          </div>

          {/* Form */}
          <div style={{ padding: '30px' }}>
            {error && (
              <div style={{
                background: '#FEE2E2',
                color: '#DC2626',
                padding: '12px 16px',
                borderRadius: 'var(--radius)',
                marginBottom: '20px',
                fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <FontAwesomeIcon icon={faSpinner} spin style={{ fontSize: '2rem', color: 'var(--primary)' }} />
                <p style={{ marginTop: '15px', color: 'var(--gray)' }}>Cargando...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Datos personales */}
                <h3 style={{
                  fontSize: '1rem',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid var(--light)',
                  color: 'var(--dark)'
                }}>
                  <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px', color: 'var(--primary)' }} />
                  Datos Personales
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Nombre completo *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                      icon={faUser}
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                    />
                    <input
                      type="text"
                      value={formData.nombre}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Tu nombre completo"
                      required
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 42px',
                        border: '2px solid var(--light)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Celular *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FontAwesomeIcon
                        icon={faPhone}
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                      />
                      <input
                        type="tel"
                        value={formData.celular}
                        onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                        placeholder="5512345678"
                        required
                        style={{
                          width: '100%',
                          padding: '14px 14px 14px 42px',
                          border: '2px solid var(--light)',
                          borderRadius: 'var(--radius)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Edad
                    </label>
                    <div style={{ position: 'relative' }}>
                      <FontAwesomeIcon
                        icon={faCalendarAlt}
                        style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                      />
                      <input
                        type="number"
                        min="5"
                        max="99"
                        value={formData.edad}
                        onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                        placeholder="25"
                        style={{
                          width: '100%',
                          padding: '14px 14px 14px 42px',
                          border: '2px solid var(--light)',
                          borderRadius: 'var(--radius)',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Correo electronico
                  </label>
                  <div style={{ position: 'relative' }}>
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--gray)' }}
                    />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="tu@email.com"
                      style={{
                        width: '100%',
                        padding: '14px 14px 14px 42px',
                        border: '2px solid var(--light)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                </div>

                {/* Seleccion de curso */}
                <h3 style={{
                  fontSize: '1rem',
                  marginBottom: '20px',
                  paddingBottom: '10px',
                  borderBottom: '2px solid var(--light)',
                  color: 'var(--dark)'
                }}>
                  <FontAwesomeIcon icon={faBook} style={{ marginRight: '10px', color: 'var(--primary)' }} />
                  Selecciona tu Curso
                </h3>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    Curso *
                  </label>
                  <select
                    value={formData.curso_id}
                    onChange={(e) => setFormData({ ...formData, curso_id: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid var(--light)',
                      borderRadius: 'var(--radius)',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    {cursos.map(curso => (
                      <option key={curso.id} value={curso.id}>
                        {curso.nombre} - ${curso.costo.toLocaleString()}/mes
                      </option>
                    ))}
                  </select>
                  {cursoSeleccionado?.descripcion && (
                    <p style={{ marginTop: '8px', fontSize: '0.85rem', color: 'var(--gray)' }}>
                      {cursoSeleccionado.descripcion}
                    </p>
                  )}
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px', color: 'var(--primary)' }} />
                    Horario preferido
                  </label>
                  <select
                    value={formData.horario_id}
                    onChange={(e) => setFormData({ ...formData, horario_id: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid var(--light)',
                      borderRadius: 'var(--radius)',
                      fontSize: '1rem',
                      background: 'white'
                    }}
                  >
                    <option value="">Seleccionar horario...</option>
                    {horarios.map(horario => (
                      <option key={horario.id} value={horario.id}>
                        {horario.nombre} {horario.dias && `(${horario.dias})`}
                      </option>
                    ))}
                    <option value="otro">Otro horario</option>
                  </select>
                </div>

                {formData.horario_id === 'otro' && (
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                      Especifica tu horario
                    </label>
                    <input
                      type="text"
                      value={formData.horario_otro}
                      onChange={(e) => setFormData({ ...formData, horario_otro: e.target.value })}
                      placeholder="Ej: Lunes y Miercoles 6pm"
                      style={{
                        width: '100%',
                        padding: '14px',
                        border: '2px solid var(--light)',
                        borderRadius: 'var(--radius)',
                        fontSize: '1rem'
                      }}
                    />
                  </div>
                )}

                <div style={{ marginBottom: '30px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
                    <FontAwesomeIcon icon={faPen} style={{ marginRight: '8px', color: 'var(--primary)' }} />
                    Notas adicionales
                  </label>
                  <textarea
                    value={formData.notas}
                    onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                    placeholder="Alguna pregunta o comentario..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px',
                      border: '2px solid var(--light)',
                      borderRadius: 'var(--radius)',
                      fontSize: '1rem',
                      resize: 'vertical'
                    }}
                  />
                </div>

                {/* Resumen */}
                {cursoSeleccionado && (
                  <div style={{
                    background: '#F0FDF4',
                    border: '1px solid #22C55E',
                    borderRadius: 'var(--radius)',
                    padding: '20px',
                    marginBottom: '25px'
                  }}>
                    <h4 style={{ marginBottom: '10px', color: '#16A34A' }}>Resumen de tu inscripcion</h4>
                    <p><strong>Curso:</strong> {cursoSeleccionado.nombre}</p>
                    <p><strong>Costo mensual:</strong> ${cursoSeleccionado.costo.toLocaleString()}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary btn-lg btn-block"
                  style={{
                    marginBottom: '15px',
                    opacity: submitting ? 0.7 : 1,
                    cursor: submitting ? 'wait' : 'pointer'
                  }}
                >
                  {submitting ? (
                    <>
                      <FontAwesomeIcon icon={faSpinner} spin /> Procesando...
                    </>
                  ) : (
                    <>
                      <FontAwesomeIcon icon={faCheckCircle} /> Completar Inscripcion
                    </>
                  )}
                </button>

                <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--gray)', marginBottom: '20px' }}>
                  Al inscribirte, aceptas nuestros terminos y condiciones.
                </p>

                <div style={{ textAlign: 'center' }}>
                  <Link
                    href="/"
                    style={{
                      color: 'var(--gray)',
                      fontSize: '0.9rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} /> Volver al inicio
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
