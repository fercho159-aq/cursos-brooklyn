'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faChalkboardTeacher, faHome, faSignOutAlt, faTachometerAlt,
  faClipboardCheck, faBars, faTimes, faChevronRight
} from '@fortawesome/free-solid-svg-icons'

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
        justifyContent: 'center', background: 'var(--light)'
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f6f9fc 0%, #eef2f5 100%)', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar Desktop */}
      <aside className="profesor-sidebar" style={{
        width: sidebarOpen ? '260px' : '80px',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderRight: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '4px 0 24px rgba(0,0,0,0.02)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px', borderBottom: '1px solid #eee', display: 'flex',
          alignItems: 'center', justifyContent: sidebarOpen ? 'space-between' : 'center', minHeight: '70px'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faChalkboardTeacher} style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Profesor</span>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)' }}>
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '15px 10px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                padding: sidebarOpen ? '14px 18px' : '14px', marginBottom: '8px',
                borderRadius: '12px', textDecoration: 'none',
                color: active ? '#ffffff' : '#4b5563',
                background: active ? 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)' : 'transparent',
                fontWeight: active ? 600 : 500,
                boxShadow: active ? '0 4px 12px rgba(249, 115, 22, 0.25)' : 'none',
                transition: 'all 0.3s ease', justifyContent: sidebarOpen ? 'flex-start' : 'center',
                position: 'relative', overflow: 'hidden'
              }} className={active ? 'active-nav-link' : 'nav-link'} title={!sidebarOpen ? item.label : undefined}>
                <FontAwesomeIcon icon={item.icon} style={{ width: '22px', fontSize: '1.1rem', color: active ? '#ffffff' : '#9ca3af', transition: 'all 0.3s ease' }} className="nav-icon" />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && <FontAwesomeIcon icon={faChevronRight} style={{ marginLeft: 'auto', fontSize: '0.8rem', opacity: 0.8 }} />}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div style={{ padding: '15px', borderTop: '1px solid #eee', background: '#fafafa' }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{usuario?.nombre}</p>
                <p style={{ color: 'var(--gray)', fontSize: '0.75rem', margin: 0 }}>Profesor</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/" style={{ color: 'var(--gray)', padding: '5px' }} title="Ir al sitio"><FontAwesomeIcon icon={faHome} /></Link>
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: '5px' }} title="Cerrar sesion">
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            </div>
          ) : (
             <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
               <Link href="/" style={{ color: 'var(--gray)', padding: '5px' }} title="Ir al sitio"><FontAwesomeIcon icon={faHome} /></Link>
               <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: '5px' }} title="Cerrar sesion"><FontAwesomeIcon icon={faSignOutAlt} /></button>
             </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div style={{
        display: 'none', position: 'fixed', top: 0, left: 0, right: 0, height: '60px',
        background: 'var(--white)', boxShadow: 'var(--shadow-sm)', zIndex: 99,
        padding: '0 15px', alignItems: 'center', justifyContent: 'space-between'
      }} className="profesor-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FontAwesomeIcon icon={faChalkboardTeacher} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700 }}>Profesor</span>
        </div>
        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}>
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div style={{ position: 'fixed', top: '60px', left: 0, right: 0, bottom: 0, background: 'var(--white)', zIndex: 98, padding: '20px', overflowY: 'auto' }} className="mobile-menu">
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link key={item.href} href={item.href} onClick={() => setMobileMenuOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: '12px', padding: '15px', marginBottom: '5px', borderRadius: 'var(--radius)', textDecoration: 'none',
                color: active ? 'var(--primary)' : 'var(--dark)', background: active ? 'rgba(250, 115, 21, 0.1)' : 'transparent', fontWeight: active ? 600 : 400
              }}>
                <FontAwesomeIcon icon={item.icon} style={{ width: '20px' }} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p style={{ fontWeight: 600, marginBottom: '10px' }}>{usuario?.nombre}</p>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', padding: '10px 0' }}>
              <FontAwesomeIcon icon={faSignOutAlt} /> Cerrar sesion
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="profesor-main-content" style={{ 
        flex: 1, 
        marginLeft: sidebarOpen ? '260px' : '80px', 
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)', 
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}>
        <div className="content-fade-in">
          {children}
        </div>
      </main>

      {/* Global CSS for Premium Animations and Styles */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');

        .profesor-main-content {
          font-family: 'Inter', sans-serif;
        }

        .content-fade-in {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .nav-link:hover {
          background: rgba(249, 115, 22, 0.08) !important;
          color: #ea580c !important;
          transform: translateX(4px);
        }

        .nav-link:hover .nav-icon {
          color: #ea580c !important;
          transform: scale(1.1);
        }
        
        .active-nav-link {
          transform: scale(1.02);
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7) !important;
          backdrop-filter: blur(20px) !important;
          -webkit-backdrop-filter: blur(20px) !important;
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.04), inset 0 0 0 1px rgba(255,255,255,0.5) !important;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1) !important;
          border-radius: 24px !important;
        }
        
        .glass-card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08), inset 0 0 0 1px rgba(255,255,255,0.8) !important;
        }

        .animated-button {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          position: relative;
          overflow: hidden;
        }
        
        .animated-button:hover:not(:disabled) {
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
        
        .animated-button:active:not(:disabled) {
          transform: translateY(1px) scale(0.98) !important;
        }

        .badge-pulse {
          animation: pulse-soft 2s infinite;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse-soft {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }

        /* Beautiful Scrollbar for Professor Area */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }

        @media (max-width: 768px) {
          .profesor-sidebar { display: none !important; }
          .profesor-mobile-header { display: flex !important; background: rgba(255,255,255,0.9) !important; backdrop-filter: blur(10px); }
          .profesor-main-content { margin-left: 0 !important; padding-top: 60px; }
        }
      `}</style>
    </div>
  )
}
