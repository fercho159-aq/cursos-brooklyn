'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUsers, faCheckCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'

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

  if (loading) return <div style={{ padding: '30px' }}>Cargando panel...</div>;

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '20px' }}>Bienvenido, Profesor</h1>

      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {/* Tarjeta de Checador */}
        <div style={{
          background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)', flex: '1 1 300px',
          display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
        }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 15px 0', color: 'var(--gray)' }}>
            Mi Asistencia ({new Date().toLocaleDateString('es-MX')})
          </h2>

          <div style={{ display: 'flex', gap: '20px', width: '100%', justifyContent: 'center', marginTop: '10px' }}>
            <div style={{ flex: 1, padding: '15px', background: asistencia ? '#ecfdf5' : '#f9fafb', borderRadius: 'var(--radius)', border: '1px solid #eee' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 600, color: 'var(--gray)' }}>Entrada</p>
              {asistencia ? (
                <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                  {asistencia.hora_entrada.slice(0, 5)} hrs
                </div>
              ) : (
                <button
                  onClick={() => marcarAsistencia('entrada')}
                  disabled={marcando}
                  style={{
                    padding: '10px 20px', background: 'var(--primary)', color: 'white',
                    border: 'none', borderRadius: '50px', fontWeight: 600, cursor: marcando ? 'wait' : 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faClock} style={{ marginRight: '8px' }} />
                  Registrar Entrada
                </button>
              )}
            </div>

            <div style={{ flex: 1, padding: '15px', background: asistencia?.hora_salida ? '#ecfdf5' : '#f9fafb', borderRadius: 'var(--radius)', border: '1px solid #eee' }}>
              <p style={{ margin: '0 0 5px 0', fontWeight: 600, color: 'var(--gray)' }}>Salida</p>
              {asistencia?.hora_salida ? (
                <div style={{ color: '#10b981', fontSize: '1.2rem', fontWeight: 700 }}>
                  <FontAwesomeIcon icon={faCheckCircle} style={{ marginRight: '5px' }} />
                  {asistencia.hora_salida.slice(0, 5)} hrs
                </div>
              ) : (
                 <button
                  onClick={() => marcarAsistencia('salida')}
                  disabled={!asistencia || marcando}
                  style={{
                    padding: '10px 20px', background: asistencia ? '#ef4444' : '#ccc', color: 'white',
                    border: 'none', borderRadius: '50px', fontWeight: 600, cursor: (!asistencia || marcando) ? 'not-allowed' : 'pointer'
                  }}
                >
                  <FontAwesomeIcon icon={faSignOutAlt} style={{ marginRight: '8px' }} />
                  Registrar Salida
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tarjeta de Grupo */}
        <div style={{
          background: 'var(--white)', padding: '25px', borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)', flex: '1 1 300px'
        }}>
          <h2 style={{ fontSize: '1.2rem', margin: '0 0 15px 0', color: 'var(--gray)' }}>Mi Grupo Asignado</h2>
          {grupo ? (
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '10px' }}>
                {grupo.nombre}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, color: 'var(--gray)' }}>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>Días:</strong> {grupo.dias}
                </li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>Turno:</strong> {grupo.turno || 'N/A'}
                </li>
                <li style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                  <strong>Horario:</strong> {grupo.horario || 'N/A'}
                </li>
                <li style={{ padding: '8px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FontAwesomeIcon icon={faUsers} />
                  <strong>Total Alumnos:</strong> {totalAlumnos}
                </li>
              </ul>
            </div>
          ) : (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--gray)', background: '#f9fafb', borderRadius: 'var(--radius)' }}>
              No tienes ningún grupo asignado actualmente.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
