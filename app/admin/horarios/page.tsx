'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUsers, faCalendarAlt, faSun, faMoon, faChevronDown, faChevronUp, faClock } from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  celular: string
  turno: string | null
  horario: string | null
  lunes: boolean
  martes: boolean
  miercoles: boolean
  jueves: boolean
  sabado: boolean
  estado: string | null
}

interface GrupoDias {
  nombre: string
  color: string
  checkDias: (u: Usuario) => boolean
}

const GRUPOS_DIAS: GrupoDias[] = [
  {
    nombre: 'Lunes y Miércoles',
    color: '#3b82f6',
    checkDias: (u) => u.lunes && u.miercoles && !u.martes && !u.jueves && !u.sabado
  },
  {
    nombre: 'Martes y Jueves',
    color: '#8b5cf6',
    checkDias: (u) => u.martes && u.jueves && !u.lunes && !u.miercoles && !u.sabado
  },
  {
    nombre: 'Sábado',
    color: '#10b981',
    checkDias: (u) => u.sabado && !u.lunes && !u.martes && !u.miercoles && !u.jueves
  }
]

export default function HorariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [gruposAbiertos, setGruposAbiertos] = useState<string[]>([])

  const fetchUsuarios = async () => {
    try {
      const res = await fetch('/api/admin/usuarios?rol=alumno', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setUsuarios(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchUsuarios() }, [])

  const toggleGrupo = (nombre: string) => {
    setGruposAbiertos(prev =>
      prev.includes(nombre)
        ? prev.filter(g => g !== nombre)
        : [...prev, nombre]
    )
  }

  const getUsuariosPorGrupo = (grupo: GrupoDias) => {
    return usuarios.filter(grupo.checkDias)
  }

  const getUsuariosSinGrupo = () => {
    return usuarios.filter(u => !GRUPOS_DIAS.some(g => g.checkDias(u)))
  }

  const agruparPorHorario = (usuariosGrupo: Usuario[]) => {
    const porHorario: { [key: string]: Usuario[] } = {}

    usuariosGrupo.forEach(u => {
      const horarioKey = u.horario || 'Sin horario definido'
      const turnoKey = u.turno || 'Sin turno'
      const key = `${turnoKey} - ${horarioKey}`

      if (!porHorario[key]) porHorario[key] = []
      porHorario[key].push(u)
    })

    // Ordenar por turno (Matutino primero)
    const ordenado = Object.entries(porHorario).sort((a, b) => {
      const aMatutino = a[0].toLowerCase().includes('matutino')
      const bMatutino = b[0].toLowerCase().includes('matutino')
      if (aMatutino && !bMatutino) return -1
      if (!aMatutino && bMatutino) return 1
      return a[0].localeCompare(b[0])
    })

    return ordenado
  }

  const totalInscritos = usuarios.length
  const sinGrupo = getUsuariosSinGrupo()

  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ marginBottom: '25px' }}>
        <h1 style={{ margin: '0 0 10px 0' }}>Horarios e Inscripciones</h1>
        <p style={{ margin: 0, color: 'var(--gray)' }}>
          <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
          Total de alumnos inscritos: <strong>{totalInscritos}</strong>
        </p>
      </div>

      {/* Acordeones por grupo de días */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {GRUPOS_DIAS.map(grupo => {
          const usuariosGrupo = getUsuariosPorGrupo(grupo)
          const count = usuariosGrupo.length
          const isOpen = gruposAbiertos.includes(grupo.nombre)
          const horarios = agruparPorHorario(usuariosGrupo)

          return (
            <div key={grupo.nombre} style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden'
            }}>
              {/* Header del acordeón */}
              <div
                onClick={() => toggleGrupo(grupo.nombre)}
                style={{
                  padding: '20px',
                  background: grupo.color,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'white', fontSize: '1.3rem' }} />
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>{grupo.nombre}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      {count} alumno{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <FontAwesomeIcon
                  icon={isOpen ? faChevronUp : faChevronDown}
                  style={{ color: 'white', fontSize: '1.2rem' }}
                />
              </div>

              {/* Contenido desplegable */}
              {isOpen && (
                <div style={{ padding: '0' }}>
                  {horarios.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>
                      No hay alumnos en este grupo
                    </div>
                  ) : (
                    horarios.map(([horarioKey, alumnos]) => {
                      const isMatutino = horarioKey.toLowerCase().includes('matutino')
                      return (
                        <div key={horarioKey} style={{ borderBottom: '1px solid #eee' }}>
                          {/* Header del horario */}
                          <div style={{
                            padding: '15px 20px',
                            background: isMatutino ? '#fef3c7' : '#e0e7ff',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                          }}>
                            <FontAwesomeIcon
                              icon={isMatutino ? faSun : faMoon}
                              style={{ color: isMatutino ? '#f59e0b' : '#6366f1' }}
                            />
                            <FontAwesomeIcon icon={faClock} style={{ color: isMatutino ? '#92400e' : '#3730a3', marginLeft: '5px' }} />
                            <span style={{
                              fontWeight: 600,
                              color: isMatutino ? '#92400e' : '#3730a3'
                            }}>
                              {horarioKey}
                            </span>
                            <span style={{
                              marginLeft: 'auto',
                              background: isMatutino ? '#fbbf24' : '#818cf8',
                              color: 'white',
                              padding: '3px 10px',
                              borderRadius: '12px',
                              fontSize: '0.85rem',
                              fontWeight: 600
                            }}>
                              {alumnos.length}
                            </span>
                          </div>

                          {/* Lista de alumnos */}
                          <div style={{ padding: '0' }}>
                            {alumnos.map((u, idx) => (
                              <div
                                key={u.id}
                                style={{
                                  padding: '12px 20px 12px 50px',
                                  borderBottom: idx < alumnos.length - 1 ? '1px solid #f3f4f6' : 'none',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  gap: '15px'
                                }}
                              >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                  <div style={{
                                    width: '8px',
                                    height: '8px',
                                    borderRadius: '50%',
                                    background: grupo.color
                                  }} />
                                  <span style={{ fontWeight: 500 }}>{u.nombre}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{u.celular}</span>
                                  {u.estado && (
                                    <span style={{
                                      padding: '3px 10px',
                                      borderRadius: '10px',
                                      fontSize: '0.75rem',
                                      background: u.estado.toLowerCase().includes('confirmado') ? '#d1fae5' : '#fef3c7',
                                      color: u.estado.toLowerCase().includes('confirmado') ? '#065f46' : '#92400e'
                                    }}>
                                      {u.estado}
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )}
            </div>
          )
        })}

        {/* Grupo sin horario asignado */}
        {sinGrupo.length > 0 && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => toggleGrupo('sin-grupo')}
              style={{
                padding: '20px',
                background: '#6b7280',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'white', fontSize: '1.3rem' }} />
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Sin horario asignado</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {sinGrupo.length} alumno{sinGrupo.length !== 1 ? 's' : ''} pendiente{sinGrupo.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <FontAwesomeIcon
                icon={gruposAbiertos.includes('sin-grupo') ? faChevronUp : faChevronDown}
                style={{ color: 'white', fontSize: '1.2rem' }}
              />
            </div>

            {gruposAbiertos.includes('sin-grupo') && (
              <div>
                {sinGrupo.map((u, idx) => (
                  <div
                    key={u.id}
                    style={{
                      padding: '15px 20px',
                      borderBottom: idx < sinGrupo.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#6b7280'
                      }} />
                      <span style={{ fontWeight: 500 }}>{u.nombre}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                      <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>{u.celular}</span>
                      {u.estado && (
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          background: '#fef3c7',
                          color: '#92400e'
                        }}>
                          {u.estado}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resumen rápido */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Resumen</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {GRUPOS_DIAS.map(grupo => {
            const count = getUsuariosPorGrupo(grupo).length
            return (
              <div key={grupo.nombre} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: grupo.color }} />
                <span>{grupo.nombre}: <strong>{count}</strong></span>
              </div>
            )
          })}
          {sinGrupo.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280' }} />
              <span>Pendientes: <strong>{sinGrupo.length}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
