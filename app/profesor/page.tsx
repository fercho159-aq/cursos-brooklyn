'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUsers, faCheckCircle, faSignOutAlt, faCalendarDay, faGraduationCap, faSun, faMoon, faStar, faRocket } from '@fortawesome/free-solid-svg-icons'

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
      <div style={{ width: '50px', height: '50px', border: '3px solid rgba(234, 179, 8, 0.2)', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ marginTop: '20px', color: '#9ca3af', fontWeight: 500, letterSpacing: '0.05em' }}>PREPARANDO PANEL...</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ padding: '40px 30px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '50px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', boxShadow: '0 15px 30px rgba(234, 179, 8, 0.4)' }} className="badge-pulse">
          <FontAwesomeIcon icon={faRocket} style={{ fontSize: '1.8rem' }} />
        </div>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '2.5rem', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.03em', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Bienvenido, Profesor</h1>
          <p style={{ margin: 0, color: '#9ca3af', fontSize: '1.1rem', fontWeight: 300 }}>Aquí está el resumen de tu jornada laboral actual y tu grupo asignado.</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {/* Tarjeta de Checador */}
        <div className="glass-card" style={{
          padding: '40px', flex: '1 1 450px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15) 0%, rgba(2, 132, 199, 0.05) 100%)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', color: '#38bdf8', boxShadow: '0 0 30px rgba(56, 189, 248, 0.3)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <FontAwesomeIcon icon={faClock} style={{ fontSize: '2rem' }} />
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: '0 0 5px 0', color: '#ffffff' }}>Mi Checador</h2>
          <p style={{ margin: '0 0 35px 0', color: '#9ca3af', fontSize: '1rem', fontWeight: 400 }}>{new Date().toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>

          <div style={{ display: 'flex', gap: '25px', width: '100%', justifyContent: 'center' }}>
            <div style={{ flex: 1, padding: '25px', background: asistencia ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)', borderRadius: '24px', border: asistencia ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <p style={{ margin: '0 0 15px 0', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Entrada</p>
              {asistencia ? (
                <div style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textShadow: '0 0 15px rgba(52, 211, 153, 0.5)' }}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {asistencia.hora_entrada.slice(0, 5)} hrs
                </div>
              ) : (
                <button
                  className="animated-button"
                  onClick={() => marcarAsistencia('entrada')}
                  disabled={marcando}
                  style={{
                    width: '100%', padding: '15px 15px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', color: 'white',
                    borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem',
                    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.4)'
                  }}
                >
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '10px' }} />
                  Marcar Entrada
                </button>
              )}
            </div>

            <div style={{ flex: 1, padding: '25px', background: asistencia?.hora_salida ? 'rgba(16, 185, 129, 0.1)' : 'rgba(0,0,0,0.3)', borderRadius: '24px', border: asistencia?.hora_salida ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid rgba(255,255,255,0.05)', transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)' }}>
              <p style={{ margin: '0 0 15px 0', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '0.1em' }}>Salida</p>
              {asistencia?.hora_salida ? (
                <div style={{ color: '#34d399', fontSize: '1.8rem', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', textShadow: '0 0 15px rgba(52, 211, 153, 0.5)' }}>
                  <FontAwesomeIcon icon={faCheckCircle} />
                  {asistencia.hora_salida.slice(0, 5)} hrs
                </div>
              ) : (
                 <button
                  className="animated-button"
                  onClick={() => marcarAsistencia('salida')}
                  disabled={!asistencia || marcando}
                  style={{
                    width: '100%', padding: '15px 15px', background: asistencia ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)' : 'rgba(255,255,255,0.05)', color: asistencia ? 'white' : '#6b7280',
                    borderRadius: '16px', fontWeight: 800, fontSize: '1.05rem',
                    boxShadow: asistencia ? '0 10px 25px rgba(239, 68, 68, 0.4)' : 'none'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '10px' }} />
                  Marcar Salida
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Grupo */}
        <div className="glass-card" style={{
          padding: '40px', flex: '1 1 450px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '35px' }}>
            <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.05) 100%)', width: '60px', height: '60px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#f472b6', boxShadow: '0 0 30px rgba(236, 72, 153, 0.3)', border: '1px solid rgba(236, 72, 153, 0.2)' }}>
              <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '1.8rem' }} />
            </div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0, color: '#ffffff' }}>Mi Grupo Asignado</h2>
          </div>
          {grupo ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <div style={{ background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.05) 0%, rgba(219, 39, 119, 0.02) 100%)', padding: '25px', borderRadius: '24px', border: '1px solid rgba(236, 72, 153, 0.15)', flex: 1 }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fbcfe8', marginBottom: '25px', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '15px' }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f472b6', boxShadow: '0 0 15px rgba(244, 114, 182, 0.8)' }}></div>
                  {grupo.nombre}
                </div>
                
                <div style={{ display: 'grid', gap: '15px' }}>
                  <div className="hover-glow" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: '1.2rem' }}>
                      <FontAwesomeIcon icon={faCalendarDay} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Días</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6' }}>{grupo.dias}</div>
                    </div>
                  </div>

                  <div className="hover-glow" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(250, 204, 21, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fde047', fontSize: '1.2rem' }}>
                      <FontAwesomeIcon icon={grupo.turno?.toLowerCase().includes('matutino') ? faSun : faMoon} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Horario Asignado</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6' }}>{grupo.turno ? `${grupo.turno} - ` : ''}{grupo.horario || 'Horario General'}</div>
                    </div>
                  </div>

                  <div className="hover-glow" style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '15px', background: 'rgba(0,0,0,0.3)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '45px', height: '45px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399', fontSize: '1.2rem' }}>
                      <FontAwesomeIcon icon={faUsers} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Alumnos en tu bloque</div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f3f4f6' }}>{totalAlumnos} Estudiantes</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ padding: '50px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: '300px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', marginBottom: '20px' }}>
                <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2rem' }} />
              </div>
              <h3 style={{ margin: '0 0 10px 0', color: '#f3f4f6', fontSize: '1.4rem', fontWeight: 800 }}>Sin grupos asignados</h3>
              <p style={{ margin: 0, color: '#9ca3af', fontSize: '1.05rem', maxWidth: '80%', fontWeight: 300, lineHeight: '1.6' }}>No tienes ningún bloque horario asignado para impartir clases actualmente.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
