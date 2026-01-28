'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes, faChevronLeft, faChevronRight, faCheck, faXmark, faFilePdf, faHistory, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons'

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

interface AlumnoSeguimiento {
  inscripcion_id: number
  usuario_id: number
  usuario_nombre: string
  usuario_celular: string
  curso: string
  pago_mes: number
  saldo_pendiente: number
  pagos_detalle: Array<{ id: number; monto: number; fecha: string; metodo: string }>
}

interface SeguimientoData {
  resumen: {
    total_alumnos: number
    alumnos_pagaron: number
    alumnos_sin_pago: number
    total_recaudado: number
  }
  alumnos: AlumnoSeguimiento[]
}

const MESES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
]

export default function PagosPage() {
  const [activeTab, setActiveTab] = useState<'lista' | 'seguimiento'>('lista')
  const [pagos, setPagos] = useState<Pago[]>([])
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pago | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    inscripcion_id: '', monto: '', metodo_pago: 'efectivo', comprobante: '', notas: '', fecha_pago: ''
  })

  // Seguimiento state
  const [seguimientoData, setSeguimientoData] = useState<SeguimientoData | null>(null)
  const [seguimientoLoading, setSeguimientoLoading] = useState(false)
  const [mesSeleccionado, setMesSeleccionado] = useState(new Date().getMonth() + 1)
  const [añoSeleccionado, setAñoSeleccionado] = useState(new Date().getFullYear())

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

  const fetchSeguimiento = async () => {
    setSeguimientoLoading(true)
    try {
      const res = await fetch(
        `/api/admin/pagos/seguimiento?mes=${mesSeleccionado}&año=${añoSeleccionado}`,
        { credentials: 'include' }
      )
      if (res.ok) {
        setSeguimientoData(await res.json())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setSeguimientoLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  useEffect(() => {
    if (activeTab === 'seguimiento') {
      fetchSeguimiento()
    }
  }, [activeTab, mesSeleccionado, añoSeleccionado])

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
    if (!formData.inscripcion_id || !formData.monto) { alert('Inscripcion y monto son requeridos'); return }
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
      if (res.ok) {
        setModalOpen(false)
        fetchData()
        if (activeTab === 'seguimiento') fetchSeguimiento()
      }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar') }
    finally { setSaving(false) }
  }

  const handleDelete = async (p: Pago) => {
    if (!confirm(`¿Eliminar el pago de $${p.monto} de ${p.usuario_nombre}? Esto revertira el saldo.`)) return
    try {
      const res = await fetch(`/api/admin/pagos/${p.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) {
        fetchData()
        if (activeTab === 'seguimiento') fetchSeguimiento()
      }
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0)

  const descargarRecibo = async (pagoId: number) => {
    try {
      const response = await fetch(`/api/admin/pdf/recibo/${pagoId}`, { credentials: 'include' })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `recibo-${pagoId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Error al descargar el recibo')
      }
    } catch {
      alert('Error al descargar el recibo')
    }
  }

  const descargarHistorial = async (usuarioId: number) => {
    try {
      const response = await fetch(`/api/admin/pdf/historial/${usuarioId}`, { credentials: 'include' })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `historial-${usuarioId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        alert('Error al descargar el historial')
      }
    } catch {
      alert('Error al descargar el historial')
    }
  }

  const descargarAdeudo = async (inscripcionId: number) => {
    try {
      const response = await fetch(`/api/admin/pdf/adeudo/${inscripcionId}`, { credentials: 'include' })
      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `adeudo-${inscripcionId}.pdf`
        a.click()
        window.URL.revokeObjectURL(url)
      } else {
        const data = await response.json()
        alert(data.error || 'Error al descargar la nota de adeudo')
      }
    } catch {
      alert('Error al descargar la nota de adeudo')
    }
  }

  const cambiarMes = (delta: number) => {
    let nuevoMes = mesSeleccionado + delta
    let nuevoAño = añoSeleccionado
    if (nuevoMes < 1) {
      nuevoMes = 12
      nuevoAño -= 1
    } else if (nuevoMes > 12) {
      nuevoMes = 1
      nuevoAño += 1
    }
    setMesSeleccionado(nuevoMes)
    setAñoSeleccionado(nuevoAño)
  }

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    background: isActive ? 'var(--primary)' : 'transparent',
    color: isActive ? 'white' : 'var(--gray)',
    border: 'none',
    borderRadius: 'var(--radius)',
    cursor: 'pointer',
    fontWeight: isActive ? 600 : 400,
    fontSize: '0.95rem',
    transition: 'all 0.2s'
  })

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

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', background: '#f3f4f6', padding: '6px', borderRadius: 'var(--radius)', width: 'fit-content' }}>
        <button onClick={() => setActiveTab('lista')} style={tabStyle(activeTab === 'lista')}>
          Lista de Pagos
        </button>
        <button onClick={() => setActiveTab('seguimiento')} style={tabStyle(activeTab === 'seguimiento')}>
          Seguimiento Mensual
        </button>
      </div>

      {activeTab === 'lista' && (
        <>
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
                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Metodo</th>
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
                        <button onClick={() => descargarRecibo(p.id)} title="Descargar recibo PDF" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', marginRight: '10px', padding: '5px' }}>
                          <FontAwesomeIcon icon={faFilePdf} />
                        </button>
                        <button onClick={() => openEdit(p)} title="Editar pago" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                          <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button onClick={() => handleDelete(p)} title="Eliminar pago" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'seguimiento' && (
        <>
          {/* Selector de mes */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}>
            <button
              onClick={() => cambiarMes(-1)}
              style={{
                padding: '10px 15px',
                background: 'var(--white)',
                border: '1px solid #ddd',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FontAwesomeIcon icon={faChevronLeft} />
            </button>
            <div style={{
              padding: '10px 30px',
              background: 'var(--white)',
              borderRadius: 'var(--radius)',
              boxShadow: 'var(--shadow)',
              fontWeight: 600,
              fontSize: '1.1rem',
              minWidth: '200px',
              textAlign: 'center'
            }}>
              {MESES[mesSeleccionado - 1]} {añoSeleccionado}
            </div>
            <button
              onClick={() => cambiarMes(1)}
              style={{
                padding: '10px 15px',
                background: 'var(--white)',
                border: '1px solid #ddd',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <FontAwesomeIcon icon={faChevronRight} />
            </button>
          </div>

          {/* Resumen */}
          {seguimientoData && (
            <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ background: '#dcfce7', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <FontAwesomeIcon icon={faCheck} style={{ color: '#16a34a', marginRight: '8px' }} />
                <span style={{ color: '#16a34a' }}>{seguimientoData.resumen.alumnos_pagaron} pagaron</span>
              </div>
              <div style={{ background: '#fee2e2', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <FontAwesomeIcon icon={faXmark} style={{ color: '#dc2626', marginRight: '8px' }} />
                <span style={{ color: '#dc2626' }}>{seguimientoData.resumen.alumnos_sin_pago} sin pago</span>
              </div>
              <div style={{ background: '#dbeafe', padding: '10px 20px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
                <span style={{ color: '#2563eb' }}>Total: </span>
                <strong style={{ color: '#2563eb' }}>${seguimientoData.resumen.total_recaudado.toLocaleString()}</strong>
              </div>
            </div>
          )}

          {/* Tabla de seguimiento */}
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8f9fa' }}>
                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee', width: '50px' }}></th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Alumno</th>
                    <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Curso</th>
                    <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Pago este mes</th>
                    <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Saldo Pendiente</th>
                    <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {seguimientoLoading ? (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
                  ) : !seguimientoData || seguimientoData.alumnos.length === 0 ? (
                    <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay inscripciones activas</td></tr>
                  ) : seguimientoData.alumnos.map(alumno => (
                    <tr key={alumno.inscripcion_id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        {alumno.pago_mes > 0 ? (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: '#dcfce7',
                            color: '#16a34a'
                          }}>
                            <FontAwesomeIcon icon={faCheck} />
                          </span>
                        ) : (
                          <span style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '28px',
                            height: '28px',
                            borderRadius: '50%',
                            background: '#fee2e2',
                            color: '#dc2626'
                          }}>
                            <FontAwesomeIcon icon={faXmark} />
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 15px' }}>
                        <strong>{alumno.usuario_nombre}</strong>
                        <br /><span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{alumno.usuario_celular}</span>
                      </td>
                      <td style={{ padding: '12px 15px' }}>{alumno.curso}</td>
                      <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                        {alumno.pago_mes > 0 ? (
                          <span style={{ fontWeight: 700, color: '#16a34a' }}>${alumno.pago_mes.toLocaleString()}</span>
                        ) : (
                          <span style={{ color: 'var(--gray)' }}>-</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'right' }}>
                        {alumno.saldo_pendiente > 0 ? (
                          <span style={{ fontWeight: 600, color: '#dc2626' }}>${alumno.saldo_pendiente.toLocaleString()}</span>
                        ) : (
                          <span style={{ fontWeight: 600, color: '#16a34a' }}>$0</span>
                        )}
                      </td>
                      <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                        <button onClick={() => descargarHistorial(alumno.usuario_id)} title="Historial de pagos" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '8px', padding: '5px' }}>
                          <FontAwesomeIcon icon={faHistory} />
                        </button>
                        <button
                          onClick={() => alumno.saldo_pendiente > 0 && descargarAdeudo(alumno.inscripcion_id)}
                          title={alumno.saldo_pendiente > 0 ? "Nota de adeudo" : "Sin saldo pendiente"}
                          disabled={alumno.saldo_pendiente <= 0}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: alumno.saldo_pendiente > 0 ? 'pointer' : 'not-allowed',
                            color: alumno.saldo_pendiente > 0 ? '#dc2626' : '#ccc',
                            padding: '5px'
                          }}
                        >
                          <FontAwesomeIcon icon={faFileInvoiceDollar} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {modalOpen && (() => {
        const selectedInsc = inscripciones.find(i => i.id.toString() === formData.inscripcion_id)
        return (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '500px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Pago' : 'Registrar Pago'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              {/* Selector de inscripcion */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Alumno *</label>
                <select value={formData.inscripcion_id} onChange={(e) => setFormData({ ...formData, inscripcion_id: e.target.value })}
                  disabled={!!editing}
                  style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: editing ? '#f5f5f5' : 'white', fontSize: '1rem' }}>
                  <option value="">Seleccionar alumno...</option>
                  {inscripciones.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.usuario_nombre} - {i.nombre_curso_especifico || i.curso_nombre_ref}
                    </option>
                  ))}
                </select>
              </div>

              {/* Tarjeta informativa del alumno seleccionado */}
              {selectedInsc && (
                <div style={{
                  background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                  borderRadius: 'var(--radius)',
                  padding: '15px',
                  marginBottom: '20px',
                  border: '1px solid #dee2e6'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#333' }}>{selectedInsc.usuario_nombre}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{selectedInsc.usuario_celular}</div>
                      <div style={{ fontSize: '0.9rem', color: '#666', marginTop: '4px' }}>
                        {selectedInsc.nombre_curso_especifico || selectedInsc.curso_nombre_ref}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Saldo pendiente</div>
                      <div style={{
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        color: selectedInsc.saldo_pendiente > 0 ? '#dc2626' : '#16a34a'
                      }}>
                        ${selectedInsc.saldo_pendiente.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Botones rapidos de monto */}
                  {selectedInsc.saldo_pendiente > 0 && (
                    <div style={{ marginTop: '12px' }}>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)', marginBottom: '8px' }}>Monto rapido:</div>
                      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, monto: selectedInsc.saldo_pendiente.toString() })}
                          style={{
                            padding: '8px 16px',
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            borderRadius: '20px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          Pagar todo (${selectedInsc.saldo_pendiente.toLocaleString()})
                        </button>
                        {selectedInsc.saldo_pendiente >= 500 && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, monto: '500' })}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              color: '#333',
                              border: '1px solid #ddd',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            $500
                          </button>
                        )}
                        {selectedInsc.saldo_pendiente >= 1000 && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, monto: '1000' })}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              color: '#333',
                              border: '1px solid #ddd',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            $1,000
                          </button>
                        )}
                        {selectedInsc.saldo_pendiente > 1000 && Math.round(selectedInsc.saldo_pendiente / 2) !== 500 && Math.round(selectedInsc.saldo_pendiente / 2) !== 1000 && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, monto: Math.round(selectedInsc.saldo_pendiente / 2).toString() })}
                            style={{
                              padding: '8px 16px',
                              background: 'white',
                              color: '#333',
                              border: '1px solid #ddd',
                              borderRadius: '20px',
                              cursor: 'pointer',
                              fontSize: '0.85rem'
                            }}
                          >
                            Mitad (${Math.round(selectedInsc.saldo_pendiente / 2).toLocaleString()})
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Monto y fecha */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Monto ($) *</label>
                  <input type="number" value={formData.monto} onChange={(e) => setFormData({ ...formData, monto: e.target.value })}
                    placeholder="0"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: 'var(--radius)',
                      border: '1px solid #ddd',
                      fontSize: '1.2rem',
                      fontWeight: 600
                    }} />
                  {selectedInsc && formData.monto && parseFloat(formData.monto) > 0 && (
                    <div style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '5px' }}>
                      Nuevo saldo: ${Math.max(0, selectedInsc.saldo_pendiente - parseFloat(formData.monto)).toLocaleString()}
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha</label>
                  <input type="date" value={formData.fecha_pago} onChange={(e) => setFormData({ ...formData, fecha_pago: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>

              {/* Metodo de pago */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Metodo de Pago</label>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                  {['efectivo', 'transferencia', 'tarjeta', 'otro'].map(metodo => (
                    <button
                      key={metodo}
                      type="button"
                      onClick={() => setFormData({ ...formData, metodo_pago: metodo })}
                      style={{
                        padding: '10px 20px',
                        background: formData.metodo_pago === metodo ? 'var(--primary)' : 'white',
                        color: formData.metodo_pago === metodo ? 'white' : '#333',
                        border: formData.metodo_pago === metodo ? 'none' : '1px solid #ddd',
                        borderRadius: 'var(--radius)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        fontWeight: formData.metodo_pago === metodo ? 600 : 400
                      }}
                    >
                      {metodo}
                    </button>
                  ))}
                </div>
              </div>

              {/* Comprobante */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Comprobante</label>
                <input type="text" value={formData.comprobante} onChange={(e) => setFormData({ ...formData, comprobante: e.target.value })}
                  placeholder="# de referencia o comprobante"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>

              {/* Notas */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Notas</label>
                <textarea value={formData.notas} onChange={(e) => setFormData({ ...formData, notas: e.target.value })} rows={2}
                  placeholder="Notas adicionales..."
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>

              {/* Botones */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '12px 24px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving || !formData.inscripcion_id || !formData.monto} style={{
                  padding: '12px 24px',
                  background: (!formData.inscripcion_id || !formData.monto) ? '#ccc' : 'var(--primary)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 'var(--radius)',
                  cursor: (saving || !formData.inscripcion_id || !formData.monto) ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: saving ? 0.7 : 1,
                  fontWeight: 600
                }}>
                  <FontAwesomeIcon icon={faSave} /> {saving ? 'Guardando...' : 'Guardar Pago'}
                </button>
              </div>
            </div>
          </div>
        </div>
        )
      })()}
    </div>
  )
}
