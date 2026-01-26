'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGraduationCap, faPhone, faLock, faSignInAlt, faArrowLeft } from '@fortawesome/free-solid-svg-icons'

export default function LoginPage() {
  const router = useRouter()
  const [celular, setCelular] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ celular, password })
      })

      const data = await res.json()

      if (data.success) {
        router.push(data.redirect || '/alumno')
      } else {
        setError(data.error || 'Error al iniciar sesion')
      }
    } catch (err) {
      setError('Error de conexion. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--gradient-hero)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'var(--white)',
        borderRadius: 'var(--radius-lg)',
        padding: '50px 40px',
        maxWidth: '420px',
        width: '100%',
        boxShadow: 'var(--shadow-xl)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
            <FontAwesomeIcon icon={faGraduationCap} style={{ color: 'var(--primary)' }} />
          </div>
          <h1 style={{ fontSize: '1.8rem', marginBottom: '10px' }}>Bienvenido</h1>
          <p style={{ color: 'var(--gray)' }}>Inicia sesion en tu cuenta</p>
        </div>

        {error && (
          <div style={{
            background: '#FEE2E2',
            color: '#DC2626',
            padding: '12px 16px',
            borderRadius: 'var(--radius)',
            marginBottom: '20px',
            fontSize: '0.9rem'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 500,
              color: 'var(--dark-light)'
            }}>
              Numero de celular
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon
                icon={faPhone}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gray)'
                }}
              />
              <input
                type="tel"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                placeholder="5512345678"
                required
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 45px',
                  border: '2px solid var(--light)',
                  borderRadius: 'var(--radius)',
                  fontSize: '1rem',
                  transition: 'var(--transition)'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{
              display: 'block',
              marginBottom: '8px',
              fontWeight: 500,
              color: 'var(--dark-light)'
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <FontAwesomeIcon
                icon={faLock}
                style={{
                  position: 'absolute',
                  left: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: 'var(--gray)'
                }}
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Tu contraseña"
                style={{
                  width: '100%',
                  padding: '14px 18px 14px 45px',
                  border: '2px solid var(--light)',
                  borderRadius: 'var(--radius)',
                  fontSize: '1rem',
                  transition: 'var(--transition)'
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-lg btn-block"
            style={{ marginBottom: '20px' }}
          >
            {loading ? 'Iniciando...' : (
              <>
                <FontAwesomeIcon icon={faSignInAlt} /> Iniciar Sesion
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center' }}>
          <Link
            href="/"
            style={{
              color: 'var(--gray)',
              fontSize: '0.9rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} /> Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  )
}
