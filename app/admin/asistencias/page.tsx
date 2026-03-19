'use client'

import { useEffect, useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle, faTimesCircle, faClock, faUsers, faChalkboardTeacher, faSearch } from '@fortawesome/free-solid-svg-icons'

interface AsistenciaProfesor {
  id: number
  nombre: string
  hora_entrada: string | null
  hora_salida: string | null
}

interface AsistenciaAlumno {
  id: number
  nombre: string
  celular: string
  grupo_nombre: string | null
  profesor_nombre: string | null
  estado: string | null
}

export default function AsistenciasAdminPage() {
  const [fecha, setFecha] = useState(new Date().toLocaleDateString('en-CA'))
  const [profesores, setProfesores] = useState<AsistenciaProfesor[]>([])
  const [alumnos, setAlumnos] = useState<AsistenciaAlumno[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/asistencias?fecha=${fecha}`, { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setProfesores(data.profesores || [])
        setAlumnos(data.alumnos || [])
      }
    } catch (error) {
      console.error(error)
      alert('Error cargando asistencias')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [fecha])

  // Stats
  const alumnosPresentes = alumnos.filter(a => a.estado === 'presente').length;
  const alumnosAusentes = alumnos.filter(a => a.estado === 'ausente').length;
  const alumnosSinMarcar = alumnos.filter(a => !a.estado).length;

  return (
    <div style={{ padding: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 10px 0' }}>Reporte de Asistencias</h1>
          <p style={{ margin: 0, color: 'var(--gray)' }}>Monitoreo de profesores y alumnos</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontWeight: 600 }}>Fecha:</label>
          <input 
            type="date" 
            value={fecha} 
            onChange={(e) => setFecha(e.target.value)} 
            style={{ padding: '10px', borderRadius: 'var(--radius)', border: '1px solid #ddd' }}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'start' }}>
        
        {/* Profesores */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: 'var(--primary)' }} />
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Profesores</h2>
          </div>
          <div style={{ padding: '0' }}>
            {loading ? (
              <div style={{ padding: '30px', textAlign: 'center' }}>Cargando...</div>
            ) : profesores.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>No hay profesores registrados.</div>
            ) : (
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {profesores.map(p => (
                  <li key={p.id} style={{ padding: '15px 20px', borderBottom: '1px solid #eee' }}>
                    <div style={{ fontWeight: 600, marginBottom: '8px' }}>{p.nombre}</div>
                    <div style={{ display: 'flex', gap: '15px', fontSize: '0.85rem' }}>
                      <span style={{ color: p.hora_entrada ? '#10b981' : 'var(--gray)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FontAwesomeIcon icon={p.hora_entrada ? faCheckCircle : faClock} />
                        Entrada: {p.hora_entrada ? p.hora_entrada.slice(0, 5) : 'Pendiente'}
                      </span>
                      <span style={{ color: p.hora_salida ? '#3b82f6' : 'var(--gray)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <FontAwesomeIcon icon={p.hora_salida ? faCheckCircle : faClock} />
                        Salida: {p.hora_salida ? p.hora_salida.slice(0, 5) : 'Pendiente'}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Alumnos */}
        <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
          <div style={{ padding: '20px', background: '#f8f9fa', borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faUsers} style={{ color: 'var(--primary)' }} />
              <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Alumnos</h2>
            </div>
            {!loading && (
              <div style={{ display: 'flex', gap: '10px', fontSize: '0.85rem' }}>
                <span style={{ background: '#ecfdf5', color: '#065f46', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{alumnosPresentes} Presentes</span>
                <span style={{ background: '#fef2f2', color: '#991b1b', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{alumnosAusentes} Faltas</span>
                <span style={{ background: '#f3f4f6', color: '#374151', padding: '4px 10px', borderRadius: '12px', fontWeight: 600 }}>{alumnosSinMarcar} Sin marcar</span>
              </div>
            )}
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ background: '#fafafa' }}>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Alumno</th>
                  <th style={{ padding: '12px 20px', textAlign: 'left', borderBottom: '2px solid #eee' }}>Grupo</th>
                  <th style={{ padding: '12px 20px', textAlign: 'center', borderBottom: '2px solid #eee' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center' }}>Cargando...</td></tr>
                ) : alumnos.length === 0 ? (
                  <tr><td colSpan={3} style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>No hay alumnos asignados a grupos.</td></tr>
                ) : alumnos.map(al => (
                  <tr key={al.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '12px 20px' }}>
                      <strong style={{ display: 'block', color: '#374151' }}>{al.nombre}</strong>
                      <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{al.celular}</span>
                    </td>
                    <td style={{ padding: '12px 20px' }}>
                      <span style={{ fontWeight: 500 }}>{al.grupo_nombre}</span>
                      <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>Prof: {al.profesor_nombre || 'No asignado'}</div>
                    </td>
                    <td style={{ padding: '12px 20px', textAlign: 'center' }}>
                      {al.estado === 'presente' ? (
                        <span style={{ background: '#10b981', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Presente</span>
                      ) : al.estado === 'ausente' ? (
                        <span style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Falta</span>
                      ) : (
                        <span style={{ background: '#e5e7eb', color: '#6b7280', padding: '4px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 600 }}>Sin marcar</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  )
}
