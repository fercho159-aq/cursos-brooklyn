'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faSave, faUsers, faClipboardList } from '@fortawesome/free-solid-svg-icons'

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
      const grupoRes = await fetch('/api/profesor/grupo', { credentials: 'include' })
      if (!grupoRes.ok) throw new Error('Error obteniendo grupo')
      
      const grupoData = await grupoRes.json()
      setGrupo(grupoData.grupo)
      setAlumnos(grupoData.alumnos || [])

      if (grupoData.grupo) {
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

  useEffect(() => {
    setMarkedCount(Object.keys(asistencias).length);
  }, [asistencias])

  const guardarAsistencia = async () => {
    if (!grupo) return;

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
      <div style={{ width: '50px', height: '50px', border: '3px solid rgba(16, 185, 129, 0.2)', borderTopColor: '#10b981', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '20px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em' }}>CARGANDO MATRÍCULA...</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  )

  if (!grupo) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', marginBottom: '30px' }}>
          <FontAwesomeIcon icon={faUsers} style={{ fontSize: '3rem' }} />
        </div>
        <h2 style={{ color: '#ffffff', margin: '0 0 15px 0', fontSize: '2rem', fontWeight: 900 }}>Sin Grupo</h2>
        <p style={{ color: '#9ca3af', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto', lineHeight: '1.6' }}>No tienes ningún bloque horario asignado actualmente, por lo que no puedes realizar el pase de lista.</p>
      </div>
    )
  }

  const progress = alumnos.length > 0 ? (markedCount / alumnos.length) * 100 : 0;

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '40px', flexWrap: 'wrap', gap: '25px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 15px 30px rgba(16, 185, 129, 0.4)' }}>
            <FontAwesomeIcon icon={faClipboardList} style={{ fontSize: '1.8rem' }} />
          </div>
          <div>
            <h1 style={{ margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Pase de Lista</h1>
            <p style={{ margin: 0, color: '#9ca3af', fontSize: '1.2rem', fontWeight: 300 }}>
              <strong style={{ color: '#ffffff', fontWeight: 700 }}>{grupo.nombre}</strong> <span style={{ margin: '0 12px', color: 'rgba(255,255,255,0.2)' }}>|</span> {new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
        </div>
        <button
          className="animated-button badge-pulse"
          onClick={guardarAsistencia}
          disabled={saving || Object.keys(asistencias).length === 0}
          style={{
            padding: '16px 32px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
            borderRadius: '16px', fontWeight: 800, fontSize: '1.1rem',
            cursor: (saving || Object.keys(asistencias).length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 15px 35px rgba(16, 185, 129, 0.4)',
            opacity: saving ? 0.7 : 1
          }}
        >
          <FontAwesomeIcon icon={faSave} style={{ fontSize: '1.3rem' }} />
          {saving ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </div>

      <div className="glass-card" style={{ padding: '35px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
        <div style={{ display: 'flex', gap: '25px', flexWrap: 'wrap' }}>
          <div className="hover-glow" style={{ flex: 1, padding: '25px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(37, 99, 235, 0.05) 100%)', borderRadius: '20px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
            <div style={{ color: '#93c5fd', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '10px' }}>Total Alumnos</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#60a5fa', display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              {alumnos.length} <span style={{ fontSize: '1.1rem', color: '#93c5fd', fontWeight: 600 }}>en tu lista</span>
            </div>
          </div>
          <div className="hover-glow" style={{ flex: 1, padding: '25px', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(5, 150, 105, 0.05) 100%)', borderRadius: '20px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            <div style={{ color: '#6ee7b7', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '10px' }}>Presentes</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#34d399' }}>{presentes}</div>
          </div>
          <div className="hover-glow" style={{ flex: 1, padding: '25px', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(220, 38, 38, 0.05) 100%)', borderRadius: '20px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <div style={{ color: '#fca5a5', fontSize: '0.9rem', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '10px' }}>Ausentes / Faltas</div>
            <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f87171' }}>{ausentes}</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', fontWeight: 700, color: '#9ca3af', marginBottom: '12px' }}>
            <span style={{ letterSpacing: '0.05em', textTransform: 'uppercase' }}>Progreso del Pase de Lista</span>
            <span style={{ color: '#ffffff', background: 'rgba(255,255,255,0.1)', padding: '4px 12px', borderRadius: '20px' }}>{markedCount} / {alumnos.length} marcados</span>
          </div>
          <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '15px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
            <div style={{ width: `${progress}%`, height: '100%', background: progress === 100 ? 'linear-gradient(90deg, #10b981, #059669)' : 'linear-gradient(90deg, #3b82f6, #8b5cf6)', transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)', boxShadow: '0 0 15px rgba(59, 130, 246, 0.5)' }} />
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        {alumnos.length === 0 ? (
          <div style={{ padding: '80px', textAlign: 'center', color: '#9ca3af', background: 'rgba(0,0,0,0.3)' }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '4rem', marginBottom: '20px', color: '#4b5563' }} />
            <h3 style={{ margin: '0 0 10px 0', color: '#f3f4f6', fontSize: '1.6rem', fontWeight: 800 }}>Lista Vacía</h3>
            <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 300 }}>No hay alumnos inscritos en este bloque horario.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {alumnos.map((alumno, index) => {
              const estado = asistencias[alumno.id];
              return (
                <div key={alumno.id} style={{ 
                  padding: '25px 35px', 
                  borderBottom: index < alumnos.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  background: estado === 'presente' ? 'rgba(16, 185, 129, 0.08)' : estado === 'ausente' ? 'rgba(239, 68, 68, 0.08)' : 'transparent',
                  transition: 'background 0.4s ease',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {estado === 'presente' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#10b981', boxShadow: '0 0 15px #10b981' }} />}
                  {estado === 'ausente' && <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: '#ef4444', boxShadow: '0 0 15px #ef4444' }} />}
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '50px', height: '50px', borderRadius: '50%', 
                      background: estado === 'presente' ? '#10b981' : estado === 'ausente' ? '#ef4444' : 'rgba(255, 255, 255, 0.1)', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white',
                      fontWeight: 800, fontSize: '1.4rem', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
                      boxShadow: estado === 'presente' ? '0 0 20px rgba(16, 185, 129, 0.5)' : estado === 'ausente' ? '0 0 20px rgba(239, 68, 68, 0.5)' : 'none',
                      border: estado ? 'none' : '1px solid rgba(255,255,255,0.2)'
                    }}>
                      {estado === 'presente' ? <FontAwesomeIcon icon={faCheckCircle} /> : estado === 'ausente' ? <FontAwesomeIcon icon={faTimesCircle} /> : alumno.nombre.charAt(0)}
                    </div>
                    <div>
                      <strong style={{ display: 'block', fontSize: '1.3rem', color: '#ffffff', fontWeight: 700, letterSpacing: '0.01em', marginBottom: '4px' }}>{alumno.nombre}</strong>
                      <span style={{ fontSize: '1rem', color: '#9ca3af', fontWeight: 300, background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '6px' }}>Cel: {alumno.celular || 'No registrado'}</span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                      className="animated-button"
                      onClick={() => marcar(alumno.id, 'presente')}
                      style={{
                        padding: '12px 24px', borderRadius: '14px',
                        background: estado === 'presente' ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: estado === 'presente' ? 'white' : '#9ca3af',
                        fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: estado === 'presente' ? '0 8px 20px rgba(16, 185, 129, 0.4)' : 'none',
                        border: estado === 'presente' ? 'none' : '1px solid rgba(255,255,255,0.1)'
                      }}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} />
                      Presente
                    </button>
                    <button
                      className="animated-button"
                      onClick={() => marcar(alumno.id, 'ausente')}
                      style={{
                        padding: '12px 24px', borderRadius: '14px',
                        background: estado === 'ausente' ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255, 255, 255, 0.05)',
                        color: estado === 'ausente' ? 'white' : '#9ca3af',
                        fontWeight: 700, fontSize: '1.05rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                        boxShadow: estado === 'ausente' ? '0 8px 20px rgba(239, 68, 68, 0.4)' : 'none',
                        border: estado === 'ausente' ? 'none' : '1px solid rgba(255,255,255,0.1)'
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
