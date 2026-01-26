'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

interface Horario {
  id: number
  nombre: string
  dias: string
  hora_inicio: string | null
  hora_fin: string | null
  activo: boolean
}

export default function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Horario | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    nombre: '', dias: '', hora_inicio: '', hora_fin: '', activo: true
  })

  const fetchHorarios = async () => {
    try {
      const res = await fetch('/api/admin/horarios', { credentials: 'include' })
      if (res.ok) setHorarios(await res.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchHorarios() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormData({ nombre: '', dias: '', hora_inicio: '', hora_fin: '', activo: true })
    setModalOpen(true)
  }

  const openEdit = (h: Horario) => {
    setEditing(h)
    setFormData({
      nombre: h.nombre, dias: h.dias || '',
      hora_inicio: h.hora_inicio || '', hora_fin: h.hora_fin || '', activo: h.activo
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.nombre.trim()) { alert('El nombre es requerido'); return }
    setSaving(true)
    try {
      const payload = { ...formData, hora_inicio: formData.hora_inicio || null, hora_fin: formData.hora_fin || null }
      const url = editing ? `/api/admin/horarios/${editing.id}` : '/api/admin/horarios'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload)
      })
      if (res.ok) { setModalOpen(false); fetchHorarios() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleDelete = async (h: Horario) => {
    if (!confirm(`¿Eliminar el horario "${h.nombre}"?`)) return
    try {
      const res = await fetch(`/api/admin/horarios/${h.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchHorarios()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Horarios</h1>
        <button onClick={openCreate} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Horario
        </button>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Nombre</th>
              <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Días</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Hora Inicio</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Hora Fin</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Activo</th>
              <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
            ) : horarios.length === 0 ? (
              <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay horarios</td></tr>
            ) : horarios.map(h => (
              <tr key={h.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px 15px' }}><strong>{h.nombre}</strong></td>
                <td style={{ padding: '12px 15px' }}>{h.dias || <span style={{ color: 'var(--gray)' }}>-</span>}</td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>{h.hora_inicio || '-'}</td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>{h.hora_fin || '-'}</td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                  <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: h.activo ? '#16a34a' : '#dc2626', display: 'inline-block' }} />
                </td>
                <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                  <button onClick={() => openEdit(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button onClick={() => handleDelete(h)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
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
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Horario' : 'Nuevo Horario'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Nombre *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Lunes y Miércoles"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Días</label>
                <input type="text" value={formData.dias} onChange={(e) => setFormData({ ...formData, dias: e.target.value })}
                  placeholder="Ej: Lunes, Miércoles"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Hora Inicio</label>
                  <input type="time" value={formData.hora_inicio} onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Hora Fin</label>
                  <input type="time" value={formData.hora_fin} onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                    style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                  Horario activo
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
