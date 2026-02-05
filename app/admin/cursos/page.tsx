'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

interface Curso {
  id: number
  nombre: string
  descripcion: string
  costo: number
  duracion_semanas: number
  activo: boolean
  created_at: string
}

export default function CursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Curso | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '', descripcion: '', costo: '1900', duracion_semanas: '4', activo: true
  })

  const fetchCursos = async () => {
    try {
      const res = await fetch('/api/admin/cursos', { credentials: 'include' })
      if (res.ok) setCursos(await res.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCursos() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormData({ nombre: '', descripcion: '', costo: '1900', duracion_semanas: '4', activo: true })
    setModalOpen(true)
  }

  const openEdit = (c: Curso) => {
    setEditing(c)
    setFormData({
      nombre: c.nombre, descripcion: c.descripcion || '',
      costo: c.costo.toString(), duracion_semanas: c.duracion_semanas.toString(), activo: c.activo
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre.trim()) { alert('El nombre es requerido'); return }
    setSaving(true)
    try {
      const payload = {
        nombre: formData.nombre, descripcion: formData.descripcion,
        costo: parseFloat(formData.costo) || 1900,
        duracion_semanas: parseInt(formData.duracion_semanas) || 4, activo: formData.activo
      }
      const url = editing ? `/api/admin/cursos?id=${editing.id}` : '/api/admin/cursos'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload)
      })
      if (res.ok) { setModalOpen(false); fetchCursos() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleDelete = async (c: Curso) => {
    if (!confirm(`¿Eliminar el curso "${c.nombre}"?`)) return
    try {
      const res = await fetch(`/api/admin/cursos?id=${c.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchCursos()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Cursos</h1>
        <button onClick={openCreate} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Curso
        </button>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Nombre</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Descripción</th>
              <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Costo</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Duración</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Activo</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
            ) : cursos.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay cursos</td></tr>
            ) : cursos.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}><strong>{c.nombre}</strong></td>
                <td style={{ padding: '12px 15px', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.descripcion || <span style={{ color: 'var(--gray)' }}>-</span>}
                </td>
                <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 600 }}>${c.costo.toLocaleString()}</td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>{c.duracion_semanas} semanas</td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: c.activo ? '#16a34a' : '#dc2626', display: 'inline-block' }} />
                </td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                  <button onClick={() => openEdit(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(c)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Curso' : 'Nuevo Curso'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={3}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Costo ($)</label>
                  <input type="number" value={formData.costo} onChange={(e) => setFormData({ ...formData, costo: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Duración (semanas)</label>
                  <input type="number" value={formData.duracion_semanas} onChange={(e) => setFormData({ ...formData, duracion_semanas: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                  Curso activo
                </label>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving} style={{ padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: 'var(--radius)', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1 }}>
                  <FontAwesomeIcon icon={faSave} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
