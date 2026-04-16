'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes, faEye, faFilePdf, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

interface Inscripcion {
  id: number
  usuario_id: number
  curso_id: number
  horario_id: number | null
  fecha_inicio: string | null
  fecha_fin: string | null
  costo_total: number
  saldo_pendiente: number
  estado: string
  notas: string | null
  nombre_curso_especifico: string | null
  horario_otro: string | null
  modulo_numero: number
  promocion: string | null
  usuario_nombre: string
  usuario_celular: string
  usuario_estado: string | null
  usuario_id_real: number
  curso_nombre_ref: string
  horario_nombre: string | null
  profesor_nombre?: string | null
  profesor_id?: number | null
  created_at: string
}

interface Usuario { id: number; nombre: string; celular: string }
interface Curso { id: number; nombre: string; costo: number }
interface Horario { id: number; nombre: string }

export default function InscripcionesPage() {
  const [inscripciones, setInscripciones] = useState<Inscripcion[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cursos, setCursos] = useState<Curso[]>([])
  const [horarios, setHorarios] = useState<Horario[]>([])
  const [profesores, setProfesores] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [filtroModulo, setFiltroModulo] = useState('')
  const [filtroPago, setFiltroPago] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Inscripcion | null>(null)
  const [saving, setSaving] = useState(false)
  const [processingId, setProcessingId] = useState<number | null>(null)
  const [formData, setFormData] = useState({
    usuario_id: '', curso_id: '', horario_id: '', fecha_inicio: '', fecha_fin: '',
    costo_total: '1900', saldo_pendiente: '1900', estado: 'activo', notas: '',
    nombre_curso_especifico: '', horario_otro: '', modulo_numero: '1', promocion: '', profesor_id: ''
  })

  const fetchData = async () => {
    try {
      const [inscRes, usrRes, crsRes, horRes] = await Promise.all([
        fetch(`/api/admin/inscripciones${filtroEstado ? `?estado=${filtroEstado}` : ''}`, { credentials: 'include' }),
        fetch('/api/admin/usuarios?rol=alumno', { credentials: 'include' }),
        fetch('/api/admin/cursos', { credentials: 'include' }),
        fetch('/api/admin/horarios', { credentials: 'include' }),
        fetch('/api/admin/usuarios?rol=profesor', { credentials: 'include' })
      ])
      if (inscRes.ok) setInscripciones(await inscRes.json())
      if (usrRes.ok) setUsuarios(await usrRes.json())
      if (crsRes.ok) setCursos(await crsRes.json())
      if (horRes.ok) setHorarios(await horRes.json())
      if (profsRes.ok) setProfesores(await profsRes.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [filtroEstado])

  const openCreate = () => {
    setEditing(null)
    const curso = cursos[0]
    setFormData({
      usuario_id: usuarios[0]?.id?.toString() || '', curso_id: curso?.id?.toString() || '',
      horario_id: '', fecha_inicio: new Date().toISOString().split('T')[0], fecha_fin: '',
      costo_total: curso?.costo?.toString() || '1900', saldo_pendiente: curso?.costo?.toString() || '1900',
      estado: 'activo', notas: '', nombre_curso_especifico: '', horario_otro: '', modulo_numero: '1', promocion: '', profesor_id: ''
    })
    setModalOpen(true)
  }

  const openEdit = (i: Inscripcion) => {
    setEditing(i.id ? i : null)
    setFormData({
      usuario_id: i.usuario_id_real?.toString(), curso_id: i.curso_id?.toString() || '',
      horario_id: i.horario_id?.toString() || '', fecha_inicio: i.fecha_inicio?.split('T')[0] || new Date().toISOString().split('T')[0],
      fecha_fin: i.fecha_fin?.split('T')[0] || '', costo_total: i.costo_total?.toString() || '',
      saldo_pendiente: i.saldo_pendiente?.toString() || '', estado: i.estado || 'activo', notas: i.notas || '',
      nombre_curso_especifico: i.nombre_curso_especifico || '', horario_otro: i.horario_otro || '',
      modulo_numero: i.modulo_numero?.toString() || '1', promocion: i.promocion || '', profesor_id: i.profesor_id?.toString() || ''
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.usuario_id || !formData.curso_id) { alert('Usuario y curso son requeridos'); return }
    setSaving(true)
    try {
      const payload = {
        usuario_id: parseInt(formData.usuario_id), curso_id: parseInt(formData.curso_id),
        horario_id: formData.horario_id ? parseInt(formData.horario_id) : null,
        fecha_inicio: formData.fecha_inicio || null, fecha_fin: formData.fecha_fin || null,
        costo_total: parseFloat(formData.costo_total), saldo_pendiente: parseFloat(formData.saldo_pendiente),
        estado: formData.estado, notas: formData.notas || null,
        nombre_curso_especifico: formData.nombre_curso_especifico || null,
        horario_otro: formData.horario_otro || null, modulo_numero: parseInt(formData.modulo_numero),
        promocion: formData.promocion || null, profesor_id: formData.profesor_id ? parseInt(formData.profesor_id) : null
      }
      const url = editing ? `/api/admin/inscripciones?id=${editing.id}` : '/api/admin/inscripciones'
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

  const handleDelete = async (i: Inscripcion) => {
    if (!confirm(`¿Eliminar la inscripción de ${i.usuario_nombre}?`)) return
    try {
      const res = await fetch(`/api/admin/inscripciones?id=${i.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchData()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const handleCursoChange = (cursoId: string) => {
    const curso = cursos.find(c => c.id.toString() === cursoId)
    setFormData({
      ...formData,
      curso_id: cursoId,
      costo_total: curso?.costo?.toString() || formData.costo_total,
      saldo_pendiente: editing ? formData.saldo_pendiente : (curso?.costo?.toString() || formData.saldo_pendiente)
    })
  }

  const generateToken = async (inscriptionId: number) => {
    try {
      const res = await fetch('/api/admin/generar-token-recibo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inscriptionId }),
        credentials: 'include'
      })
      const data = await res.json()
      return data.token
    } catch (e) {
      console.error(e)
      return null
    }
  }

  const handleVerRecibo = async (i: Inscripcion) => {
    setProcessingId(i.id)
    const token = await generateToken(i.id)
    setProcessingId(null)
    if (token) {
      window.open(`/recibo/${token}`, '_blank')
    } else {
      alert('Error al generar recibo')
    }
  }

  const handleShareWhatsapp = async (i: Inscripcion) => {
    setProcessingId(i.id)
    const token = await generateToken(i.id)
    setProcessingId(null)
    if (token) {
      const link = `${window.location.origin}/recibo/${token}`
      const text = `Hola ${i.usuario_nombre}, aquí puedes ver y descargar tu Estado de Cuenta en PDF: ${link}`
      window.open(`https://wa.me/${i.usuario_celular}?text=${encodeURIComponent(text)}`, '_blank')
    } else {
      alert('Error al generar enlace')
    }
  }

  const modulosDisponibles = Array.from(new Set(inscripciones.map(i => i.modulo_numero).filter(Boolean))).sort((a, b) => a - b);
  const filteredInscripciones = inscripciones.filter(i => {
    if (filtroModulo && (!i.modulo_numero || i.modulo_numero.toString() !== filtroModulo)) return false;
    
    const saldo = parseFloat(i.saldo_pendiente as any) || 0;
    if (filtroPago === 'pagado' && saldo > 0) return false;
    if (filtroPago === 'adeudo' && saldo <= 0) return false;

    return true;
  });

  const totalAdeudo = filteredInscripciones.reduce((sum, i) => {
    const saldo = parseFloat(i.saldo_pendiente as any) || 0;
    return saldo > 0 ? sum + saldo : sum;
  }, 0);
  const totalRecaudado = filteredInscripciones.reduce((sum, i) => {
    const costo = parseFloat(i.costo_total as any) || 0;
    const saldo = parseFloat(i.saldo_pendiente as any) || 0;
    // Si el saldo es mayor al costo, recaudó 0, sino la diferencia es lo recaudado
    const recaudadoDeEste = Math.max(0, costo - (saldo > 0 ? saldo : 0));
    return sum + recaudadoDeEste;
  }, 0);
  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Alumnos</h1>
        <button onClick={openCreate} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nueva Inscripción
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '25px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)', minWidth: '160px' }}>
            <option value="">Todos los estados</option>
            <option value="activo">Activos</option>
            <option value="inactivo">Inactivos</option>
          </select>
          <select value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)', minWidth: '160px' }}>
            <option value="">Todos los módulos</option>
            {modulosDisponibles.map(m => (
              <option key={m} value={m}>Módulo {m}</option>
            ))}
          </select>
          <select value={filtroPago} onChange={(e) => setFiltroPago(e.target.value)}
            style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)', minWidth: '160px' }}>
            <option value="">Todos (Status Pago)</option>
            <option value="pagado">Al corriente</option>
            <option value="adeudo">Con adeudo</option>
          </select>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          <div style={{ background: 'var(--white)', padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px', borderLeft: '4px solid #3b82f6' }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Alumnos</span>
            <strong style={{ fontSize: '1.2rem', color: '#1f2937', marginTop: '2px' }}>{filteredInscripciones.length}</strong>
          </div>
          <div style={{ background: 'var(--white)', padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px', borderLeft: '4px solid #10b981' }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Recaudado</span>
            <strong style={{ fontSize: '1.2rem', color: '#10b981', marginTop: '2px' }}>${totalRecaudado.toLocaleString('es-MX')}</strong>
          </div>
          <div style={{ background: 'var(--white)', padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: '110px', borderLeft: '4px solid #ef4444' }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.5px' }}>Por Cobrar</span>
            <strong style={{ fontSize: '1.2rem', color: '#ef4444', marginTop: '2px' }}>${totalAdeudo.toLocaleString('es-MX')}</strong>
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Alumno</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Curso</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Horario</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Módulo</th>
                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Costo</th>
                <th style={{ padding: '15px', textAlign: 'right', borderBottom: '2px solid #eee' }}>Saldo</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Estado</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : filteredInscripciones.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No hay inscripciones</td></tr>
              ) : filteredInscripciones.map(i => (
                <tr key={i.id || 'u'+i.usuario_id_real} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}>
                    <strong>{i.usuario_nombre}</strong>
                    <br /><span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{i.usuario_celular}</span>
                  </td>
                  <td style={{ padding: '12px 15px' }}>{i.nombre_curso_especifico || i.curso_nombre_ref || <span style={{color: '#999'}}>Sin curso</span>}</td>
                  <td style={{ padding: '12px 15px' }}>
                    {i.horario_nombre || i.horario_otro || '-'}
                    <br /><span style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 500 }}>{i.profesor_nombre ? `Prof. ${i.profesor_nombre}` : ''}</span>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{i.modulo_numero || '-'}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'right' }}>{i.costo_total ? '$'+parseFloat(i.costo_total as any).toLocaleString() : '-'}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'right', color: (i.saldo_pendiente || 0) > 0 ? '#dc2626' : '#16a34a', fontWeight: 600 }}>
                    {i.saldo_pendiente ? '$'+parseFloat(i.saldo_pendiente as any).toLocaleString() : '-'}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px', fontSize: '0.8rem', fontWeight: 500,
                      background: i.estado === 'activo' ? '#dcfce7' : (i.estado === 'inactivo' ? '#fee2e2' : '#f3f4f6'),
                      color: i.estado === 'activo' ? '#16a34a' : (i.estado === 'inactivo' ? '#dc2626' : '#6b7280')
                    }}>{i.estado || i.usuario_estado || 'Sin inscrip.'}</span>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => openEdit(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }}>
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    {i.id && (
                      <>
                        <button onClick={() => handleDelete(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <div style={{ display: 'flex', gap: '5px', justifyContent: 'center', marginTop: '5px' }}>
                          <button onClick={() => handleVerRecibo(i)} disabled={processingId === i.id} title="Ver Recibo PDF"
                            style={{ background: 'white', border: '1px solid var(--primary)', borderRadius: '4px', cursor: 'pointer', color: 'var(--primary)', padding: '5px 8px' }}>
                            {processingId === i.id ? <FontAwesomeIcon icon={faSpinner} spin /> : <FontAwesomeIcon icon={faFilePdf} />}
                          </button>
                          <button onClick={() => handleShareWhatsapp(i)} disabled={processingId === i.id} title="Enviar por WhatsApp"
                            style={{ background: '#25D366', border: 'none', borderRadius: '4px', cursor: 'pointer', color: 'white', padding: '5px 8px' }}>
                            <FontAwesomeIcon icon={faWhatsapp} />
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Inscripción' : 'Nueva Inscripción'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Alumno *</label>
                  <select value={formData.usuario_id} onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar...</option>
                    {usuarios.map(u => <option key={u.id} value={u.id}>{u.nombre} ({u.celular})</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Curso *</label>
                  <select value={formData.curso_id} onChange={(e) => handleCursoChange(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar...</option>
                    {cursos.map(c => <option key={c.id} value={c.id}>{c.nombre} (${c.costo})</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Profesor *</label>
                  <select value={formData.profesor_id} onChange={(e) => setFormData({ ...formData, profesor_id: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar profesor...</option>
                    {profesores.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Horario</label>
                  <select value={formData.horario_id} onChange={(e) => setFormData({ ...formData, horario_id: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="">Seleccionar...</option>
                    {horarios.map(h => <option key={h.id} value={h.id}>{h.nombre}</option>)}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Módulo</label>
                  <input type="number" min="1" value={formData.modulo_numero} onChange={(e) => setFormData({ ...formData, modulo_numero: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Costo Total ($)</label>
                  <input type="number" value={formData.costo_total} onChange={(e) => setFormData({ ...formData, costo_total: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Saldo Pendiente ($)</label>
                  <input type="number" value={formData.saldo_pendiente} onChange={(e) => setFormData({ ...formData, saldo_pendiente: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Promoción</label>
                <input type="text" value={formData.promocion} onChange={(e) => setFormData({ ...formData, promocion: e.target.value })}
                  placeholder="Ej: 2x1, Descuento estudiante"
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
