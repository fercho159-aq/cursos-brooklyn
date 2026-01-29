'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faCalendarAlt, faSun, faMoon, faChevronDown, faChevronUp,
  faClock, faPlus, faEdit, faTrash, faTimes, faSave
} from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  celular: string
  turno: string | null
  horario: string | null
  estado: string | null
  grupo_id: number | null
}

interface Grupo {
  id: number
  nombre: string
  dias: string
  turno: string | null
  horario: string | null
  color: string
  activo: boolean
  total_alumnos: number
}

export default function HorariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [gruposAbiertos, setGruposAbiertos] = useState<number[]>([])

  // Modal de grupo
  const [modalGrupoOpen, setModalGrupoOpen] = useState(false)
  const [editingGrupo, setEditingGrupo] = useState<Grupo | null>(null)
  const [savingGrupo, setSavingGrupo] = useState(false)
  const [grupoForm, setGrupoForm] = useState({
    nombre: '',
    dias: '',
    turno: '',
    horario: '',
    color: '#3b82f6'
  })

  // Modal de edición de horario
  const [modalHorarioOpen, setModalHorarioOpen] = useState(false)
  const [savingHorario, setSavingHorario] = useState(false)
  const [horarioEditData, setHorarioEditData] = useState<{
    grupoId: number
    oldTurno: string
    oldHorario: string
    newTurno: string
    newHorario: string
    usuarios: Usuario[]
  } | null>(null)

  const fetchData = async () => {
    try {
      const [usuariosRes, gruposRes] = await Promise.all([
        fetch('/api/admin/usuarios?rol=alumno', { credentials: 'include' }),
        fetch('/api/admin/grupos', { credentials: 'include' })
      ])

      if (usuariosRes.ok) setUsuarios(await usuariosRes.json())
      if (gruposRes.ok) setGrupos(await gruposRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const toggleGrupo = (id: number) => {
    setGruposAbiertos(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  const getUsuariosPorGrupo = (grupoId: number) => {
    return usuarios.filter(u => u.grupo_id === grupoId)
  }

  const getUsuariosSinGrupo = () => {
    return usuarios.filter(u => u.grupo_id === null)
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

  // CRUD de Grupos
  const openCreateGrupo = () => {
    setEditingGrupo(null)
    setGrupoForm({ nombre: '', dias: '', turno: '', horario: '', color: '#3b82f6' })
    setModalGrupoOpen(true)
  }

  const openEditGrupo = (grupo: Grupo, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingGrupo(grupo)
    setGrupoForm({
      nombre: grupo.nombre,
      dias: grupo.dias,
      turno: grupo.turno || '',
      horario: grupo.horario || '',
      color: grupo.color || '#3b82f6'
    })
    setModalGrupoOpen(true)
  }

  const handleSaveGrupo = async () => {
    if (!grupoForm.nombre.trim() || !grupoForm.dias.trim()) {
      alert('Nombre y días son requeridos')
      return
    }

    setSavingGrupo(true)
    try {
      const url = editingGrupo ? `/api/admin/grupos?id=${editingGrupo.id}` : '/api/admin/grupos'
      const res = await fetch(url, {
        method: editingGrupo ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(grupoForm)
      })

      if (res.ok) {
        setModalGrupoOpen(false)
        fetchData()
      } else {
        const error = await res.json()
        alert(error.error || 'Error al guardar')
      }
    } catch {
      alert('Error al guardar')
    } finally {
      setSavingGrupo(false)
    }
  }

  const handleDeleteGrupo = async (grupo: Grupo, e: React.MouseEvent) => {
    e.stopPropagation()
    if (!confirm(`¿Eliminar el grupo "${grupo.nombre}"? Los alumnos quedarán sin grupo asignado.`)) return

    try {
      const res = await fetch(`/api/admin/grupos?id=${grupo.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) fetchData()
      else alert('Error al eliminar')
    } catch {
      alert('Error al eliminar')
    }
  }

  // Funciones para editar horarios
  const openEditHorario = (grupoId: number, turno: string, horario: string, usuariosHorario: Usuario[]) => {
    const turnoLimpio = turno === 'Sin turno' ? '' : turno
    const horarioLimpio = horario === 'Sin horario definido' ? '' : horario
    setHorarioEditData({
      grupoId,
      oldTurno: turnoLimpio,
      oldHorario: horarioLimpio,
      newTurno: turnoLimpio,
      newHorario: horarioLimpio,
      usuarios: usuariosHorario
    })
    setModalHorarioOpen(true)
  }

  const handleSaveHorario = async () => {
    if (!horarioEditData) return

    setSavingHorario(true)
    try {
      // Actualizar todos los usuarios del sub-grupo
      const promises = horarioEditData.usuarios.map(u =>
        fetch(`/api/admin/usuarios?id=${u.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            turno: horarioEditData.newTurno || null,
            horario: horarioEditData.newHorario || null
          })
        })
      )

      await Promise.all(promises)
      setModalHorarioOpen(false)
      setHorarioEditData(null)
      fetchData()
    } catch {
      alert('Error al actualizar horarios')
    } finally {
      setSavingHorario(false)
    }
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

  const coloresDisponibles = [
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
        <button onClick={openCreateGrupo} style={{
          padding: '10px 20px',
          background: 'var(--primary)',
          color: 'white',
          border: 'none',
          borderRadius: 'var(--radius)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Grupo
        </button>
      </div>

      {/* Acordeones por grupo */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {grupos.map(grupo => {
          const usuariosGrupo = getUsuariosPorGrupo(grupo.id)
          const count = usuariosGrupo.length
          const isOpen = gruposAbiertos.includes(grupo.id)
          const horarios = agruparPorHorario(usuariosGrupo)

          return (
            <div key={grupo.id} style={{
              background: 'var(--white)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              overflow: 'hidden'
            }}>
              {/* Header del acordeón */}
              <div
                onClick={() => toggleGrupo(grupo.id)}
                style={{
                  padding: '20px',
                  background: grupo.color,
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <FontAwesomeIcon icon={faCalendarAlt} style={{ color: 'white', fontSize: '1.3rem' }} />
                  <div>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>{grupo.nombre}</div>
                    <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                      {count} alumno{count !== 1 ? 's' : ''} • {grupo.dias}
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <button
                    onClick={(e) => openEditGrupo(grupo, e)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '5px', padding: '8px 10px', cursor: 'pointer', color: 'white' }}
                    title="Editar grupo"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={(e) => handleDeleteGrupo(grupo, e)}
                    style={{ background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '5px', padding: '8px 10px', cursor: 'pointer', color: 'white' }}
                    title="Eliminar grupo"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                  <FontAwesomeIcon
                    icon={isOpen ? faChevronUp : faChevronDown}
                    style={{ color: 'white', fontSize: '1.2rem', marginLeft: '10px' }}
                  />
                </div>
              </div>

              {/* Contenido desplegable */}
              {isOpen && (
                <div>
                  {horarios.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>
                      No hay alumnos en este grupo
                    </div>
                  ) : (
                    horarios.map(([horarioKey, alumnos]) => {
                      const isMatutino = horarioKey.toLowerCase().includes('matutino')
                      const [turnoDisplay, horarioDisplay] = horarioKey.split(' - ')
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
                            <button
                              onClick={() => openEditHorario(grupo.id, turnoDisplay, horarioDisplay, alumnos)}
                              style={{
                                background: 'rgba(0,0,0,0.1)',
                                border: 'none',
                                borderRadius: '5px',
                                padding: '5px 8px',
                                cursor: 'pointer',
                                color: isMatutino ? '#92400e' : '#3730a3'
                              }}
                              title="Editar horario"
                            >
                              <FontAwesomeIcon icon={faEdit} size="sm" />
                            </button>
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
                                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: grupo.color }} />
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

        {/* Sin grupo */}
        {sinGrupo.length > 0 && (
          <div style={{
            background: 'var(--white)',
            borderRadius: 'var(--radius)',
            boxShadow: 'var(--shadow)',
            overflow: 'hidden'
          }}>
            <div
              onClick={() => toggleGrupo(0)}
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
                  <div style={{ color: 'white', fontWeight: 700, fontSize: '1.2rem' }}>Sin grupo asignado</div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>
                    {sinGrupo.length} alumno{sinGrupo.length !== 1 ? 's' : ''} pendiente{sinGrupo.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <FontAwesomeIcon
                icon={gruposAbiertos.includes(0) ? faChevronUp : faChevronDown}
                style={{ color: 'white', fontSize: '1.2rem' }}
              />
            </div>

            {gruposAbiertos.includes(0) && (
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

      {/* Resumen */}
      <div style={{
        marginTop: '30px',
        padding: '20px',
        background: 'var(--white)',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)'
      }}>
        <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Resumen</h3>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {grupos.map(grupo => (
            <div key={grupo.id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: grupo.color }} />
              <span>{grupo.nombre}: <strong>{getUsuariosPorGrupo(grupo.id).length}</strong></span>
            </div>
          ))}
          {sinGrupo.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#6b7280' }} />
              <span>Sin grupo: <strong>{sinGrupo.length}</strong></span>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Grupo */}
      {modalGrupoOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editingGrupo ? 'Editar Grupo' : 'Nuevo Grupo'}</h2>
              <button onClick={() => setModalGrupoOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre del grupo *</label>
                <input
                  type="text"
                  value={grupoForm.nombre}
                  onChange={(e) => setGrupoForm({ ...grupoForm, nombre: e.target.value })}
                  placeholder="Ej: Lunes y Miércoles"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Días *</label>
                <input
                  type="text"
                  value={grupoForm.dias}
                  onChange={(e) => setGrupoForm({ ...grupoForm, dias: e.target.value })}
                  placeholder="Ej: Lunes y Miércoles"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Turno</label>
                  <select
                    value={grupoForm.turno}
                    onChange={(e) => setGrupoForm({ ...grupoForm, turno: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                  >
                    <option value="">Sin especificar</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Horario</label>
                  <input
                    type="text"
                    value={grupoForm.horario}
                    onChange={(e) => setGrupoForm({ ...grupoForm, horario: e.target.value })}
                    placeholder="Ej: 9:00 a 12:00"
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Color</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {coloresDisponibles.map(color => (
                    <button
                      key={color}
                      onClick={() => setGrupoForm({ ...grupoForm, color })}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        background: color,
                        border: grupoForm.color === color ? '3px solid #000' : '3px solid transparent',
                        cursor: 'pointer'
                      }}
                    />
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => setModalGrupoOpen(false)}
                  style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveGrupo}
                  disabled={savingGrupo}
                  style={{
                    padding: '10px 20px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: savingGrupo ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: savingGrupo ? 0.7 : 1
                  }}
                >
                  <FontAwesomeIcon icon={faSave} />
                  {savingGrupo ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Edición de Horario */}
      {modalHorarioOpen && horarioEditData && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '450px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>Editar Horario</h2>
              <button onClick={() => { setModalHorarioOpen(false); setHorarioEditData(null) }} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px', padding: '12px', background: '#f0f9ff', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
                <strong>{horarioEditData.usuarios.length}</strong> alumno{horarioEditData.usuarios.length !== 1 ? 's' : ''} serán actualizados
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Turno</label>
                  <select
                    value={horarioEditData.newTurno}
                    onChange={(e) => setHorarioEditData({ ...horarioEditData, newTurno: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                  >
                    <option value="">Sin especificar</option>
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Horario</label>
                  <input
                    type="text"
                    value={horarioEditData.newHorario}
                    onChange={(e) => setHorarioEditData({ ...horarioEditData, newHorario: e.target.value })}
                    placeholder="Ej: 9:00 a 12:00"
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button
                  onClick={() => { setModalHorarioOpen(false); setHorarioEditData(null) }}
                  style={{ padding: '12px 24px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSaveHorario}
                  disabled={savingHorario}
                  style={{
                    padding: '12px 24px',
                    background: 'var(--primary)',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius)',
                    cursor: savingHorario ? 'wait' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    opacity: savingHorario ? 0.7 : 1
                  }}
                >
                  <FontAwesomeIcon icon={faSave} />
                  {savingHorario ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
