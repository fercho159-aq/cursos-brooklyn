'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faChalkboardTeacher, faSun, faMoon, faChevronDown, faChevronUp,
  faClock
} from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  celular: string
  turno: string | null
  horario: string | null
  estado: string | null
  profesor_id: number | null
  activo?: boolean
}

export default function HorariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [profesores, setProfesores] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [profesoresAbiertos, setProfesoresAbiertos] = useState<number[]>([])

  const fetchData = async () => {
    try {
      const [usuariosRes, profsRes] = await Promise.all([
        fetch('/api/admin/usuarios?rol=alumno', { credentials: 'include' }),
        fetch('/api/admin/usuarios?rol=profesor', { credentials: 'include' })
      ])

      if (usuariosRes.ok) setUsuarios(await usuariosRes.json())
      if (profsRes.ok) setProfesores(await profsRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const toggleProfesor = (id: number) => {
    setProfesoresAbiertos(prev =>
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    )
  }

  const isUsuarioActivoHorarios = (u: Usuario) => {
    if (u.activo === false) return false;
    if (!u.estado) return false; 
    const estadoStr = u.estado.trim().toLowerCase();
    return ['confirmado', 'pendiente horario', 'activo'].includes(estadoStr);
  }

  const getUsuariosPorProfesor = (profesorId: number) => {
    return usuarios.filter(u => u.profesor_id === profesorId && isUsuarioActivoHorarios(u))
  }

  const getUsuariosSinProfesor = () => {
    return usuarios.filter(u => (!u.profesor_id) && isUsuarioActivoHorarios(u))
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

    return Object.entries(porHorario).sort((a, b) => {
      const aMatutino = a[0].toLowerCase().includes('matutino')
      const bMatutino = b[0].toLowerCase().includes('matutino')
      if (aMatutino && !bMatutino) return -1
      if (!aMatutino && bMatutino) return 1
      return a[0].localeCompare(b[0])
    })
  }

  const totalInscritos = usuarios.filter(u => isUsuarioActivoHorarios(u)).length
  const sinProfesor = getUsuariosSinProfesor()

  if (loading) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <p>Cargando...</p>
      </div>
    )
  }

  const coloresProfesores = [
    '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1'
  ]

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>Grupos y Horarios</h1>
          <p style={{ margin: 0, color: 'var(--gray)' }}>
            <FontAwesomeIcon icon={faUsers} style={{ marginRight: '8px' }} />
            Total de alumnos inscritos: <strong>{totalInscritos}</strong>
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {profesores.map((profesor, pIdx) => {
          const usuariosProf = getUsuariosPorProfesor(profesor.id)
          const count = usuariosProf.length
          if (count === 0) return null; // No mostrar profesores sin alumnos si se quiere, o se pueden mostrar
          
          const isOpen = profesoresAbiertos.includes(profesor.id)
          const horarios = agruparPorHorario(usuariosProf)
          const color = coloresProfesores[pIdx % coloresProfesores.length]

          return (
            <div key={profesor.id} style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden'
            }}>
              <div
                onClick={() => toggleProfesor(profesor.id)}
                style={{
                  padding: '20px',
                  background: color,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: 'white', fontSize: '1.3rem' }} />
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Prof. {profesor.nombre}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      {count} alumno{count !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    style={{ color: 'white', fontSize: '1.2rem', marginLeft: '10px' }}
                  />
                </div>
              </div>

              {isOpen && (
                <div>
                  {horarios.map(([horarioKey, alumnos]) => {
                    const isMatutino = horarioKey.toLowerCase().includes('matutino')
                    return (
                      <div key={horarioKey} style={{ borderBottom: '1px solid #eee' }}>
                        <div style={{
                          padding: '15px 20px',
                          background: isMatutino ? '#fef3c7' : '#e0e7ff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px'
                        }}>
                          <FontAwesomeIcon icon={isMatutino ? faSun : faMoon} style={{ color: isMatutino ? '#f59e0b' : '#6366f1' }} />
                          <FontAwesomeIcon icon={faClock} style={{ color: isMatutino ? '#92400e' : '#3730a3', marginLeft: '5px' }} />
                          <span style={{ fontWeight: 600, color: isMatutino ? '#92400e' : '#3730a3' }}>
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

                        <div>
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
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
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
                  })}
                </div>
              )}
            </div>
          )
        })}

        {sinProfesor.length > 0 && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => toggleProfesor(0)}
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
                <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: 'white', fontSize: '1.3rem' }} />
                <div>
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Sin profesor asignado</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {sinProfesor.length} alumno{sinProfesor.length !== 1 ? 's' : ''} pendiente{sinProfesor.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <FontAwesomeIcon
                icon={profesoresAbiertos.includes(0) ? faChevronUp : faChevronDown}
                style={{ color: 'white', fontSize: '1.2rem' }}
              />
            </div>

            {profesoresAbiertos.includes(0) && (
              <div>
                {sinProfesor.map((u, idx) => (
                  <div
                    key={u.id}
                    style={{
                      padding: '15px 20px',
                      borderBottom: idx < sinProfesor.length - 1 ? '1px solid #eee' : 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6b7280' }} />
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

      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Resumen</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {profesores.map((p, idx) => {
            const count = getUsuariosPorProfesor(p.id).length;
            if (count === 0) return null;
            return (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: coloresProfesores[idx % coloresProfesores.length] }} />
                <span>Prof. {p.nombre}: <strong>{count}</strong></span>
              </div>
            )
          })}
          {sinProfesor.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280' }} />
              <span>Sin grupo: <strong>{sinProfesor.length}</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
