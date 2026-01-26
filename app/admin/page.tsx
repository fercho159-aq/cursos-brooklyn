'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faUsers, faMoneyBill, faChartLine, faBook, faVideoSlash,
  faGraduationCap, faCalendarAlt, faClipboardList, faReceipt
} from '@fortawesome/free-solid-svg-icons'

interface Stats {
  totalAlumnos: number
  inscripcionesActivas: number
  pagosHoy: number
  pagosMes: number
  saldoPendiente: number
  totalLecciones?: number
  leccionesSinVideo?: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

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
      <div style={{ padding: '30px' }}>
        <p>Cargando estadisticas...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '30px' }}>
      <h1 style={{ marginBottom: '30px' }}>Dashboard</h1>

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <StatCard
          icon={faUsers}
          label="Total Alumnos"
          value={stats?.totalAlumnos || 0}
          color="var(--primary)"
        />
        <StatCard
          icon={faChartLine}
          label="Inscripciones Activas"
          value={stats?.inscripcionesActivas || 0}
          color="var(--accent)"
          gradient="linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))"
        />
        <StatCard
          icon={faMoneyBill}
          label="Pagos Hoy"
          value={`$${(stats?.pagosHoy || 0).toLocaleString()}`}
          color="var(--primary)"
        />
        <StatCard
          icon={faMoneyBill}
          label="Pagos del Mes"
          value={`$${(stats?.pagosMes || 0).toLocaleString()}`}
          color="var(--secondary)"
        />
        <StatCard
          icon={(stats?.leccionesSinVideo || 0) > 0 ? faVideoSlash : faBook}
          label="Lecciones sin Video"
          value={`${stats?.leccionesSinVideo || 0} / ${stats?.totalLecciones || 0}`}
          color={(stats?.leccionesSinVideo || 0) > 0 ? '#dc2626' : 'var(--accent)'}
          gradient={(stats?.leccionesSinVideo || 0) > 0
            ? 'linear-gradient(135deg, rgba(220, 38, 38, 0.1), rgba(239, 68, 68, 0.1))'
            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(52, 211, 153, 0.1))'}
          valueColor={(stats?.leccionesSinVideo || 0) > 0 ? '#dc2626' : undefined}
        />
      </div>

      {/* Quick Links */}
      <div style={{
        background: 'var(--white)',
        padding: '25px',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginBottom: '20px' }}>Acceso Rapido</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px'
        }}>
          <QuickLink href="/admin/usuarios" icon={faUsers} label="Usuarios" color="#3b82f6" />
          <QuickLink href="/admin/cursos" icon={faGraduationCap} label="Cursos" color="#8b5cf6" />
          <QuickLink href="/admin/horarios" icon={faCalendarAlt} label="Horarios" color="#06b6d4" />
          <QuickLink href="/admin/inscripciones" icon={faClipboardList} label="Inscripciones" color="#10b981" />
          <QuickLink href="/admin/pagos" icon={faMoneyBill} label="Pagos" color="#f59e0b" />
          <QuickLink href="/admin/gastos" icon={faReceipt} label="Gastos" color="#ef4444" />
          <QuickLink href="/admin/lecciones" icon={faBook} label="Lecciones" color="var(--primary)" badge={stats?.leccionesSinVideo} />
        </div>
      </div>

      {/* Info */}
      <div style={{
        background: 'var(--white)',
        padding: '25px',
        borderRadius: 'var(--radius)',
        boxShadow: 'var(--shadow)',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '10px' }}>Panel de Administracion</h3>
        <p style={{ color: 'var(--gray)', margin: 0 }}>
          Gestiona usuarios, cursos, inscripciones, pagos y contenido desde el menu lateral.
        </p>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color, gradient, valueColor }: {
  icon: typeof faUsers
  label: string
  value: string | number
  color: string
  gradient?: string
  valueColor?: string
}) {
  return (
    <div style={{
      background: 'var(--white)',
      padding: '25px',
      borderRadius: 'var(--radius)',
      boxShadow: 'var(--shadow)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{
          width: '50px',
          height: '50px',
          background: gradient || 'linear-gradient(135deg, rgba(250, 115, 21, 0.1), rgba(195, 65, 11, 0.1))',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: color
        }}>
          <FontAwesomeIcon icon={icon} />
        </div>
        <div>
          <p style={{ color: 'var(--gray)', fontSize: '0.9rem', margin: 0 }}>{label}</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0, color: valueColor }}>{value}</p>
        </div>
      </div>
    </div>
  )
}

function QuickLink({ href, icon, label, color, badge }: {
  href: string
  icon: typeof faUsers
  label: string
  color: string
  badge?: number
}) {
  return (
    <Link
      href={href}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
        padding: '20px 15px',
        background: '#f8f9fa',
        borderRadius: 'var(--radius)',
        textDecoration: 'none',
        color: 'var(--dark)',
        transition: 'all 0.2s',
        position: 'relative'
      }}
    >
      <div style={{
        width: '45px',
        height: '45px',
        borderRadius: '12px',
        background: `${color}15`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color
      }}>
        <FontAwesomeIcon icon={icon} style={{ fontSize: '1.2rem' }} />
      </div>
      <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{label}</span>
      {badge !== undefined && badge > 0 && (
        <span style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          background: '#dc2626',
          color: 'white',
          padding: '2px 6px',
          borderRadius: '10px',
          fontSize: '0.7rem',
          fontWeight: 600
        }}>
          {badge}
        </span>
      )}
    </Link>
  )
}
