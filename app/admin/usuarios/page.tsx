'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faEdit, faTrash, faSave, faTimes, faSearch, faUser, faUserShield, faEye, faEyeSlash
} from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  celular: string
  email: string | null
  edad: number | null
  fecha_cumpleanos: string | null
  rol: string
  activo: boolean
  created_at: string
  genero: string | null
  tipo_curso: string | null
  turno: string | null
  dia: string | null
  estado_pago: string | null
  estado: string | null
  lunes: boolean
  martes: boolean
  miercoles: boolean
  jueves: boolean
  sabado: boolean
  horario: string | null
  grupo_id: number | null
  grupo_nombre: string | null
  grupo_color: string | null
}

interface Grupo {
  id: number
  nombre: string
  dias: string
  turno: string | null
  horario: string | null
  color: string
  activo: boolean
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [grupos, setGrupos] = useState<Grupo[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [saving, setSaving] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
    edad: '',
    fecha_cumpleanos: '',
    password: '',
    rol: 'alumno',
    activo: true,
    genero: '',
    tipo_curso: '',
    turno: '',
    dia: '',
    estado_pago: '',
    estado: '',
    lunes: false,
    martes: false,
    miercoles: false,
    jueves: false,
    sabado: false,
    horario: '',
    grupo_id: ''
  })

  const fetchUsuarios = async () => {
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filtroRol) params.append('rol', filtroRol)

      const res = await fetch(`/api/admin/usuarios?${params}`, { credentials: 'include' })
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

  const fetchGrupos = async () => {
    try {
      const res = await fetch('/api/admin/grupos', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setGrupos(data)
      }
    } catch (error) {
      console.error('Error al cargar grupos:', error)
    }
  }

  useEffect(() => {
    fetchUsuarios()
    fetchGrupos()
  }, [filtroRol])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsuarios()
  }

  // Obtener horarios únicos del grupo seleccionado
  const getHorariosDelGrupo = (grupoId: string) => {
    if (!grupoId) return []
    const usuariosDelGrupo = usuarios.filter(u => u.grupo_id === parseInt(grupoId))
    const horariosUnicos = new Map<string, { turno: string, horario: string }>()

    usuariosDelGrupo.forEach(u => {
      if (u.turno && u.horario) {
        const key = `${u.turno}-${u.horario}`
        if (!horariosUnicos.has(key)) {
          horariosUnicos.set(key, { turno: u.turno, horario: u.horario })
        }
      }
    })

    return Array.from(horariosUnicos.values()).sort((a, b) => {
      if (a.turno === 'Matutino' && b.turno !== 'Matutino') return -1
      if (a.turno !== 'Matutino' && b.turno === 'Matutino') return 1
      return a.horario.localeCompare(b.horario)
    })
  }

  const horariosDisponibles = getHorariosDelGrupo(formData.grupo_id)

  const openCreate = () => {
    setEditing(null)
    setShowPassword(false)
    setFormData({
      nombre: '', celular: '', email: '', edad: '', fecha_cumpleanos: '',
      password: '', rol: 'alumno', activo: true,
      genero: '', tipo_curso: '', turno: '', dia: '',
      estado_pago: '', estado: '', lunes: false, martes: false, miercoles: false,
      jueves: false, sabado: false, horario: '', grupo_id: ''
    })
    setModalOpen(true)
  }

  const openEdit = (u: Usuario) => {
    setEditing(u)
    setShowPassword(false)
    setFormData({
      nombre: u.nombre,
      celular: u.celular,
      email: u.email || '',
      edad: u.edad?.toString() || '',
      fecha_cumpleanos: u.fecha_cumpleanos?.split('T')[0] || '',
      password: '',
      rol: u.rol,
      activo: u.activo,
      genero: u.genero || '',
      tipo_curso: u.tipo_curso || '',
      turno: u.turno || '',
      dia: u.dia || '',
            estado_pago: u.estado_pago || '',
      estado: u.estado || '',
      lunes: u.lunes || false,
      martes: u.martes || false,
      miercoles: u.miercoles || false,
      jueves: u.jueves || false,
      sabado: u.sabado || false,
      horario: u.horario || '',
      grupo_id: u.grupo_id?.toString() || ''
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.celular.trim()) {
      alert('Nombre y celular son requeridos')
      return
    }

    // Validar campos numéricos
    if (formData.edad && parseInt(formData.edad) > 150) {
      alert('La edad no parece ser válida')
      return
    }

    setSaving(true)
    try {
      // Funciones helper para limpiar datos
      const cleanInt = (val: string) => {
        if (!val || val.trim() === '') return null
        const num = parseInt(val)
        return isNaN(num) ? null : num
      }

      const cleanFloat = (val: string) => {
        if (!val || val.trim() === '') return null
        const num = parseFloat(val)
        return isNaN(num) ? null : num
      }

      const cleanString = (val: string) => {
        if (!val || val.trim() === '') return null
        return val.trim()
      }

      const payload: Record<string, unknown> = {
        nombre: formData.nombre.trim(),
        celular: formData.celular.trim(),
        email: cleanString(formData.email),
        edad: cleanInt(formData.edad),
        fecha_cumpleanos: cleanString(formData.fecha_cumpleanos),
        rol: formData.rol,
        activo: formData.activo,
        genero: cleanString(formData.genero),
        tipo_curso: cleanString(formData.tipo_curso),
        turno: cleanString(formData.turno),
        dia: cleanString(formData.dia),
                estado_pago: cleanString(formData.estado_pago),
        estado: cleanString(formData.estado),
        lunes: formData.lunes,
        martes: formData.martes,
        miercoles: formData.miercoles,
        jueves: formData.jueves,
        sabado: formData.sabado,
        horario: cleanString(formData.horario),
        grupo_id: cleanInt(formData.grupo_id)
      }

      if (formData.password) {
        payload.password = formData.password
      }

      console.log('Enviando payload:', payload)

      const url = editing ? `/api/admin/usuarios?id=${editing.id}` : '/api/admin/usuarios'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        setModalOpen(false)
        fetchUsuarios()
      } else {
        const errorData = await res.json()
        console.error('Error del servidor:', errorData)
        alert(`Error: ${errorData.error || 'Error desconocido'}`)
      }
    } catch (err) {
      console.error('Error completo:', err)
      alert('Error de conexión al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u: Usuario) => {
    if (!confirm(`¿Eliminar a "${u.nombre}"?`)) return

    try {
      const res = await fetch(`/api/admin/usuarios?id=${u.id}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      if (res.ok) fetchUsuarios()
      else alert('Error al eliminar')
    } catch {
      alert('Error al eliminar')
    }
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Usuarios</h1>
        <button onClick={openCreate} style={{
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
          <FontAwesomeIcon icon={faPlus} /> Nuevo Usuario
        </button>
      </div>

      {/* Filters */}
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
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)' }}
        >
          <option value="">Todos los roles</option>
          <option value="alumno">Alumnos</option>
          <option value="admin">Administradores</option>
        </select>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: 'var(--gray)' }}>Total: </span><strong>{usuarios.length}</strong>
        </div>
        <div style={{ background: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <FontAwesomeIcon icon={faUser} style={{ marginRight: '8px', color: '#3b82f6' }} />
          <span style={{ color: 'var(--gray)' }}>Alumnos: </span>
          <strong>{usuarios.filter(u => u.rol === 'alumno').length}</strong>
        </div>
        <div style={{ background: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <FontAwesomeIcon icon={faUserShield} style={{ marginRight: '8px', color: '#8b5cf6' }} />
          <span style={{ color: 'var(--gray)' }}>Admins: </span>
          <strong>{usuarios.filter(u => u.rol === 'admin').length}</strong>
        </div>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Nombre</th>
                <th style={{ padding: '12px 10px', textAlign: 'left', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Celular</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Edad</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Género</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Grupo</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Turno</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Estado Pago</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Estado</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Activo</th>
                <th style={{ padding: '12px 10px', textAlign: 'center', borderBottom: '2px solid #eee', whiteSpace: 'nowrap' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={10} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No se encontraron usuarios</td></tr>
              ) : usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}><strong>{u.nombre}</strong></td>
                  <td style={{ padding: '10px', whiteSpace: 'nowrap' }}>{u.celular}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{u.edad || '-'}</td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>{u.genero || '-'}</td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    {u.grupo_nombre ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        background: u.grupo_color || '#3b82f6',
                        color: 'white'
                      }}>
                        {u.grupo_nombre}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {u.turno ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        background: u.turno === 'Matutino' ? '#dbeafe' : '#fef3c7',
                        color: u.turno === 'Matutino' ? '#1e40af' : '#92400e'
                      }}>
                        {u.turno === 'Matutino' ? 'A' : u.turno === 'Vespertino' ? 'B' : u.turno}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {u.estado_pago ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        background: u.estado_pago.toLowerCase().includes('pendiente') ? '#fef3c7' : '#d1fae5',
                        color: u.estado_pago.toLowerCase().includes('pendiente') ? '#92400e' : '#065f46'
                      }}>
                        {u.estado_pago}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    {u.estado ? (
                      <span style={{
                        padding: '3px 8px',
                        borderRadius: '10px',
                        fontSize: '0.75rem',
                        background: u.estado.toLowerCase().includes('confirmado') ? '#d1fae5' : '#fef3c7',
                        color: u.estado.toLowerCase().includes('confirmado') ? '#065f46' : '#92400e'
                      }}>
                        {u.estado}
                      </span>
                    ) : '-'}
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center' }}>
                    <span style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: u.activo ? '#16a34a' : '#dc2626',
                      display: 'inline-block'
                    }} />
                  </td>
                  <td style={{ padding: '10px', textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '8px', padding: '5px' }} title="Editar">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }} title="Eliminar">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              {/* Datos básicos */}
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Datos Básicos</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Celular *</label>
                  <input type="tel" value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Email</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Género</label>
                  <select value={formData.genero} onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar</option>
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Edad</label>
                  <input type="number" value={formData.edad} onChange={(e) => setFormData({ ...formData, edad: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Cumpleaños</label>
                  <input type="date" value={formData.fecha_cumpleanos} onChange={(e) => setFormData({ ...formData, fecha_cumpleanos: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>

              {/* Curso y horarios */}
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Curso y Horarios</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Grupo</label>
                <select value={formData.grupo_id} onChange={(e) => setFormData({ ...formData, grupo_id: e.target.value, turno: '', horario: '' })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                  <option value="">Sin grupo asignado</option>
                  {grupos.filter(g => g.activo).map(g => (
                    <option key={g.id} value={g.id}>{g.nombre}</option>
                  ))}
                </select>
              </div>

              {formData.grupo_id && horariosDisponibles.length > 0 ? (
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Turno y Horario</label>
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {horariosDisponibles.map((h, idx) => {
                      const isSelected = formData.turno === h.turno && formData.horario === h.horario
                      const isMatutino = h.turno === 'Matutino'
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFormData({ ...formData, turno: h.turno, horario: h.horario })}
                          style={{
                            flex: '1 1 calc(50% - 5px)',
                            minWidth: '200px',
                            padding: '12px',
                            borderRadius: 'var(--radius)',
                            cursor: 'pointer',
                            border: isSelected ? '2px solid var(--primary)' : '1px solid #ddd',
                            background: isSelected ? 'var(--primary)' : (isMatutino ? '#fef3c7' : '#e0e7ff'),
                            color: isSelected ? 'white' : (isMatutino ? '#92400e' : '#3730a3'),
                            fontWeight: 600,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <span>{isMatutino ? 'A (Matutino)' : 'B (Vespertino)'}</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{h.horario}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Turno</label>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button type="button" onClick={() => setFormData({ ...formData, turno: 'Matutino' })}
                        style={{
                          flex: 1, padding: '12px', borderRadius: 'var(--radius)', cursor: 'pointer',
                          border: formData.turno === 'Matutino' ? '2px solid var(--primary)' : '1px solid #ddd',
                          background: formData.turno === 'Matutino' ? 'var(--primary)' : 'white',
                          color: formData.turno === 'Matutino' ? 'white' : '#333',
                          fontWeight: 600
                        }}>
                        A (Matutino)
                      </button>
                      <button type="button" onClick={() => setFormData({ ...formData, turno: 'Vespertino' })}
                        style={{
                          flex: 1, padding: '12px', borderRadius: 'var(--radius)', cursor: 'pointer',
                          border: formData.turno === 'Vespertino' ? '2px solid var(--primary)' : '1px solid #ddd',
                          background: formData.turno === 'Vespertino' ? 'var(--primary)' : 'white',
                          color: formData.turno === 'Vespertino' ? 'white' : '#333',
                          fontWeight: 600
                        }}>
                        B (Vespertino)
                      </button>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Horario</label>
                    <input type="text" value={formData.horario} onChange={(e) => setFormData({ ...formData, horario: e.target.value })}
                      placeholder="Ej: 10:00 a 11:30"
                      style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                  </div>
                </div>
              )}

              {/* Estado */}
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Estado</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Estado de Pago</label>
                  <select value={formData.estado_pago} onChange={(e) => setFormData({ ...formData, estado_pago: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar</option>
                    <option value="Pendiente de pago">Pendiente de pago</option>
                    <option value="Pagado">Pagado</option>
                    <option value="Parcial">Parcial</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar</option>
                    <option value="Confirmado">Confirmado</option>
                    <option value="Pendiente Horario">Pendiente Horario</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Sistema */}
              <h3 style={{ margin: '0 0 15px 0', fontSize: '1rem', color: 'var(--gray)' }}>Sistema</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                    {editing ? 'Nueva Contraseña' : 'Contraseña'}
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input type={showPassword ? 'text' : 'password'} value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder={editing ? 'Dejar vacío para mantener actual' : 'Si no se especifica, será el celular'}
                      style={{ width: '100%', padding: '10px', paddingRight: '45px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#666',
                        padding: '5px'
                      }}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    >
                      <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                    </button>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Rol</label>
                  <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="alumno">Alumno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                  Usuario activo
                </label>
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
                  borderRadius: 'var(--radius)', cursor: saving ? 'wait' : 'pointer',
                  display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1
                }}>
                  <FontAwesomeIcon icon={faSave} />
                  {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
