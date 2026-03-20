'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUsers, faCheckCircle, faSignOutAlt, faCalendarDay, faGraduationCap, faSun, faMoon, faStar } from '@fortawesome/free-solid-svg-icons'

interface GrupoData {
  id: number
  nombre: string
  dias: string
  turno: string
  horario: string
}

interface AsistenciaProfe {
  id: number
  hora_entrada: string
  hora_salida: string | null
}

export default function ProfesorDashboard() {
  const [grupo, setGrupo] = useState<GrupoData | null>(null)
  const [totalAlumnos, setTotalAlumnos] = useState(0)
  const [asistencia, setAsistencia] = useState<AsistenciaProfe | null>(null)
  const [loading, setLoading] = useState(true)
  const [marcando, setMarcando] = useState(false)

  const fetchData = async () => {
    try {
      const [grupoRes, asisRes] = await Promise.all([
        fetch('/api/profesor/grupo', { credentials: 'include' }),
        fetch('/api/profesor/asistencia', { credentials: 'include' })
      ]);

      if (grupoRes.ok) {
        const data = await grupoRes.json();
        setGrupo(data.grupo);
        setTotalAlumnos(data.alumnos?.length || 0);
      }

      if (asisRes.ok) {
        const data = await asisRes.json();
        setAsistencia(data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [])

  const marcarAsistencia = async (tipo: 'entrada' | 'salida') => {
    if (!confirm(`¿Confirmar registro de ${tipo}?`)) return;

    setMarcando(true);
    try {
      const res = await fetch('/api/profesor/asistencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo }),
        credentials: 'include'
      });

      if (res.ok) {
        alert(`¡${tipo === 'entrada' ? 'Entrada' : 'Salida'} registrada correctamente!`);
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || 'No se pudo registrar.');
      }
    } catch {
      alert('Error de conexión.');
    } finally {
      setMarcando(false);
    }
  }

  if (loading) return (
    <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
      <div style={{ width: '40px', height: '40px', border: '3px solid rgba(249, 115, 22, 0.2)', borderTopColor: '#ea580c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '15px', color: '#6b7280', fontWeight: 500 }}>Preparando tu panel...</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '40px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 10px 20px rgba(234, 88, 12, 0.3)' }}>
          <FontAwesomeIcon icon={faStar} style={{ fontSize: '1.5rem' }} />
        </div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2rem', fontWeight: 800, color: '#111827', letterSpacing: '-0.02em' }}>Bienvenido, Profesor</h1>
          <p style={{ margin: 0, color: '#6b7280', fontSize: '1.05rem' }}>Aquí está el resumen de tu día de trabajo y grupo asignado.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {/* Tarjeta de Checador */}
        <div className="glass-card" style={{
          padding: '30px', flex: '1 1 400px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(37, 99, 235, 0.05) 100%)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '15px', color: '#2563eb' }}>
            <FontAwesomeIcon icon={faClock} style={{ fontSize: '1.5rem' }} />
          </div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: '0 0 5px 0', color: '#1f2937' }}>Mi Checador</h2>
          <p style={{ margin: '0 0 25px 0', color: '#6b7280', fontSize: '0.95rem' }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center' }}>
            <div style={{ flex: 1, padding: '20px', background: asistencia ? 'rgba(16, 185, 129, 0.06)' : '#ffffff', borderRadius: '20px', border: asistencia ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #e5e7eb', transition: 'all 0.3s' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Entrada</p>
              {asistencia ? (
                <div style={{ color: '#059669', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {asistencia.hora_entrada.slice(0, 5)} hrs
                </div>
              ) : (
                <button
                  className="animated-button"
                  onClick={() => marcarAsistencia('entrada')}
                  disabled={marcando}
                  style={{
                    width: '100%', padding: '12px 15px', background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)', color: 'white',
                    border: 'none', borderRadius: '12px', fontWeight: 600, cursor: marcando ? 'wait' : 'pointer',
                    boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
                  }}
                >
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                  Marcar Entrada
                </button>
              )}
            </div>

            <div style={{ flex: 1, padding: '20px', background: asistencia?.hora_salida ? 'rgba(16, 185, 129, 0.06)' : '#ffffff', borderRadius: '20px', border: asistencia?.hora_salida ? '1px solid rgba(16, 185, 129, 0.2)' : '1px solid #e5e7eb', transition: 'all 0.3s' }}>
              <p style={{ margin: '0 0 10px 0', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Salida</p>
              {asistencia?.hora_salida ? (
                <div style={{ color: '#059669', fontSize: '1.4rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {asistencia.hora_salida.slice(0, 5)} hrs
                </div>
              ) : (
                 <button
                  className="animated-button"
                  onClick={() => marcarAsistencia('salida')}
                  disabled={!asistencia || marcando}
                  style={{
                    width: '100%', padding: '12px 15px', background: asistencia ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : '#e5e7eb', color: asistencia ? 'white' : '#9ca3af',
                    border: 'none', borderRadius: '12px', fontWeight: 600, cursor: (!asistencia || marcando) ? 'not-allowed' : 'pointer',
                    boxShadow: asistencia ? '0 4px 14px rgba(239, 68, 68, 0.3)' : 'none'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                  Marcar Salida
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Grupo */}
        <div className="glass-card" style={{
          padding: '30px', flex: '1 1 400px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(109, 40, 217, 0.05) 100%)', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7c3aed' }}>
              <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '1.3rem' }} />
            </div>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 700, margin: 0, color: '#1f2937' }}>Mi Grupo Asignado</h2>
          </div>
          {grupo ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(124, 58, 237, 0.02) 100%)', padding: '20px', borderRadius: '16px', border: '1px solid rgba(139, 92, 246, 0.1)', flex: 1 }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#5b21b6', marginBottom: '20px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#8b5cf6', boxShadow: '0 0 10px rgba(139, 92, 246, 0.5)' }}></div>
                  {grupo.nombre}
                </div>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280' }}>
                      <FontAwesomeIcon icon={faCalendarDay} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Días</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{grupo.dias}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#fffbeb', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
                      <FontAwesomeIcon icon={grupo.turno?.toLowerCase().includes('matutino') ? faSun : faMoon} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Horario Asignado</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{grupo.turno ? `${grupo.turno} - ` : ''}{grupo.horario || 'Horario General'}</div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 5px rgba(0,0,0,0.02)' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase' }}>Alumnos en tu bloque</div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#374151' }}>{totalAlumnos} Estudiantes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '40px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '200px' }}>
              <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', marginBottom: '15px' }}>
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '1.5rem' }} />
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#374151', fontSize: '1.1rem' }}>Sin grupos asignados</h3>
              <p style={{ margin: 0, color: '#6b7280', fontSize: '0.9rem', maxWidth: '80%' }}>No tienes ningún bloque horario asignado para impartir clases actualmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
