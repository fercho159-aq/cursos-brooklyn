'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

interface Gasto {
  id: number
  tipo: string
  descripcion: string
  monto: number
  fecha: string
  registrado_por: number
  registrado_por_nombre: string
  created_at: string
}

const TIPOS_GASTO = ['Renta', 'Servicios', 'Materiales', 'Sueldos', 'Marketing', 'Mantenimiento', 'Otro']

export default function GastosPage() {
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Gasto | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    tipo: 'Otro', descripcion: '', monto: '', fecha: ''
  })

  const fetchGastos = async () => {
    try {
      const params = filtroTipo ? `?tipo=${filtroTipo}` : ''
      const res = await fetch(`/api/admin/gastos${params}`, { credentials: 'include' })
      if (res.ok) setGastos(await res.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchGastos() }, [filtroTipo])

  const openCreate = () => {
    setEditing(null)
    setFormData({ tipo: 'Otro', descripcion: '', monto: '', fecha: new Date().toISOString().split('T')[0] })
    setModalOpen(true)
  }

  const openEdit = (g: Gasto) => {
    setEditing(g)
    setFormData({
      tipo: g.tipo, descripcion: g.descripcion || '',
      monto: g.monto.toString(), fecha: g.fecha.split('T')[0]
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.tipo || !formData.monto) { alert('Tipo y monto son requeridos'); return }
    setSaving(true)
    try {
      const payload = {
        tipo: formData.tipo, descripcion: formData.descripcion,
        monto: parseFloat(formData.monto), fecha: formData.fecha
      }
      const url = editing ? `/api/admin/gastos/${editing.id}` : '/api/admin/gastos'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload)
      })
      if (res.ok) { setModalOpen(false); fetchGastos() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleDelete = async (g: Gasto) => {
    if (!confirm(`¿Eliminar el gasto de $${g.monto}?`)) return
    try {
      const res = await fetch(`/api/admin/gastos/${g.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchGastos()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0)

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Gastos</h1>
        <button onClick={openCreate} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Registrar Gasto
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)' }}>
          <option value="">Todos los tipos</option>
          {TIPOS_GASTO.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <div style={{ background: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: 'var(--gray)' }}>Total registros: </span><strong>{gastos.length}</strong>
        </div>
        <div style={{ background: '#fee2e2', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: '#dc2626' }}>Total gastos: </span><strong style={{ color: '#dc2626' }}>${totalGastos.toLocaleString()}</strong>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Fecha</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Tipo</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Descripción</th>
                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Monto</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Registrado por</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : gastos.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay gastos registrados</td></tr>
              ) : gastos.map(g => (
                <tr key={g.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}>{new Date(g.fecha).toLocaleDateString('es-MX')}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', background: '#fef3c7', color: '#92400e' }}>{g.tipo}</span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>{g.descripcion || <span style={{ color: 'var(--gray)' }}>-</span>}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 700, color: '#dc2626' }}>${g.monto.toLocaleString()}</td>
                  <td style={{ padding: '12px 15px', fontSize: '0.9rem' }}>{g.registrado_por_nombre}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => openEdit(g)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(g)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Gasto' : 'Registrar Gasto'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Tipo *</label>
                  <select value={formData.tipo} onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    {TIPOS_GASTO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Monto ($) *</label>
                  <input type="number" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha</label>
                <input type="date" value={formData.fecha} onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={3}
                  placeholder="Detalles del gasto..."
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', resize: 'vertical' }} />
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
