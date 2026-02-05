'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faEdit, faTrash, faSave, faTimes,
  faArrowUp, faArrowDown, faBalanceScale, faFilePdf
} from '@fortawesome/free-solid-svg-icons'

interface Pago {
  id: number
  inscripcion_id: number
  usuario_id: number
  monto: number
  metodo_pago: string
  notas: string | null
  fecha_pago: string
  usuario_nombre: string
  usuario_celular: string
}

interface Gasto {
  id: number
  tipo: string
  descripcion: string
  monto: number
  fecha: string
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

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

const TIPOS_GASTO = ['Renta', 'Servicios', 'Materiales', 'Sueldos', 'Marketing', 'Mantenimiento', 'Aldo', 'Daniel', 'Julio', 'Otro']

export default function FinanzasPage() {
  const [pagos, setPagos] = useState<Pago[]>([])
  const [gastos, setGastos] = useState<Gasto[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)

  const [filtroMes, setFiltroMes] = useState<number | null>(null)
  const [filtroAño, setFiltroAño] = useState(new Date().getFullYear())

  // Modales
  const [modalPago, setModalPago] = useState(false)
  const [modalGasto, setModalGasto] = useState(false)
  const [saving, setSaving] = useState(false)

  const [pagoForm, setPagoForm] = useState({
    inscripcion_id: '', monto: '', metodo_pago: 'efectivo', notas: '', fecha_pago: ''
  })

  const [gastoForm, setGastoForm] = useState({
    tipo: 'Otro', descripcion: '', monto: '', fecha: ''
  })

  const fetchData = async () => {
    setLoading(true)
    try {
      const [pagosRes, gastosRes, inscRes] = await Promise.all([
        fetch('/api/admin/pagos', { credentials: 'include' }),
        fetch('/api/admin/gastos', { credentials: 'include' }),
        fetch('/api/admin/inscripciones?estado=activo', { credentials: 'include' })
      ])
      if (pagosRes.ok) setPagos(await pagosRes.json())
      if (gastosRes.ok) setGastos(await gastosRes.json())
      if (inscRes.ok) setInscripciones(await inscRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  // Filtrar por mes (opcional)
  const pagosFiltrados = filtroMes ? pagos.filter(p => {
    const fecha = new Date(p.fecha_pago)
    return fecha.getUTCMonth() + 1 === filtroMes && fecha.getUTCFullYear() === filtroAño
  }) : pagos

  const gastosFiltrados = filtroMes ? gastos.filter(g => {
    const fecha = new Date(g.fecha)
    return fecha.getUTCMonth() + 1 === filtroMes && fecha.getUTCFullYear() === filtroAño
  }) : gastos

  // Totales
  const totalIngresos = pagosFiltrados.reduce((sum, p) => sum + parseFloat(String(p.monto)), 0)
  const totalEgresos = gastosFiltrados.reduce((sum, g) => sum + parseFloat(String(g.monto)), 0)
  const balance = totalIngresos - totalEgresos

  const años = Array.from(new Set([
    ...pagos.map(p => new Date(p.fecha_pago).getUTCFullYear()),
    ...gastos.map(g => new Date(g.fecha).getUTCFullYear()),
    new Date().getFullYear()
  ])).sort((a, b) => b - a)

  // Handlers de Pago
  const openPago = () => {
    setPagoForm({
      inscripcion_id: '', monto: '', metodo_pago: 'efectivo', notas: '',
      fecha_pago: new Date().toISOString().split('T')[0]
    })
    setModalPago(true)
  }

  const savePago = async () => {
    if (!pagoForm.inscripcion_id || !pagoForm.monto) { alert('Alumno y monto son requeridos'); return }
    setSaving(true)
    try {
      const insc = inscripciones.find(i => i.id.toString() === pagoForm.inscripcion_id)
      const res = await fetch('/api/admin/pagos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          inscripcion_id: parseInt(pagoForm.inscripcion_id),
          usuario_id: insc?.usuario_id,
          monto: parseFloat(pagoForm.monto),
          metodo_pago: pagoForm.metodo_pago,
          notas: pagoForm.notas || null,
          fecha_pago: pagoForm.fecha_pago
        })
      })
      if (res.ok) { setModalPago(false); fetchData() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const deletePago = async (p: Pago) => {
    if (!confirm(`¿Eliminar ingreso de $${parseFloat(String(p.monto)).toLocaleString()}?`)) return
    try {
      const res = await fetch(`/api/admin/pagos?id=${p.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchData()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  // Handlers de Gasto
  const openGasto = () => {
    setGastoForm({
      tipo: 'Otro', descripcion: '', monto: '',
      fecha: new Date().toISOString().split('T')[0]
    })
    setModalGasto(true)
  }

  const saveGasto = async () => {
    if (!gastoForm.tipo || !gastoForm.monto) { alert('Tipo y monto son requeridos'); return }
    setSaving(true)
    try {
      const res = await fetch('/api/admin/gastos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          tipo: gastoForm.tipo,
          descripcion: gastoForm.descripcion,
          monto: parseFloat(gastoForm.monto),
          fecha: gastoForm.fecha
        })
      })
      if (res.ok) { setModalGasto(false); fetchData() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const deleteGasto = async (g: Gasto) => {
    if (!confirm(`¿Eliminar egreso de $${parseFloat(String(g.monto)).toLocaleString()}?`)) return
    try {
      const res = await fetch(`/api/admin/gastos?id=${g.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchData()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const selectedInsc = inscripciones.find(i => i.id.toString() === pagoForm.inscripcion_id)

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FontAwesomeIcon icon={faBalanceScale} style={{ color: 'var(--primary)' }} />
          Finanzas
        </h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={openPago} style={{
            padding: '15px 30px', background: '#16a34a', color: 'white', border: 'none',
            borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1.1rem'
          }}>
            <FontAwesomeIcon icon={faArrowUp} size="lg" /> Ingreso
          </button>
          <button onClick={openGasto} style={{
            padding: '15px 30px', background: '#dc2626', color: 'white', border: 'none',
            borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 700, fontSize: '1.1rem'
          }}>
            <FontAwesomeIcon icon={faArrowDown} size="lg" /> Egreso
          </button>
        </div>
      </div>

      {/* Filtro por mes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <select
          value={filtroMes ?? ''}
          onChange={(e) => setFiltroMes(e.target.value ? parseInt(e.target.value) : null)}
          style={{
            padding: '10px 15px', background: 'var(--white)', border: '1px solid #ddd',
            borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
          }}
        >
          <option value="">Todos los meses</option>
          {MESES.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>
        {filtroMes && (
          <select
            value={filtroAño}
            onChange={(e) => setFiltroAño(parseInt(e.target.value))}
            style={{
              padding: '10px 15px', background: 'var(--white)', border: '1px solid #ddd',
              borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '1rem', cursor: 'pointer'
            }}
          >
            {años.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        )}
        {filtroMes && (
          <button onClick={() => setFiltroMes(null)} style={{
            padding: '10px 15px', background: '#f5f5f5', border: '1px solid #ddd',
            borderRadius: 'var(--radius)', cursor: 'pointer', fontSize: '0.9rem', color: '#666'
          }}>
            <FontAwesomeIcon icon={faTimes} /> Limpiar filtro
          </button>
        )}
      </div>

      {/* Resumen */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '25px' }}>
        <div style={{ background: '#dcfce7', padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <FontAwesomeIcon icon={faArrowUp} style={{ color: '#16a34a' }} />
            <span style={{ color: '#166534', fontWeight: 500 }}>Ingresos</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#16a34a' }}>
            ${totalIngresos.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#166534' }}>{pagosFiltrados.length} pago{pagosFiltrados.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{ background: '#fee2e2', padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <FontAwesomeIcon icon={faArrowDown} style={{ color: '#dc2626' }} />
            <span style={{ color: '#991b1b', fontWeight: 500 }}>Egresos</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#dc2626' }}>
            ${totalEgresos.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: '#991b1b' }}>{gastosFiltrados.length} gasto{gastosFiltrados.length !== 1 ? 's' : ''}</div>
        </div>
        <div style={{
          background: balance >= 0 ? '#dbeafe' : '#fef3c7',
          padding: '20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
            <FontAwesomeIcon icon={faBalanceScale} style={{ color: balance >= 0 ? '#2563eb' : '#d97706' }} />
            <span style={{ color: balance >= 0 ? '#1e40af' : '#92400e', fontWeight: 500 }}>Balance</span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: balance >= 0 ? '#2563eb' : '#d97706' }}>
            {balance >= 0 ? '+' : '-'}${Math.abs(balance).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.85rem', color: balance >= 0 ? '#1e40af' : '#92400e' }}>
            {balance >= 0 ? 'Ganancia' : 'Pérdida'}
          </div>
        </div>
      </div>

      {/* Tabla T de Contabilidad */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* DEBE - Ingresos */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ background: '#16a34a', color: 'white', padding: '15px 20px', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
            DEBE (Ingresos)
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0fdf4' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dcfce7', fontSize: '0.85rem' }}>Fecha</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #dcfce7', fontSize: '0.85rem' }}>Concepto</th>
                  <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #dcfce7', fontSize: '0.85rem' }}>Monto</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #dcfce7', width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center' }}>Cargando...</td></tr>
                ) : pagosFiltrados.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>Sin ingresos</td></tr>
                ) : pagosFiltrados.map(p => (
                  <tr key={p.id} style={{ borderBottom: '1px solid #f0fdf4' }}>
                    <td style={{ padding: '10px', fontSize: '0.85rem' }}>
                      {new Date(p.fecha_pago).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{p.usuario_nombre}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{p.metodo_pago}</div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#16a34a' }}>
                      ${parseFloat(String(p.monto)).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => deletePago(p)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '3px'
                      }}>
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#dcfce7' }}>
                  <td colSpan={2} style={{ padding: '12px', fontWeight: 700, color: '#166534' }}>TOTAL</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#16a34a', fontSize: '1.1rem' }}>
                    ${totalIngresos.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* HABER - Egresos */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ background: '#dc2626', color: 'white', padding: '15px 20px', fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
            HABER (Egresos)
          </div>
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#fef2f2' }}>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #fee2e2', fontSize: '0.85rem' }}>Fecha</th>
                  <th style={{ padding: '10px', textAlign: 'left', borderBottom: '2px solid #fee2e2', fontSize: '0.85rem' }}>Concepto</th>
                  <th style={{ padding: '10px', textAlign: 'right', borderBottom: '2px solid #fee2e2', fontSize: '0.85rem' }}>Monto</th>
                  <th style={{ padding: '10px', textAlign: 'center', borderBottom: '2px solid #fee2e2', width: '50px' }}></th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center' }}>Cargando...</td></tr>
                ) : gastosFiltrados.length === 0 ? (
                  <tr><td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>Sin egresos</td></tr>
                ) : gastosFiltrados.map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid #fef2f2' }}>
                    <td style={{ padding: '10px', fontSize: '0.85rem' }}>
                      {new Date(g.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', timeZone: 'UTC' })}
                    </td>
                    <td style={{ padding: '10px' }}>
                      <div style={{ fontWeight: 500, fontSize: '0.9rem' }}>{g.tipo}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>{g.descripcion || '-'}</div>
                    </td>
                    <td style={{ padding: '10px', textAlign: 'right', fontWeight: 600, color: '#dc2626' }}>
                      ${parseFloat(String(g.monto)).toLocaleString()}
                    </td>
                    <td style={{ padding: '10px', textAlign: 'center' }}>
                      <button onClick={() => deleteGasto(g)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '3px'
                      }}>
                        <FontAwesomeIcon icon={faTrash} size="sm" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr style={{ background: '#fee2e2' }}>
                  <td colSpan={2} style={{ padding: '12px', fontWeight: 700, color: '#991b1b' }}>TOTAL</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: 700, color: '#dc2626', fontSize: '1.1rem' }}>
                    ${totalEgresos.toLocaleString()}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>

      {/* Modal Pago */}
      {modalPago && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f0fdf4' }}>
              <h2 style={{ margin: 0, color: '#16a34a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FontAwesomeIcon icon={faArrowUp} /> Registrar Ingreso
              </h2>
              <button onClick={() => setModalPago(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Alumno *</label>
                <select value={pagoForm.inscripcion_id} onChange={(e) => setPagoForm({ ...pagoForm, inscripcion_id: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                  <option value="">Seleccionar alumno...</option>
                  {inscripciones.map(i => (
                    <option key={i.id} value={i.id}>{i.usuario_nombre} - Saldo: ${parseFloat(String(i.saldo_pendiente)).toLocaleString()}</option>
                  ))}
                </select>
              </div>

              {selectedInsc && (
                <div style={{ background: '#f0fdf4', padding: '12px', borderRadius: 'var(--radius)', marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Saldo pendiente:</span>
                    <strong style={{ color: '#dc2626' }}>${parseFloat(String(selectedInsc.saldo_pendiente)).toLocaleString()}</strong>
                  </div>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Monto ($) *</label>
                  <input type="number" value={pagoForm.monto} onChange={(e) => setPagoForm({ ...pagoForm, monto: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '1.1rem', fontWeight: 600 }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha</label>
                  <input type="date" value={pagoForm.fecha_pago} onChange={(e) => setPagoForm({ ...pagoForm, fecha_pago: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Método de pago</label>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['efectivo', 'transferencia', 'tarjeta'].map(m => (
                    <button key={m} type="button" onClick={() => setPagoForm({ ...pagoForm, metodo_pago: m })}
                      style={{
                        padding: '8px 16px', borderRadius: '20px', cursor: 'pointer', textTransform: 'capitalize',
                        background: pagoForm.metodo_pago === m ? '#16a34a' : 'white',
                        color: pagoForm.metodo_pago === m ? 'white' : '#333',
                        border: pagoForm.metodo_pago === m ? 'none' : '1px solid #ddd'
                      }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Notas</label>
                <input type="text" value={pagoForm.notas} onChange={(e) => setPagoForm({ ...pagoForm, notas: e.target.value })}
                  placeholder="Opcional..." style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalPago(false)} style={{ padding: '12px 24px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={savePago} disabled={saving} style={{
                  padding: '12px 24px', background: '#16a34a', color: 'white', border: 'none', borderRadius: 'var(--radius)',
                  cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
                }}>
                  <FontAwesomeIcon icon={faSave} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Gasto */}
      {modalGasto && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2' }}>
              <h2 style={{ margin: 0, color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FontAwesomeIcon icon={faArrowDown} /> Registrar Egreso
              </h2>
              <button onClick={() => setModalGasto(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Tipo *</label>
                  <select value={gastoForm.tipo} onChange={(e) => setGastoForm({ ...gastoForm, tipo: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    {TIPOS_GASTO.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Monto ($) *</label>
                  <input type="number" value={gastoForm.monto} onChange={(e) => setGastoForm({ ...gastoForm, monto: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd', fontSize: '1.1rem', fontWeight: 600 }} />
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha</label>
                <input type="date" value={gastoForm.fecha} onChange={(e) => setGastoForm({ ...gastoForm, fecha: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
                <textarea value={gastoForm.descripcion} onChange={(e) => setGastoForm({ ...gastoForm, descripcion: e.target.value })} rows={3}
                  placeholder="Detalles del gasto..." style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalGasto(false)} style={{ padding: '12px 24px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={saveGasto} disabled={saving} style={{
                  padding: '12px 24px', background: '#dc2626', color: 'white', border: 'none', borderRadius: 'var(--radius)',
                  cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
                }}>
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
