'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faUserPlus, faSearch, faCalendarCheck, faUserGraduate, faTrash } from '@fortawesome/free-solid-svg-icons'

interface RegistroClase {
  id: number
  nombre: string
  celular: string
  email: string | null
  edad: number | null
  fecha_cumpleanos: string | null
  genero: string | null
  horario_elegido: string
  estado: string
  created_at: string
}

export default function ClaseMuestraPage() {
  const [registros, setRegistros] = useState<RegistroClase[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('')
  const [procesandoId, setProcesandoId] = useState<number | null>(null)

  const fetchRegistros = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filtroEstado) params.append('estado', filtroEstado)

      const res = await fetch(`/api/admin/clase-muestra?${params}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setRegistros(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistros()
  }, [filtroEstado])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchRegistros()
  }

  const actualizarEstado = async (id: number, nuevoEstado: string) => {
    if (!confirm(`¿Marcar este registro como "${nuevoEstado}"?`)) return

    setProcesandoId(id)
    try {
      const res = await fetch(`/api/admin/clase-muestra/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado }),
        credentials: 'include'
      })

      if (res.ok) {
        fetchRegistros()
      } else {
        const data = await res.json()
        alert(`Error: ${data.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al actualizar estado')
    } finally {
      setProcesandoId(null)
    }
  }

  const handleInscribir = async (r: RegistroClase) => {
    if (!confirm(`¿Inscribir a "${r.nombre}" oficialmente?\nEsto creará un nuevo estudiante con contraseña igual a su celular.`)) return

    setProcesandoId(r.id)
    try {
      const res = await fetch(`/api/admin/clase-muestra/${r.id}/inscribir`, {
        method: 'POST',
        credentials: 'include'
      })

      const data = await res.json()
      
      if (res.ok) {
        alert('¡Inscripción exitosa! El usuario ya puede ingresar y ser asignado a un grupo en la pestaña de Usuarios.')
        fetchRegistros()
      } else {
        alert(`Error: ${data.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al inscribir')
    } finally {
      setProcesandoId(null)
    }
  }

  const handleEliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este registro?\nEsta acción no se puede deshacer.')) return

    setProcesandoId(id)
    try {
      const res = await fetch(`/api/admin/clase-muestra/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (res.ok) {
        fetchRegistros()
      } else {
        const data = await res.json()
        alert(`Error al eliminar: ${data.error}`)
      }
    } catch (err) {
      console.error(err)
      alert('Error de conexión al eliminar registro')
    } finally {
      setProcesandoId(null)
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>
          <FontAwesomeIcon icon={faCalendarCheck} style={{ marginRight: '10px', color: 'var(--primary)' }} />
          Registros Clase Muestra
        </h1>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '10px', flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre, celular o email..."
            style={{ flex: 1, padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
          />
          <button type="submit" style={{
            padding: '10px 15px',
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            borderRadius: 'var(--radius)',
            cursor: 'pointer'
          }}>
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </form>
        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)' }}
        >
          <option value="">Todos los estados</option>
          <option value="pendiente">Pendiente</option>
          <option value="asistio">Asistió</option>
          <option value="no_asistio">No Asistió</option>
          <option value="inscrito">Inscrito Oficial</option>
        </select>
      </div>

      {/* Tabla */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Fecha Registro</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Nombre</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Contacto</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Horario Elegido</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Estado</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando registros...</td></tr>
              ) : registros.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No se encontraron registros de clase muestra</td></tr>
              ) : registros.map(r => (
                <tr key={r.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>
                    {new Date(r.created_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '10px' }}><strong>{r.nombre}</strong></td>
                  <td style={{ padding: '10px' }}>
                    {r.celular}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '3px 8px', borderRadius: '10px', fontSize: '0.8rem',
                      background: '#e0e7ff', color: '#3730a3', fontWeight: 600
                    }}>
                      {r.horario_elegido}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: r.estado === 'inscrito' ? '#d1fae5' : 
                                  r.estado === 'asistio' ? '#dbeafe' : 
                                  r.estado === 'no_asistio' ? '#fee2e2' : '#fef3c7',
                      color: r.estado === 'inscrito' ? '#065f46' : 
                             r.estado === 'asistio' ? '#1e40af' : 
                             r.estado === 'no_asistio' ? '#991b1b' : '#92400e',
                    }}>
                      {r.estado.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {procesandoId === r.id ? (
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Procesando...</span>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        {r.estado === 'pendiente' && (
                          <>
                            <button onClick={() => actualizarEstado(r.id, 'asistio')} style={{ 
                              background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', 
                              padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' 
                            }} title="Marcar como asistió">
                              <FontAwesomeIcon icon={faCheck} /> Asistió
                            </button>
                            <button onClick={() => actualizarEstado(r.id, 'no_asistio')} style={{ 
                              background: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', 
                              padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' 
                            }} title="No asistió">
                              <FontAwesomeIcon icon={faTimes} /> No llegó
                            </button>
                          </>
                        )}
                        
                        {(r.estado === 'asistio' || r.estado === 'pendiente') && (
                          <button onClick={() => handleInscribir(r)} style={{ 
                            background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', 
                            padding: '5px 10px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600
                          }} title="Inscribir oficialmente a la escuela">
                            <FontAwesomeIcon icon={faUserPlus} /> Inscribir
                          </button>
                        )}

                        {r.estado === 'inscrito' && (
                          <span style={{ color: '#059669', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <FontAwesomeIcon icon={faUserGraduate} /> ¡Inscrito!
                          </span>
                        )}

                        <button onClick={() => handleEliminar(r.id)} style={{ 
                          background: '#fef2f2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '4px', 
                          padding: '5px 8px', cursor: 'pointer', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px',
                          marginLeft: 'auto'
                        }} title="Eliminar registro">
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
