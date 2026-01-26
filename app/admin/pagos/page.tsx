'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes } from '@fortawesome/free-solid-svg-icons'

interface Pago {
  id: number
  inscripcion_id: number
  usuario_id: number
  monto: number
  metodo_pago: string
  comprobante: string | null
  notas: string | null
  fecha_pago: string
  registrado_por: number
  usuario_nombre: string
  usuario_celular: string
  registrado_por_nombre: string
}

interface Inscripcion {
  id: number
  usuario_id: number
  usuario_nombre: string
  usuario_celular: string
  curso_nombre_ref: string
  nombre_curso_especifico: string | null
  saldo_pendiente: number
}

export default function PagosPage() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pago | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    inscripcion_id: '', monto: '', metodo_pago: 'efectivo', comprobante: '', notas: '', fecha_pago: ''
  })

  const fetchData = async () => {
    try {
      const [pagosRes, inscRes] = await Promise.all([
        fetch('/api/admin/pagos', { credentials: 'include' }),
        fetch('/api/admin/inscripciones?estado=activo', { credentials: 'include' })
      ])
      if (pagosRes.ok) setPagos(await pagosRes.json())
      if (inscRes.ok) setInscripciones(await inscRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => {
    setEditing(null)
    setFormData({
      inscripcion_id: '', monto: '', metodo_pago: 'efectivo', comprobante: '', notas: '',
      fecha_pago: new Date().toISOString().split('T')[0]
    })
    setModalOpen(true)
  }

  const openEdit = (p: Pago) => {
    setEditing(p)
    setFormData({
      inscripcion_id: p.inscripcion_id.toString(), monto: p.monto.toString(),
      metodo_pago: p.metodo_pago, comprobante: p.comprobante || '', notas: p.notas || '',
      fecha_pago: p.fecha_pago.split('T')[0]
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.inscripcion_id || !formData.monto) { alert('Inscripción y monto son requeridos'); return }
    setSaving(true)
    try {
      const insc = inscripciones.find(i => i.id.toString() === formData.inscripcion_id)
      const payload = {
        inscripcion_id: parseInt(formData.inscripcion_id),
        usuario_id: insc?.usuario_id,
        monto: parseFloat(formData.monto),
        metodo_pago: formData.metodo_pago,
        comprobante: formData.comprobante || null,
        notas: formData.notas || null,
        fecha_pago: formData.fecha_pago
      }
      const url = editing ? `/api/admin/pagos/${editing.id}` : '/api/admin/pagos'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload)
      })
      if (res.ok) { setModalOpen(false); fetchData() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleDelete = async (p: Pago) => {
    if (!confirm(`¿Eliminar el pago de $${p.monto} de ${p.usuario_nombre}? Esto revertirá el saldo.`)) return
    try {
      const res = await fetch(`/api/admin/pagos/${p.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchData()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0)

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Pagos</h1>
        <button onClick={openCreate} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Registrar Pago
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--white)', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: 'var(--gray)' }}>Total registros: </span><strong>{pagos.length}</strong>
        </div>
        <div style={{ background: '#dcfce7', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: '#16a34a' }}>Total recaudado: </span><strong style={{ color: '#16a34a' }}>${totalPagos.toLocaleString()}</strong>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Fecha</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Alumno</th>
                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Monto</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Método</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Registrado por</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : pagos.length === 0 ? (
                <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay pagos registrados</td></tr>
              ) : pagos.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}>{new Date(p.fecha_pago).toLocaleDateString('es-MX')}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <strong>{p.usuario_nombre}</strong>
                    <br /><span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{p.usuario_celular}</span>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', fontWeight: 700, color: '#16a34a' }}>${p.monto.toLocaleString()}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', background: '#f3f4f6' }}>{p.metodo_pago}</span>
                  </td>
                  <td style={{ padding: '12px 15px', fontSize: '0.9rem' }}>{p.registrado_por_nombre}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => openEdit(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(p)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
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
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Pago' : 'Registrar Pago'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Inscripción *</label>
                <select value={formData.inscripcion_id} onChange={(e) => setFormData({ ...formData, inscripcion_id: e.target.value })}
                  disabled={!!editing}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: editing ? '#f5f5f5' : 'white' }}>
                  <option value="">Seleccionar inscripción...</option>
                  {inscripciones.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.usuario_nombre} - {i.nombre_curso_especifico || i.curso_nombre_ref} (Saldo: ${i.saldo_pendiente})
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Monto ($) *</label>
                  <input type="number" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha</label>
                  <input type="date" value={formData.fecha_pago} onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Método de Pago</label>
                <select value={formData.metodo_pago} onChange={(e) => setFormData({ ...formData, metodo_pago: e.target.value })}
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                  <option value="efectivo">Efectivo</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="otro">Otro</option>
                </select>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Comprobante</label>
                <input type="text" value={formData.comprobante} onChange={(e) => setFormData({ ...formData, comprobante: e.target.value })}
                  placeholder="# de referencia o comprobante"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Notas</label>
                <textarea value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} rows={2}
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
