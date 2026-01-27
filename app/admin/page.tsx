'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faMoneyBill, faChartLine, faBook, faVideoSlash,
  faGraduationCap, faCalendarAlt, faClipboardList, faReceipt,
  faArrowUp, faArrowDown, faExclamationTriangle, faCheckCircle,
  faPhone, faArrowRight
} from '@fortawesome/free-solid-svg-icons'

interface UltimoPago {
  id: number
  monto: number
  fecha: string
  metodo: string
  alumno: string
}

interface Deudor {
  id: number
  alumno: string
  celular: string
  curso: string
  saldo: number
}

interface CursoStats {
  curso: string
  total: number
}

interface Stats {
  totalAlumnos: number
  inscripcionesActivas: number
  pagosHoy: number
  pagosMes: number
  gastosMes: number
  balanceMes: number
  saldoPendienteTotal: number
  totalLecciones: number
  leccionesSinVideo: number
  alumnosSinPagoMes: number
  ultimosPagos: UltimoPago[]
  topDeudores: Deudor[]
  cursosPorInscripciones: CursoStats[]
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  const mesActual = MESES[new Date().getMonth()]

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error fetching stats:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <p style={{ color: 'var(--gray)' }}>Cargando dashboard...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ margin: 0, marginBottom: '5px' }}>Dashboard</h1>
        <p style={{ color: 'var(--gray)', margin: 0 }}>{mesActual} {new Date().getFullYear()}</p>
      </div>

      {/* Stats principales */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard
          icon={faUsers}
          label="Total Alumnos"
          value={stats?.totalAlumnos || 0}
          color="#3b82f6"
          bgColor="rgba(59, 130, 246, 0.1)"
        />
        <StatCard
          icon={faClipboardList}
          label="Inscripciones Activas"
          value={stats?.inscripcionesActivas || 0}
          color="#10b981"
          bgColor="rgba(16, 185, 129, 0.1)"
        />
        <StatCard
          icon={faExclamationTriangle}
          label="Sin pago este mes"
          value={stats?.alumnosSinPagoMes || 0}
          color={stats?.alumnosSinPagoMes ? '#dc2626' : '#10b981'}
          bgColor={stats?.alumnosSinPagoMes ? 'rgba(220, 38, 38, 0.1)' : 'rgba(16, 185, 129, 0.1)'}
          href="/admin/pagos"
        />
        <StatCard
          icon={faMoneyBill}
          label="Por cobrar"
          value={`$${(stats?.saldoPendienteTotal || 0).toLocaleString()}`}
          color="#f59e0b"
          bgColor="rgba(245, 158, 11, 0.1)"
        />
      </div>

      {/* Finanzas del mes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Ingresos vs Gastos */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '25px'
        }}>
          <h3 style={{ margin: 0, marginBottom: '20px', fontSize: '1rem', color: 'var(--gray)' }}>
            Finanzas de {mesActual}
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FontAwesomeIcon icon={faArrowUp} style={{ color: '#10b981' }} />
                </div>
                <span>Ingresos</span>
              </div>
              <span style={{ fontWeight: 700, color: '#10b981', fontSize: '1.2rem' }}>
                ${(stats?.pagosMes || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '8px',
                  background: 'rgba(220, 38, 38, 0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <FontAwesomeIcon icon={faArrowDown} style={{ color: '#dc2626' }} />
                </div>
                <span>Gastos</span>
              </div>
              <span style={{ fontWeight: 700, color: '#dc2626', fontSize: '1.2rem' }}>
                ${(stats?.gastosMes || 0).toLocaleString()}
              </span>
            </div>
            <div style={{ borderTop: '2px solid #eee', paddingTop: '15px', marginTop: '5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Balance</span>
                <span style={{
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  color: (stats?.balanceMes || 0) >= 0 ? '#10b981' : '#dc2626'
                }}>
                  ${(stats?.balanceMes || 0).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Pagos de hoy */}
        <div style={{
          background: 'linear-gradient(135deg, var(--primary) 0%, #c3410b 100%)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          padding: '25px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0, marginBottom: '10px', fontSize: '1rem', opacity: 0.9 }}>
            Recaudado Hoy
          </h3>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '10px' }}>
            ${(stats?.pagosHoy || 0).toLocaleString()}
          </div>
          <Link href="/admin/pagos" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: 'white',
            textDecoration: 'none',
            opacity: 0.9,
            fontSize: '0.9rem'
          }}>
            Registrar pago <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        </div>
      </div>

      {/* Contenido principal en dos columnas */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        {/* Ultimos pagos */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Ultimos Pagos</h3>
            <Link href="/admin/pagos" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Ver todos
            </Link>
          </div>
          <div>
            {stats?.ultimosPagos && stats.ultimosPagos.length > 0 ? (
              stats.ultimosPagos.map((pago, idx) => (
                <div key={pago.id} style={{
                  padding: '15px 20px',
                  borderBottom: idx < stats.ultimosPagos.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{pago.alumno}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                      {new Date(pago.fecha).toLocaleDateString('es-MX')} - {pago.metodo}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#10b981' }}>
                    +${pago.monto.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>
                No hay pagos registrados
              </div>
            )}
          </div>
        </div>

        {/* Mayores deudores */}
        <div style={{
          background: 'var(--white)',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)',
          overflow: 'hidden'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #eee',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, fontSize: '1rem' }}>Mayores Saldos Pendientes</h3>
            <Link href="/admin/pagos" style={{ color: 'var(--primary)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Seguimiento
            </Link>
          </div>
          <div>
            {stats?.topDeudores && stats.topDeudores.length > 0 ? (
              stats.topDeudores.map((deudor, idx) => (
                <div key={deudor.id} style={{
                  padding: '15px 20px',
                  borderBottom: idx < stats.topDeudores.length - 1 ? '1px solid #f3f4f6' : 'none',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: 500 }}>{deudor.alumno}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--gray)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {deudor.curso}
                      {deudor.celular && (
                        <>
                          <span style={{ opacity: 0.5 }}>|</span>
                          <FontAwesomeIcon icon={faPhone} style={{ fontSize: '0.7rem' }} />
                          {deudor.celular}
                        </>
                      )}
                    </div>
                  </div>
                  <div style={{ fontWeight: 700, color: '#dc2626' }}>
                    ${deudor.saldo.toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: 'var(--gray)' }}>
                <FontAwesomeIcon icon={faCheckCircle} style={{ fontSize: '2rem', color: '#10b981', marginBottom: '10px', display: 'block' }} />
                Todos los saldos estan liquidados
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acceso rapido y lecciones */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px'
      }}>
        {/* Acceso Rapido */}
        <div style={{
          background: 'var(--white)',
          padding: '25px',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>Acceso Rapido</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
            gap: '12px'
          }}>
            <QuickLink href="/admin/usuarios" icon={faUsers} label="Usuarios" color="#3b82f6" />
            <QuickLink href="/admin/cursos" icon={faGraduationCap} label="Cursos" color="#8b5cf6" />
            <QuickLink href="/admin/horarios" icon={faCalendarAlt} label="Horarios" color="#06b6d4" />
            <QuickLink href="/admin/inscripciones" icon={faClipboardList} label="Inscripciones" color="#10b981" />
            <QuickLink href="/admin/pagos" icon={faMoneyBill} label="Pagos" color="#f59e0b" />
            <QuickLink href="/admin/gastos" icon={faReceipt} label="Gastos" color="#ef4444" />
          </div>
        </div>

        {/* Estado de lecciones */}
        <div style={{
          background: 'var(--white)',
          padding: '25px',
          borderRadius: 'var(--radius)',
          boxShadow: 'var(--shadow)'
        }}>
          <h3 style={{ marginBottom: '20px', fontSize: '1rem' }}>Contenido del Curso</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              background: (stats?.leccionesSinVideo || 0) > 0
                ? 'rgba(220, 38, 38, 0.1)'
                : 'rgba(16, 185, 129, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FontAwesomeIcon
                icon={(stats?.leccionesSinVideo || 0) > 0 ? faVideoSlash : faBook}
                style={{
                  fontSize: '1.5rem',
                  color: (stats?.leccionesSinVideo || 0) > 0 ? '#dc2626' : '#10b981'
                }}
              />
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 700 }}>
                {stats?.totalLecciones || 0}
              </div>
              <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Lecciones totales</div>
              {(stats?.leccionesSinVideo || 0) > 0 && (
                <div style={{ color: '#dc2626', fontSize: '0.85rem', marginTop: '5px' }}>
                  {stats?.leccionesSinVideo} sin video
                </div>
              )}
            </div>
          </div>
          <Link href="/admin/lecciones" style={{
            display: 'block',
            marginTop: '20px',
            padding: '12px',
            background: '#f8f9fa',
            borderRadius: 'var(--radius)',
            textAlign: 'center',
            textDecoration: 'none',
            color: 'var(--dark)',
            fontWeight: 500,
            fontSize: '0.9rem'
          }}>
            Gestionar Lecciones
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, bgColor, href }: {
  icon: typeof faUsers
  label: string
  value: string | number
  color: string
  bgColor: string
  href?: string
}) {
  const content = (
    <div style={{
      background: 'var(--white)',
      padding: '20px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      cursor: href ? 'pointer' : 'default',
      transition: 'transform 0.2s'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: bgColor,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        flexShrink: 0
      }}>
        <FontAwesomeIcon icon={icon} style={{ fontSize: '1.2rem' }} />
      </div>
      <div>
        <p style={{ color: 'var(--gray)', fontSize: '0.85rem', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: color }}>{value}</p>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href} style={{ textDecoration: 'none' }}>{content}</Link>
  }
  return content
}

function QuickLink({ href, icon, label, color }: {
  href: string
  icon: typeof faUsers
  label: string
  color: string
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        padding: '15px 10px',
        background: '#f8f9fa',
        borderRadius: 'var(--radius)',
        textDecoration: 'none',
        color: 'var(--dark)',
        transition: 'all 0.2s'
      }}
    >
      <div style={{
        width: '40px',
        height: '40px',
        borderRadius: '10px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <FontAwesomeIcon icon={icon} />
      </div>
      <span style={{ fontSize: '0.8rem', fontWeight: 500 }}>{label}</span>
    </Link>
  )
}
