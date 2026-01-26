'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faEdit, faTrash, faSave, faTimes, faSearch, faUser, faUserShield
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
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filtroRol, setFiltroRol] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Usuario | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '',
    celular: '',
    email: '',
    edad: '',
    fecha_cumpleanos: '',
    password: '',
    rol: 'alumno',
    activo: true
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

  useEffect(() => {
    fetchUsuarios()
  }, [filtroRol])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchUsuarios()
  }

  const openCreate = () => {
    setEditing(null)
    setFormData({
      nombre: '', celular: '', email: '', edad: '', fecha_cumpleanos: '',
      password: '', rol: 'alumno', activo: true
    })
    setModalOpen(true)
  }

  const openEdit = (u: Usuario) => {
    setEditing(u)
    setFormData({
      nombre: u.nombre,
      celular: u.celular,
      email: u.email || '',
      edad: u.edad?.toString() || '',
      fecha_cumpleanos: u.fecha_cumpleanos?.split('T')[0] || '',
      password: '',
      rol: u.rol,
      activo: u.activo
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre.trim() || !formData.celular.trim()) {
      alert('Nombre y celular son requeridos')
      return
    }

    setSaving(true)
    try {
      const payload: Record<string, unknown> = {
        nombre: formData.nombre,
        celular: formData.celular,
        email: formData.email || null,
        edad: formData.edad ? parseInt(formData.edad) : null,
        fecha_cumpleanos: formData.fecha_cumpleanos || null,
        rol: formData.rol,
        activo: formData.activo
      }

      if (formData.password) {
        payload.password = formData.password
      }

      const url = editing ? `/api/admin/usuarios/${editing.id}` : '/api/admin/usuarios'
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
        const error = await res.json()
        alert(error.error || 'Error al guardar')
      }
    } catch {
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (u: Usuario) => {
    if (!confirm(`¿Eliminar a "${u.nombre}"?`)) return

    try {
      const res = await fetch(`/api/admin/usuarios/${u.id}`, {
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
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
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
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Nombre</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Celular</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Email</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Rol</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Activo</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : usuarios.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No se encontraron usuarios</td></tr>
              ) : usuarios.map(u => (
                <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}><strong>{u.nombre}</strong></td>
                  <td style={{ padding: '12px 15px' }}>{u.celular}</td>
                  <td style={{ padding: '12px 15px', color: u.email ? 'inherit' : 'var(--gray)' }}>{u.email || '-'}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: 500,
                      background: u.rol === 'admin' ? '#ede9fe' : '#dbeafe',
                      color: u.rol === 'admin' ? '#7c3aed' : '#2563eb'
                    }}>
                      {u.rol}
                    </span>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      background: u.activo ? '#16a34a' : '#dc2626',
                      display: 'inline-block'
                    }} />
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => openEdit(u)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }} title="Editar">
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
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Celular *</label>
                <input type="tel" value={formData.celular} onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Email</label>
                <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
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

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                  {editing ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
                </label>
                <input type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editing ? 'Dejar vacío para mantener actual' : 'Si no se especifica, será el celular'}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Rol</label>
                  <select value={formData.rol} onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="alumno">Alumno</option>
                    <option value="admin">Administrador</option>
                  </select>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '25px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                    Usuario activo
                  </label>
                </div>
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
