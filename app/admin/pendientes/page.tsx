'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faTrash, faSave, faTimes, faCheck, faCalendar, faGripVertical } from '@fortawesome/free-solid-svg-icons'

interface Pendiente {
  id: number
  titulo: string
  descripcion: string
  categoria: string
  prioridad: string
  completado: boolean
  fecha_limite: string | null
  registrado_por: number
  registrado_por_nombre: string
  created_at: string
}

const CATEGORIAS = ['Operaciones', 'Marketing', 'Ventas', 'Administrativo']
const PRIORIDADES = ['Urgente', 'Moderado', 'No urge']

const COLORES_COLUMNA: Record<string, { bg: string; header: string; border: string; text: string }> = {
  'Urgente': { bg: '#fef2f2', header: '#dc2626', border: '#fca5a5', text: '#991b1b' },
  'Moderado': { bg: '#fffbeb', header: '#d97706', border: '#fcd34d', text: '#92400e' },
  'No urge': { bg: '#f0fdf4', header: '#16a34a', border: '#86efac', text: '#166534' }
}

const COLORES_CATEGORIA: Record<string, { bg: string; color: string }> = {
  'Operaciones': { bg: '#dbeafe', color: '#2563eb' },
  'Marketing': { bg: '#f3e8ff', color: '#9333ea' },
  'Ventas': { bg: '#fce7f3', color: '#db2777' },
  'Administrativo': { bg: '#e0e7ff', color: '#4f46e5' }
}

export default function PendientesPage() {
  const [pendientes, setPendientes] = useState<Pendiente[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroCategoria, setFiltroCategoria] = useState('')
  const [mostrarCompletados, setMostrarCompletados] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Pendiente | null>(null)
  const [saving, setSaving] = useState(false)
  const [draggedItem, setDraggedItem] = useState<Pendiente | null>(null)
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    categoria: 'Operaciones',
    prioridad: 'Moderado',
    fecha_limite: ''
  })

  const fetchPendientes = async () => {
    try {
      const params = new URLSearchParams()
      if (filtroCategoria) params.append('categoria', filtroCategoria)
      if (!mostrarCompletados) params.append('completado', 'false')

      const queryString = params.toString()
      const res = await fetch(`/api/admin/pendientes${queryString ? `?${queryString}` : ''}`, { credentials: 'include' })
      if (res.ok) setPendientes(await res.json())
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchPendientes() }, [filtroCategoria, mostrarCompletados])

  const openCreate = (prioridad?: string) => {
    setEditing(null)
    setFormData({
      titulo: '',
      descripcion: '',
      categoria: 'Operaciones',
      prioridad: prioridad || 'Moderado',
      fecha_limite: ''
    })
    setModalOpen(true)
  }

  const openEdit = (p: Pendiente) => {
    setEditing(p)
    setFormData({
      titulo: p.titulo,
      descripcion: p.descripcion || '',
      categoria: p.categoria,
      prioridad: p.prioridad,
      fecha_limite: p.fecha_limite ? p.fecha_limite.split('T')[0] : ''
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!formData.titulo || !formData.categoria || !formData.prioridad) {
      alert('Título, categoría y prioridad son requeridos')
      return
    }
    setSaving(true)
    try {
      const payload = {
        titulo: formData.titulo,
        descripcion: formData.descripcion,
        categoria: formData.categoria,
        prioridad: formData.prioridad,
        fecha_limite: formData.fecha_limite || null
      }
      const url = editing ? `/api/admin/pendientes/${editing.id}` : '/api/admin/pendientes'
      const res = await fetch(url, {
        method: editing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })
      if (res.ok) {
        setModalOpen(false)
        fetchPendientes()
      } else {
        alert((await res.json()).error || 'Error al guardar')
      }
    } catch {
      alert('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleToggleCompletado = async (p: Pendiente) => {
    try {
      const res = await fetch(`/api/admin/pendientes/${p.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ completado: !p.completado })
      })
      if (res.ok) fetchPendientes()
      else alert('Error al actualizar')
    } catch {
      alert('Error al actualizar')
    }
  }

  const handleDelete = async (p: Pendiente) => {
    if (!confirm(`¿Eliminar "${p.titulo}"?`)) return
    try {
      const res = await fetch(`/api/admin/pendientes/${p.id}`, { method: 'DELETE', credentials: 'include' })
      if (res.ok) fetchPendientes()
      else alert('Error al eliminar')
    } catch {
      alert('Error al eliminar')
    }
  }

  const handleDragStart = (e: React.DragEvent, p: Pendiente) => {
    setDraggedItem(p)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = async (e: React.DragEvent, nuevaPrioridad: string) => {
    e.preventDefault()
    if (!draggedItem || draggedItem.prioridad === nuevaPrioridad) {
      setDraggedItem(null)
      return
    }

    try {
      const res = await fetch(`/api/admin/pendientes/${draggedItem.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prioridad: nuevaPrioridad })
      })
      if (res.ok) fetchPendientes()
    } catch {
      alert('Error al mover')
    }
    setDraggedItem(null)
  }

  const getPendientesPorPrioridad = (prioridad: string) => {
    return pendientes.filter(p => p.prioridad === prioridad)
  }

  const totalPendientes = pendientes.filter(p => !p.completado).length

  return (
    <div style={{ padding: '30px', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h1 style={{ margin: 0 }}>Pendientes</h1>
          <span style={{
            background: 'var(--primary)',
            color: 'white',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            {totalPendientes} activos
          </span>
        </div>
        <button onClick={() => openCreate()} style={{
          padding: '10px 20px', background: 'var(--primary)', color: 'white', border: 'none',
          borderRadius: 'var(--radius)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600
        }}>
          <FontAwesomeIcon icon={faPlus} /> Nuevo Pendiente
        </button>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' }}>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}
          style={{ padding: '10px 15px', borderRadius: 'var(--radius)', border: '1px solid #ddd', background: 'var(--white)' }}>
          <option value="">Todas las categorías</option>
          {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={mostrarCompletados}
            onChange={(e) => setMostrarCompletados(e.target.checked)}
            style={{ width: '18px', height: '18px', cursor: 'pointer' }}
          />
          <span>Mostrar completados</span>
        </label>
      </div>

      {/* Tablero Kanban */}
      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p>Cargando...</p>
        </div>
      ) : (
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '20px',
          overflow: 'hidden'
        }}>
          {PRIORIDADES.map(prioridad => {
            const colores = COLORES_COLUMNA[prioridad]
            const items = getPendientesPorPrioridad(prioridad)

            return (
              <div
                key={prioridad}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, prioridad)}
                style={{
                  background: colores.bg,
                  borderRadius: '12px',
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                  border: `2px solid ${colores.border}`,
                  transition: 'border-color 0.2s'
                }}
              >
                {/* Column Header */}
                <div style={{
                  padding: '15px 20px',
                  background: colores.header,
                  color: 'white',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '1rem' }}>{prioridad}</span>
                    <span style={{
                      background: 'rgba(255,255,255,0.3)',
                      padding: '2px 10px',
                      borderRadius: '12px',
                      fontSize: '0.85rem'
                    }}>
                      {items.length}
                    </span>
                  </div>
                  <button
                    onClick={() => openCreate(prioridad)}
                    style={{
                      background: 'rgba(255,255,255,0.2)',
                      border: 'none',
                      borderRadius: '6px',
                      width: '28px',
                      height: '28px',
                      cursor: 'pointer',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                    title={`Agregar a ${prioridad}`}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>

                {/* Cards Container */}
                <div style={{
                  flex: 1,
                  padding: '15px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}>
                  {items.length === 0 ? (
                    <div style={{
                      padding: '30px 20px',
                      textAlign: 'center',
                      color: colores.text,
                      opacity: 0.6,
                      fontSize: '0.9rem'
                    }}>
                      Sin pendientes
                    </div>
                  ) : items.map(p => {
                    const categoriaColor = COLORES_CATEGORIA[p.categoria] || COLORES_CATEGORIA['Operaciones']
                    return (
                      <div
                        key={p.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, p)}
                        style={{
                          background: 'white',
                          borderRadius: '8px',
                          padding: '15px',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                          cursor: 'grab',
                          opacity: p.completado ? 0.6 : 1,
                          border: draggedItem?.id === p.id ? '2px dashed #999' : '1px solid #eee',
                          transition: 'box-shadow 0.2s, transform 0.2s'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        {/* Card Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                          <span style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.7rem',
                            fontWeight: 600,
                            background: categoriaColor.bg,
                            color: categoriaColor.color
                          }}>
                            {p.categoria}
                          </span>
                          <FontAwesomeIcon
                            icon={faGripVertical}
                            style={{ color: '#ccc', fontSize: '0.8rem' }}
                          />
                        </div>

                        {/* Title */}
                        <h4 style={{
                          margin: '0 0 8px 0',
                          fontSize: '0.95rem',
                          fontWeight: 600,
                          textDecoration: p.completado ? 'line-through' : 'none',
                          color: p.completado ? '#999' : '#333'
                        }}>
                          {p.titulo}
                        </h4>

                        {/* Description */}
                        {p.descripcion && (
                          <p style={{
                            margin: '0 0 10px 0',
                            fontSize: '0.8rem',
                            color: '#666',
                            lineHeight: 1.4
                          }}>
                            {p.descripcion.length > 80 ? p.descripcion.substring(0, 80) + '...' : p.descripcion}
                          </p>
                        )}

                        {/* Date */}
                        {p.fecha_limite && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.75rem',
                            color: new Date(p.fecha_limite) < new Date() && !p.completado ? '#dc2626' : '#888',
                            marginBottom: '10px'
                          }}>
                            <FontAwesomeIcon icon={faCalendar} />
                            {new Date(p.fecha_limite).toLocaleDateString('es-MX')}
                          </div>
                        )}

                        {/* Actions */}
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          paddingTop: '10px',
                          borderTop: '1px solid #f0f0f0'
                        }}>
                          <button
                            onClick={() => handleToggleCompletado(p)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '5px 10px',
                              background: p.completado ? '#dcfce7' : '#f5f5f5',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.75rem',
                              color: p.completado ? '#16a34a' : '#666'
                            }}
                          >
                            <FontAwesomeIcon icon={faCheck} />
                            {p.completado ? 'Completado' : 'Completar'}
                          </button>
                          <div style={{ display: 'flex', gap: '5px' }}>
                            <button
                              onClick={() => openEdit(p)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: 'var(--primary)',
                                padding: '5px'
                              }}
                            >
                              <FontAwesomeIcon icon={faEdit} />
                            </button>
                            <button
                              onClick={() => handleDelete(p)}
                              style={{
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                color: '#dc2626',
                                padding: '5px'
                              }}
                            >
                              <FontAwesomeIcon icon={faTrash} />
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: 'var(--white)', borderRadius: '12px', width: '100%', maxWidth: '500px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
            <div style={{ padding: '20px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ margin: 0 }}>{editing ? 'Editar Pendiente' : 'Nuevo Pendiente'}</h2>
              <button onClick={() => setModalOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: '#666' }}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Título *</label>
                <input
                  type="text"
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="¿Qué necesitas hacer?"
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Categoría *</label>
                  <select
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Prioridad *</label>
                  <select
                    value={formData.prioridad}
                    onChange={(e) => setFormData({ ...formData, prioridad: e.target.value })}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                  >
                    {PRIORIDADES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Fecha Límite</label>
                <input
                  type="date"
                  value={formData.fecha_limite}
                  onChange={(e) => setFormData({ ...formData, fecha_limite: e.target.value })}
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 500 }}>Descripción</label>
                <textarea
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={3}
                  placeholder="Agrega más detalles..."
                  style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd', resize: 'vertical' }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                <button onClick={() => setModalOpen(false)} style={{ padding: '12px 24px', background: '#f5f5f5', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>
                  Cancelar
                </button>
                <button onClick={handleSave} disabled={saving} style={{ padding: '12px 24px', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', cursor: saving ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1, fontWeight: 500 }}>
                  <FontAwesomeIcon icon={faSave} /> {saving ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style jsx global>{`
        @media (max-width: 1024px) {
          .kanban-board {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
