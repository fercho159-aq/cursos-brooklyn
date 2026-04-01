'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardTeacher, faHome, faSignOutAlt, faTachometerAlt,
  faClipboardCheck, faBars, faTimes, faChevronRight
} from '@fortawesome/free-solid-svg-icons'
import './profesor.css'

interface Usuario {
  id: number
  nombre: string
  rol: string
}

const menuItems = [
  { href: '/profesor', icon: faTachometerAlt, label: 'Inicio', exact: true },
  { href: '/profesor/asistencia', icon: faClipboardCheck, label: 'Pase de Lista' },
]

export default function ProfesorLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        const data = await res.json()

        if (data.error || data.rol !== 'profesor') {
          router.push('/login')
          return
        }

        setUsuario(data)
      } catch {
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' })
    router.push('/login')
  }

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center',
        justifyContent: 'center', background: '#050505', color: '#fff'
      }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(234, 179, 8, 0.2)', borderTopColor: '#eab308', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <p style={{ marginLeft: '15px' }}>Iniciando entorno premium...</p>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div className="profesor-dashboard-container">
      
      {/* Animated Background Elements */}
      <div className="bg-orb orb-1"></div>
      <div className="bg-orb orb-2"></div>
      <div className="bg-orb orb-3"></div>
      <div className="bg-mesh"></div>

      {/* Sidebar Desktop */}
      <aside className="profesor-sidebar glass-panel" style={{
        width: sidebarOpen ? '280px' : '80px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex',
          alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', minHeight: '80px'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ background: 'linear-gradient(135deg, #eab308 0%, #d97706 100%)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(234, 179, 8, 0.3)' }}>
                <FontAwesomeIcon icon={faChalkboardTeacher} style={{ fontSize: '1.2rem', color: '#fff' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#fff', letterSpacing: '0.02em' }}>Brooklyn<span style={{ color: '#eab308' }}>.</span>Prof</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', color: '#9ca3af', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="hover-glow">
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '24px 16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: sidebarOpen ? '14px 20px' : '14px',
                borderRadius: '16px', textDecoration: 'none',
                color: active ? '#ffffff' : '#9ca3af',
                fontWeight: active ? 600 : 500,
                justifyContent: sidebarOpen ? 'flex-start' : 'center',
                position: 'relative'
              }} className={`nav-link ${active ? 'active-nav-link' : ''}`} title={!sidebarOpen ? item.label : undefined}>
                {active && <div style={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: '4px', background: '#eab308', borderRadius: '0 4px 4px 0', boxShadow: '0 0 10px #eab308' }} />}
                <FontAwesomeIcon icon={item.icon} style={{ width: '22px', fontSize: '1.2rem', color: active ? '#eab308' : '#6b7280' }} className="nav-icon" />
                {sidebarOpen && <span style={{ fontSize: '1.05rem' }}>{item.label}</span>}
                {sidebarOpen && active && <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 'auto', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }} />}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.2)' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ overflow: 'hidden', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontWeight: 800, fontSize: '1.1rem' }}>
                  {usuario?.nombre?.charAt(0) || 'P'}
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '0.95rem', margin: 0, color: '#fff', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{usuario?.nombre}</p>
                  <p style={{ color: '#9ca3af', fontSize: '0.8rem', margin: 0 }}>Profesor Titular</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/" className="hover-glow" style={{ color: '#9ca3af', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }} title="Ir al sitio"><FontAwesomeIcon icon={faHome} /></Link>
                <button onClick={handleLogout} className="hover-glow" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', cursor: 'pointer', color: '#ef4444', padding: '8px', borderRadius: '8px' }} title="Cerrar sesion">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e293b, #0f172a)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#eab308', fontWeight: 800, fontSize: '1.1rem' }}>
                  {usuario?.nombre?.charAt(0) || 'P'}
                </div>
               <Link href="/" className="hover-glow" style={{ color: '#9ca3af', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} title="Ir al sitio"><FontAwesomeIcon icon={faHome} /></Link>
               <button onClick={handleLogout} className="hover-glow" style={{ background: 'rgba(239, 68, 68, 0.1)', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '10px', borderRadius: '10px' }} title="Cerrar sesion"><FontAwesomeIcon icon={faSignOutAlt} /></button>
             </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="profesor-mobile-header" style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        zIndex: 99, padding: '0 15px', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: '#eab308' }} />
          <span style={{ fontWeight: 800, color: '#fff' }}>Brooklyn.Prof</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px', color: '#fff' }}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="glass-panel" style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, zIndex: 98, padding: '20px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', marginBottom: '10px', borderRadius: '16px', textDecoration: 'none',
                color: active ? '#fff' : '#9ca3af', background: active ? 'rgba(234, 179, 8, 0.1)' : 'rgba(255,255,255,0.05)', fontWeight: active ? 700 : 500, border: active ? '1px solid rgba(234, 179, 8, 0.3)' : '1px solid transparent'
              }}>
                <FontAwesomeIcon icon={item.icon} style={{ width: '20px', color: active ? '#eab308' : '#9ca3af' }} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      )}

      {/* Main Content */}
      <main className="profesor-main-content" style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '280px' : '80px', 
        transition: 'margin-left 0.5s cubic-bezier(0.16, 1, 0.3, 1)', 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1,
        color: '#ffffff'
      }}>
        <div className="content-fade-in" style={{ height: '100%' }}>
          {children}
        </div>
      </main>
    </div>
  )
}
