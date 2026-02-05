'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faGraduationCap, faHome, faSignOutAlt, faTachometerAlt,
  faUsers, faBook, faCalendarAlt, faClipboardList,
  faBalanceScale, faBars, faTimes, faChevronRight,
  faListCheck
} from '@fortawesome/free-solid-svg-icons'

interface Usuario {
  id: number
  nombre: string
  rol: string
}

const menuItems = [
  { href: '/admin', icon: faTachometerAlt, label: 'Dashboard', exact: true },
  { href: '/admin/usuarios', icon: faUsers, label: 'Usuarios' },
  { href: '/admin/cursos', icon: faGraduationCap, label: 'Cursos' },
  { href: '/admin/horarios', icon: faCalendarAlt, label: 'Horarios' },
  { href: '/admin/inscripciones', icon: faClipboardList, label: 'Inscripciones' },
  { href: '/admin/finanzas', icon: faBalanceScale, label: 'Finanzas' },
  { href: '/admin/lecciones', icon: faBook, label: 'Lecciones' },
  { href: '/admin/pendientes', icon: faListCheck, label: 'Pendientes' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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

        if (data.error || data.rol !== 'admin') {
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
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--light)'
      }}>
        <p>Cargando...</p>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--light)', display: 'flex' }}>
      {/* Sidebar Desktop */}
      <aside className="admin-sidebar" style={{
        width: sidebarOpen ? '250px' : '70px',
        background: 'var(--white)',
        boxShadow: 'var(--shadow)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s ease',
        position: 'fixed',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 100,
        overflow: 'hidden'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: '20px',
          borderBottom: '1px solid #eee',
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          minHeight: '70px'
        }}>
          {sidebarOpen && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FontAwesomeIcon icon={faGraduationCap} style={{ fontSize: '1.5rem', color: 'var(--primary)' }} />
              <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Admin</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              color: 'var(--gray)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        {/* Menu Items */}
        <nav style={{ flex: 1, padding: '15px 10px', overflowY: 'auto' }}>
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: sidebarOpen ? '12px 15px' : '12px',
                  marginBottom: '5px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  color: active ? 'var(--primary)' : 'var(--dark)',
                  background: active ? 'rgba(250, 115, 21, 0.1)' : 'transparent',
                  fontWeight: active ? 600 : 400,
                  transition: 'all 0.2s',
                  justifyContent: sidebarOpen ? 'flex-start' : 'center'
                }}
                title={!sidebarOpen ? item.label : undefined}
              >
                <FontAwesomeIcon
                  icon={item.icon}
                  style={{
                    width: '20px',
                    color: active ? 'var(--primary)' : 'var(--gray)'
                  }}
                />
                {sidebarOpen && <span>{item.label}</span>}
                {sidebarOpen && active && (
                  <FontAwesomeIcon
                    icon={faChevronRight}
                    style={{ marginLeft: 'auto', fontSize: '0.75rem' }}
                  />
                )}
              </Link>
            )
          })}
        </nav>

        {/* User Section */}
        <div style={{
          padding: '15px',
          borderTop: '1px solid #eee',
          background: '#fafafa'
        }}>
          {sidebarOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: 600, fontSize: '0.9rem', margin: 0, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                  {usuario?.nombre}
                </p>
                <p style={{ color: 'var(--gray)', fontSize: '0.75rem', margin: 0 }}>Administrador</p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link href="/" style={{ color: 'var(--gray)', padding: '5px' }} title="Ir al sitio">
                  <FontAwesomeIcon icon={faHome} />
                </Link>
                <button
                  onClick={handleLogout}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: '5px' }}
                  title="Cerrar sesion"
                >
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
              <Link href="/" style={{ color: 'var(--gray)', padding: '5px' }} title="Ir al sitio">
                <FontAwesomeIcon icon={faHome} />
              </Link>
              <button
                onClick={handleLogout}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gray)', padding: '5px' }}
                title="Cerrar sesion"
              >
                <FontAwesomeIcon icon={faSignOutAlt} />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <div style={{
        display: 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'var(--white)',
        boxShadow: 'var(--shadow-sm)',
        zIndex: 99,
        padding: '0 15px',
        alignItems: 'center',
        justifyContent: 'space-between'
      }} className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <FontAwesomeIcon icon={faGraduationCap} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700 }}>Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '10px' }}
        >
          <FontAwesomeIcon icon={mobileMenuOpen ? faTimes : faBars} />
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '60px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--white)',
            zIndex: 98,
            padding: '20px',
            overflowY: 'auto'
          }}
          className="mobile-menu"
        >
          {menuItems.map((item) => {
            const active = isActive(item.href, item.exact)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '15px',
                  marginBottom: '5px',
                  borderRadius: 'var(--radius)',
                  textDecoration: 'none',
                  color: active ? 'var(--primary)' : 'var(--dark)',
                  background: active ? 'rgba(250, 115, 21, 0.1)' : 'transparent',
                  fontWeight: active ? 600 : 400
                }}
              >
                <FontAwesomeIcon icon={item.icon} style={{ width: '20px' }} />
                <span>{item.label}</span>
              </Link>
            )
          })}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
            <p style={{ fontWeight: 600, marginBottom: '10px' }}>{usuario?.nombre}</p>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#dc2626',
                padding: '10px 0'
              }}
            >
              <FontAwesomeIcon icon={faSignOutAlt} />
              Cerrar sesion
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="admin-main-content" style={{
        flex: 1,
        marginLeft: sidebarOpen ? '250px' : '70px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }}>
        {children}
      </main>

      {/* CSS for mobile */}
      <style jsx global>{`
        @media (max-width: 768px) {
          .admin-sidebar {
            display: none !important;
          }
          .admin-mobile-header {
            display: flex !important;
          }
          .admin-main-content {
            margin-left: 0 !important;
            padding-top: 60px;
          }
        }
      `}</style>
    </div>
  )
}
