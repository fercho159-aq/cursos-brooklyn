'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faSave, faUsers } from '@fortawesome/free-solid-svg-icons'

interface Alumno {
  id: number
  nombre: string
  celular: string
  estado: string
}

interface GrupoData {
  id: number
  nombre: string
}

export default function PaseDeLista() {
  const [grupo, setGrupo] = useState<GrupoData | null>(null)
  const [alumnos, setAlumnos] = useState<Alumno[]>([])
  
  // Guardará { [id_alumno]: 'presente' | 'ausente' }
  const [asistencias, setAsistencias] = useState<{ [key: number]: string }>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [markedCount, setMarkedCount] = useState(0)

  const fetchData = async () => {
    try {
      // 1. Obtener grupo y alumnos
      const grupoRes = await fetch('/api/profesor/grupo', { credentials: 'include' })
      if (!grupoRes.ok) throw new Error('Error obteniendo grupo')
      
      const grupoData = await grupoRes.json()
      setGrupo(grupoData.grupo)
      setAlumnos(grupoData.alumnos || [])

      if (grupoData.grupo) {
        // 2. Obtener asistencias ya marcadas hoy (si las hay)
        const asisRes = await fetch('/api/profesor/alumnos/asistencia', { credentials: 'include' })
        if (asisRes.ok) {
          const asisData = await asisRes.json()
          setAsistencias(asisData)
        }
      }
    } catch (error) {
      console.error(error)
      alert('Error cargando los datos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const marcar = (id: number, estado: 'presente' | 'ausente') => {
    setAsistencias(prev => {
      const next = { ...prev, [id]: estado };
      setMarkedCount(Object.keys(next).length);
      return next;
    })
  }

  // Update markedCount on initial load if there are pre-existing attendances
  useEffect(() => {
    setMarkedCount(Object.keys(asistencias).length);
  }, [asistencias])

  const guardarAsistencia = async () => {
    if (!grupo) return;

    // Verificar si faltan alumnos por marcar
    const faltantes = alumnos.filter(a => !asistencias[a.id]);
    if (faltantes.length > 0) {
      if (!confirm(`Faltan ${faltantes.length} alumnos por marcar. ¿Seguro que quieres guardar?`)) {
        return;
      }
    }

    setSaving(true)
    try {
      const res = await fetch('/api/profesor/alumnos/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          grupo_id: grupo.id,
          alumnos: asistencias
        })
      });

      if (res.ok) {
        alert('Pase de lista guardado correctamente.');
      } else {
        const err = await res.json();
        alert(err.error || 'Error al guardar.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setSaving(false)
    }
  }

  const presentes = Object.values(asistencias).filter(e => e === 'presente').length;
  const ausentes = Object.values(asistencias).filter(e => e === 'ausente').length;

  if (loading) return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '15px', color: '#6b7280', fontWeight: 500 }}>Cargando alumnos...</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!grupo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', marginBottom: '20px' }}>
          <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2.5rem' }} />
        </div>
        <h2 style={{ color: '#374151', margin: '0 0 10px 0', fontSize: '1.5rem', fontWeight: 800 }}>Sin Grupo</h2>
        <p style={{ color: '#6b7280', fontSize: '1.05rem', maxWidth: '400px', margin: '0 auto' }}>No tienes ningún bloque horario asignado actualmente, por lo que no puedes realizar el pase de lista.</p>
      </div>
    )
  }

  const progress = alumnos.length > 0 ? (markedCount / alumnos.length) * 100 : 0;

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '30px', flexWrap: 'wrap', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(16, 185, 129, 0.3)' }}>
            <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '1.5rem' }} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Pase de Lista</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '1.05rem' }}>
              <strong>{grupo.nombre}</strong> <span style={{ margin: '0 8px', color: '#d1d5db' }}>|</span> {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          className="animated-button badge-pulse"
          onClick={guardarAsistencia}
          disabled={saving || Object.keys(asistencias).length === 0}
          style={{
            padding: '14px 28px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
            border: 'none', borderRadius: '14px', fontWeight: 700, fontSize: '1rem',
            cursor: (saving || Object.keys(asistencias).length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
            opacity: saving ? 0.7 : 1
          }}
        >
          <FontAwesomeIcon icon={faSave} style={{ fontSize: '1.2rem' }} />
          {saving ? 'Guardando Asistencia...' : 'Guardar Asistencia'}
        </button>
      </div>

      <div className="glass-card" style={{ padding: '25px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, padding: '20px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(37, 99, 235, 0.02) 100%)', borderRadius: '16px', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>Total Alumnos</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1e3a8a', display: 'flex', alignItems: 'baseline', gap: '5px' }}>
              {alumnos.length} <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 500 }}>en tu lista</span>
            </div>
          </div>
          <div style={{ flex: 1, padding: '20px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.02) 100%)', borderRadius: '16px', border: '1px solid rgba(16, 185, 129, 0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>Presentes</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#065f46' }}>{presentes}</div>
          </div>
          <div style={{ flex: 1, padding: '20px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(220, 38, 38, 0.02) 100%)', borderRadius: '16px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
            <div style={{ color: '#6b7280', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em', marginBottom: '8px' }}>Ausentes / Faltas</div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#991b1b' }}>{ausentes}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, color: '#6b7280', marginBottom: '8px' }}>
            <span>Progreso del Pase de Lista</span>
            <span>{markedCount} / {alumnos.length} marcados</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? '#10b981' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1)' }} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {alumnos.length === 0 ? (
          <div style={{ padding: '60px', textAlign: 'center', color: 'var(--gray)', background: 'rgba(255,255,255,0.5)' }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '3rem', marginBottom: '15px', color: '#d1d5db' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#4b5563', fontSize: '1.2rem' }}>Lista Vacía</h3>
            <p style={{ margin: 0 }}>No hay alumnos inscritos en este bloque horario.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {alumnos.map((alumno, index) => {
              const estado = asistencias[alumno.id];
              return (
                <div key={alumno.id} style={{ 
                  padding: '20px 30px', 
                  borderBottom: index < alumnos.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: estado === 'presente' ? 'rgba(16, 185, 129, 0.03)' : estado === 'ausente' ? 'rgba(239, 68, 68, 0.03)' : 'transparent',
                  transition: 'background 0.3s ease'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '50%', 
                      background: estado === 'presente' ? '#10b981' : estado === 'ausente' ? '#ef4444' : '#f3f4f6', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontWeight: 700, fontSize: '1.1rem', transition: 'all 0.3s'
                    }}>
                      {estado === 'presente' ? <FontAwesomeIcon icon={faCheckCircle} /> : estado === 'ausente' ? <FontAwesomeIcon icon={faTimesCircle} /> : alumno.nombre.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.1rem', color: '#1f2937', fontWeight: 600 }}>{alumno.nombre}</strong>
                      <span style={{ fontSize: '0.9rem', color: '#6b7280' }}>Cel: {alumno.celular || 'No registrado'}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="animated-button"
                      onClick={() => marcar(alumno.id, 'presente')}
                      style={{
                        padding: '10px 20px', border: 'none', borderRadius: '12px',
                        background: estado === 'presente' ? '#10b981' : '#f3f4f6',
                        color: estado === 'presente' ? 'white' : '#6b7280',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: estado === 'presente' ? '0 4px 12px rgba(16, 185, 129, 0.3)' : 'none'
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Presente
                    </button>
                    <button
                      className="animated-button"
                      onClick={() => marcar(alumno.id, 'ausente')}
                      style={{
                        padding: '10px 20px', border: 'none', borderRadius: '12px',
                        background: estado === 'ausente' ? '#ef4444' : '#f3f4f6',
                        color: estado === 'ausente' ? 'white' : '#6b7280',
                        fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                        boxShadow: estado === 'ausente' ? '0 4px 12px rgba(239, 68, 68, 0.3)' : 'none'
                      }}
                    >
                      <FontAwesomeIcon icon={faTimesCircle} />
                      Falta
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
