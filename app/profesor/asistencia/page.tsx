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
    setAsistencias(prev => ({
      ...prev,
      [id]: estado
    }))
  }

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

  if (loading) return <div style={{ padding: '30px' }}>Cargando alumnos...</div>

  if (!grupo) {
    return (
      <div style={{ padding: '30px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--gray)' }}>Sin Grupo</h2>
        <p>No tienes ningún grupo asignado actualmente, por lo que no puedes pasar lista.</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0' }}>Pase de Lista</h1>
          <p style={{ margin: 0, color: 'var(--gray)' }}>
            Grupo: <strong>{grupo.nombre}</strong> • {new Date().toLocaleDateString('es-MX')}
          </p>
        </div>
        <button
          onClick={guardarAsistencia}
          disabled={saving || Object.keys(asistencias).length === 0}
          style={{
            padding: '12px 24px', background: 'var(--primary)', color: 'white',
            border: 'none', borderRadius: 'var(--radius)', fontWeight: 600,
            cursor: (saving || Object.keys(asistencias).length === 0) ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '8px', opacity: saving ? 0.7 : 1
          }}
        >
          <FontAwesomeIcon icon={faSave} />
          {saving ? 'Guardando...' : 'Guardar Asistencia'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', background: 'var(--white)', padding: '15px', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow-sm)' }}>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
          <div style={{ color: 'var(--gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{alumnos.length}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center', borderRight: '1px solid #eee' }}>
          <div style={{ color: 'var(--gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Presentes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#10b981' }}>{presentes}</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ color: 'var(--gray)', fontSize: '0.85rem', textTransform: 'uppercase', fontWeight: 600 }}>Ausentes</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#ef4444' }}>{ausentes}</div>
        </div>
      </div>

      <div style={{ background: 'var(--white)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', overflow: 'hidden' }}>
        {alumnos.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--gray)' }}>
            <FontAwesomeIcon icon={faUsers} style={{ fontSize: '2rem', marginBottom: '10px', color: '#ccc' }} />
            <p>No hay alumnos inscritos en este grupo.</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa', borderBottom: '2px solid #eee' }}>
                <th style={{ padding: '15px', textAlign: 'left' }}>Alumno</th>
                <th style={{ padding: '15px', textAlign: 'center', width: '200px' }}>Asistencia</th>
              </tr>
            </thead>
            <tbody>
              {alumnos.map(alumno => {
                const estado = asistencias[alumno.id];
                return (
                  <tr key={alumno.id} style={{ borderBottom: '1px solid #eee', transition: 'background 0.2s', background: estado === 'presente' ? '#ecfdf5' : estado === 'ausente' ? '#fef2f2' : 'transparent' }}>
                    <td style={{ padding: '15px' }}>
                      <strong style={{ display: 'block', fontSize: '1.05rem', color: '#1f2937' }}>{alumno.nombre}</strong>
                      <span style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{alumno.celular}</span>
                    </td>
                    <td style={{ padding: '15px', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                          onClick={() => marcar(alumno.id, 'presente')}
                          style={{
                            padding: '8px 15px', border: 'none', borderRadius: '50px',
                            background: estado === 'presente' ? '#10b981' : '#e5e7eb',
                            color: estado === 'presente' ? 'white' : '#6b7280',
                            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} />
                          Presente
                        </button>
                        <button
                          onClick={() => marcar(alumno.id, 'ausente')}
                          style={{
                            padding: '8px 15px', border: 'none', borderRadius: '50px',
                            background: estado === 'ausente' ? '#ef4444' : '#e5e7eb',
                            color: estado === 'ausente' ? 'white' : '#6b7280',
                            fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <FontAwesomeIcon icon={faTimesCircle} />
                          Falta
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
