'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faPlus, faEdit, faTrash, faVideo, faVideoSlash, faSave, faTimes
} from '@fortawesome/free-solid-svg-icons'

interface Leccion {
  id: number
  tipo_curso: string
  curso_nombre: string
  modulo: number
  numero_leccion: number
  titulo: string
  descripcion: string
  video_url: string | null
  duracion_minutos: number | null
  orden: number
  activo: boolean
}

const CURSOS_CONFIG = {
  'Inglés': ['Headway 1', 'Headway 2'],
  'Marketing': ['Facebook Ads', 'CapCut y Canva', 'WordPress e IA']
}

export default function LeccionesPage() {
  const [lecciones, setLecciones] = useState<Leccion[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroTipo, setFiltroTipo] = useState('')
  const [filtroCurso, setFiltroCurso] = useState('')
  const [filtroModulo, setFiltroModulo] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingLeccion, setEditingLeccion] = useState<Leccion | null>(null)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    tipo_curso: 'Inglés',
    curso_nombre: 'Headway 1',
    modulo: 1,
    numero_leccion: 1,
    titulo: '',
    descripcion: '',
    video_url: '',
    duracion_minutos: '',
    orden: 1,
    activo: true
  })

  const fetchLecciones = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroTipo) params.append('tipo_curso', filtroTipo)
      if (filtroCurso) params.append('curso_nombre', filtroCurso)
      if (filtroModulo) params.append('modulo', filtroModulo)

      const res = await fetch(`/api/admin/lecciones?${params}`, { credentials: 'include' })
      if (res.ok) {
        setLecciones(await res.json())
      }
    } catch (error) {
      console.error('Error al cargar lecciones:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchLecciones() }, [filtroTipo, filtroCurso, filtroModulo])

  const openCreateModal = () => {
    setEditingLeccion(null)
    setFormData({
      tipo_curso: 'Inglés', curso_nombre: 'Headway 1', modulo: 1, numero_leccion: 1,
      titulo: '', descripcion: '', video_url: '', duracion_minutos: '', orden: 1, activo: true
    })
    setModalOpen(true)
  }

  const openEditModal = (leccion: Leccion) => {
    setEditingLeccion(leccion)
    setFormData({
      tipo_curso: leccion.tipo_curso, curso_nombre: leccion.curso_nombre,
      modulo: leccion.modulo, numero_leccion: leccion.numero_leccion,
      titulo: leccion.titulo, descripcion: leccion.descripcion || '',
      video_url: leccion.video_url || '', duracion_minutos: leccion.duracion_minutos?.toString() || '',
      orden: leccion.orden, activo: leccion.activo
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.titulo.trim()) { alert('El titulo es requerido'); return }
    setSaving(true)
    try {
      const payload = {
        ...formData,
        duracion_minutos: formData.duracion_minutos ? parseInt(formData.duracion_minutos) : null,
        video_url: formData.video_url.trim() || null
      }
      const url = editingLeccion ? `/api/admin/lecciones?id=${editingLeccion.id}` : '/api/admin/lecciones'
      const res = await fetch(url, {
        method: editingLeccion ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', body: JSON.stringify(payload)
      })
      if (res.ok) { setModalOpen(false); fetchLecciones() }
      else alert((await res.json()).error || 'Error al guardar')
    } catch { alert('Error al guardar la leccion') }
    finally { setSaving(false) }
  }

  const handleDelete = async (leccion: Leccion) => {
    if (!confirm(`¿Eliminar la leccion "${leccion.titulo}"?`)) return
    try {
      const res = await fetch(`/api/admin/lecciones?id=${leccion.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchLecciones()
      else alert('Error al eliminar')
    } catch { alert('Error al eliminar') }
  }

  const cursosDisponibles = filtroTipo ? CURSOS_CONFIG[filtroTipo as keyof typeof CURSOS_CONFIG] || [] : []
  const modulosUnicos = Array.from(new Set(lecciones.map(l => l.modulo))).sort((a, b) => a - b)
  const leccionesSinVideo = lecciones.filter(l => !l.video_url).length

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <h1 style={{ margin: 0 }}>Lecciones</h1>
        <button onClick={openCreateModal} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nueva Lección
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ background: 'var(--white)', padding: '15px 25px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)' }}>
          <span style={{ color: 'var(--gray)' }}>Total: </span><strong>{lecciones.length}</strong>
        </div>
        <div style={{
          background: leccionesSinVideo > 0 ? '#fee2e2' : '#dcfce7',
          padding: '15px 25px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)'
        }}>
          <FontAwesomeIcon icon={leccionesSinVideo > 0 ? faVideoSlash : faVideo}
            style={{ marginRight: '8px', color: leccionesSinVideo > 0 ? '#dc2626' : '#16a34a' }} />
          <span style={{ color: leccionesSinVideo > 0 ? '#dc2626' : '#16a34a' }}>
            {leccionesSinVideo > 0 ? `${leccionesSinVideo} sin video` : 'Todos con video'}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filtroTipo} onChange={(e) => { setFiltroTipo(e.target.value); setFiltroCurso('') }}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)', cursor: 'pointer' }}>
          <option value="">Todos los tipos</option>
          <option value="Inglés">Inglés</option>
          <option value="Marketing">Marketing</option>
        </select>
        <select value={filtroCurso} onChange={(e) => setFiltroCurso(e.target.value)} disabled={!filtroTipo}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: filtroTipo ? 'var(--white)' : '#f5f5f5', cursor: filtroTipo ? 'pointer' : 'not-allowed' }}>
          <option value="">Todos los cursos</option>
          {cursosDisponibles.map(curso => <option key={curso} value={curso}>{curso}</option>)}
        </select>
        <select value={filtroModulo} onChange={(e) => setFiltroModulo(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)', cursor: 'pointer' }}>
          <option value="">Todos los módulos</option>
          {modulosUnicos.map(mod => <option key={mod} value={mod}>Módulo {mod}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Tipo</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Curso</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Mód</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>#</th>
                <th style={{ padding: '15px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Título</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Video</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Activo</th>
                <th style={{ padding: '15px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center' }}>Cargando...</td></tr>
              ) : lecciones.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>No se encontraron lecciones</td></tr>
              ) : lecciones.map(leccion => (
                <tr key={leccion.id} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px 15px' }}>
                    <span style={{
                      padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem',
                      background: leccion.tipo_curso === 'Inglés' ? '#dbeafe' : '#fef3c7',
                      color: leccion.tipo_curso === 'Inglés' ? '#1e40af' : '#92400e'
                    }}>{leccion.tipo_curso}</span>
                  </td>
                  <td style={{ padding: '12px 15px', fontSize: '0.9rem' }}>{leccion.curso_nombre}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{leccion.modulo}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{leccion.numero_leccion}</td>
                  <td style={{ padding: '12px 15px' }}>
                    <div style={{ maxWidth: '300px' }}>
                      <strong style={{ fontSize: '0.9rem' }}>{leccion.titulo}</strong>
                      {leccion.descripcion && <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: 'var(--gray)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{leccion.descripcion}</p>}
                    </div>
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    {leccion.video_url ? <span style={{ color: '#16a34a' }}><FontAwesomeIcon icon={faVideo} /></span>
                      : <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem' }}>Sin video</span>}
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: leccion.activo ? '#16a34a' : '#dc2626', display: 'inline-block' }} />
                  </td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    <button onClick={() => openEditModal(leccion)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', marginRight: '10px', padding: '5px' }} title="Editar">
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button onClick={() => handleDelete(leccion)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '5px' }} title="Eliminar">
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editingLeccion ? 'Editar Lección' : 'Nueva Lección'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Tipo de Curso</label>
                  <select value={formData.tipo_curso} onChange={(e) => {
                    const tipo = e.target.value
                    const cursos = CURSOS_CONFIG[tipo as keyof typeof CURSOS_CONFIG]
                    setFormData({ ...formData, tipo_curso: tipo, curso_nombre: cursos?.[0] || '' })
                  }} style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    <option value="Inglés">Inglés</option>
                    <option value="Marketing">Marketing</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Curso</label>
                  <select value={formData.curso_nombre} onChange={(e) => setFormData({ ...formData, curso_nombre: e.target.value })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}>
                    {CURSOS_CONFIG[formData.tipo_curso as keyof typeof CURSOS_CONFIG]?.map(curso => <option key={curso} value={curso}>{curso}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Módulo</label>
                  <input type="number" min="1" value={formData.modulo} onChange={(e) => setFormData({ ...formData, modulo: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}># Lección</label>
                  <input type="number" min="1" value={formData.numero_leccion} onChange={(e) => setFormData({ ...formData, numero_leccion: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Orden</label>
                  <input type="number" min="1" value={formData.orden} onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) || 1 })}
                    style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Título *</label>
                <input type="text" value={formData.titulo} onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Ej: Introducción al Present Simple"
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} rows={3}
                  placeholder="Descripción de la lección..."
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd', resize: 'vertical' }} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>
                  <FontAwesomeIcon icon={faVideo} style={{ marginRight: '8px', color: 'var(--primary)' }} />URL del Video
                </label>
                <input type="url" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Duración (minutos)</label>
                  <input type="number" min="0" value={formData.duracion_minutos} onChange={(e) => setFormData({ ...formData, duracion_minutos: e.target.value })}
                    placeholder="Ej: 15" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', paddingTop: '25px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input type="checkbox" checked={formData.activo} onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      style={{ marginRight: '8px', width: '18px', height: '18px' }} />
                    Lección activa
                  </label>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: 'var(--radius)', cursor: 'pointer' }}>Cancelar</button>
                <button onClick={handleSave} disabled={saving} style={{
                  padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
                  borderRadius: 'var(--radius)', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1
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
