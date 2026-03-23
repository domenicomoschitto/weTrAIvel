import { useState } from 'react'
import { supabase } from '../lib/supabase'

// Input style reused for email + password
const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  background: 'rgba(255,255,255,0.1)',
  border: '1px solid rgba(255,255,255,0.2)',
  borderRadius: 10,
  color: '#fff',
  fontSize: '0.875rem',
  fontFamily: 'Inter, system-ui, sans-serif',
  outline: 'none',
  transition: 'border-color 0.15s',
}

const labelStyle = {
  display: 'block',
  marginBottom: 6,
  fontSize: '0.72rem',
  fontWeight: 700,
  color: 'rgba(255,255,255,0.6)',
  textTransform: 'uppercase',
  letterSpacing: '0.07em',
  fontFamily: 'Syne, system-ui, sans-serif',
}

export default function Auth() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  async function handleGoogle() {
    setError(null)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setLoading(true)
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setError(error.message)
    } else {
      const { error } = await supabase.auth.signUp({ email, password })
      if (error) setError(error.message)
      else setSuccess('Check your email to confirm your account.')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* ── Background collage ── */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
      }}>
        {/* Left — Italian cobblestone street, full height */}
        <img
          src="https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=900&q=80"
          alt=""
          aria-hidden
          style={{ gridRow: '1 / 3', width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Top-right — Airport terminal at dusk */}
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=75"
          alt=""
          aria-hidden
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
        {/* Bottom-right — Alpine train in mountains */}
        <img
          src="https://images.unsplash.com/photo-1527838832700-5059252407fa?w=800&q=75"
          alt=""
          aria-hidden
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </div>

      {/* Dark overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.82) 100%)',
      }} />

      {/* ── Glass card ── */}
      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 380,
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(28px) saturate(160%)',
        WebkitBackdropFilter: 'blur(28px) saturate(160%)',
        border: '1px solid rgba(255,255,255,0.14)',
        borderRadius: 24,
        padding: '36px 32px',
        boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
      }}>

        {/* Logo banner */}
        <div style={{ borderRadius: 14, overflow: 'hidden', marginBottom: 0 }}>
          <img
            src="/volare_logo.png"
            alt=""
            aria-hidden
            style={{ width: '100%', height: 'auto', display: 'block' }}
          />
        </div>

        {/* Title + subtitle — title half-overlays the image bottom */}
        <div style={{ textAlign: 'center', marginTop: '-1.1rem', marginBottom: 20 }}>
          <div style={{
            fontFamily: 'Syne, system-ui, sans-serif',
            fontSize: '2.8rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.03em',
            marginBottom: 4,
            textShadow: '0 0 0 2px rgba(0,0,0,0.8), 0 2px 16px rgba(0,0,0,0.9), -1px -1px 0 rgba(0,0,0,0.6), 1px -1px 0 rgba(0,0,0,0.6), -1px 1px 0 rgba(0,0,0,0.6), 1px 1px 0 rgba(0,0,0,0.6)',
          }}>
            Volare
          </div>
          <div style={{
            fontSize: '0.82rem',
            color: 'rgba(255,255,255,0.6)',
            letterSpacing: '0.02em',
          }}>
            {mode === 'login' ? 'Your AI Powered Travel Assistant' : 'Create an account to get started.'}
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ background: 'rgba(220,38,38,0.18)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: '#fca5a5', marginBottom: 16 }}>
            {error}
          </div>
        )}
        {/* Success */}
        {success && (
          <div style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.28)', borderRadius: 10, padding: '10px 14px', fontSize: '0.85rem', color: '#6ee7b7', marginBottom: 16 }}>
            {success}
          </div>
        )}

        {/* Google button */}
        <button
          type="button"
          onClick={handleGoogle}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            padding: '11px 18px', marginBottom: 16,
            background: 'rgba(255,255,255,0.92)',
            border: '1px solid rgba(255,255,255,0.25)',
            borderRadius: 10,
            color: '#1f1f1f',
            fontSize: '0.875rem', fontWeight: 600,
            fontFamily: 'Inter, system-ui, sans-serif',
            cursor: 'pointer', transition: 'background 0.15s',
          }}
          onMouseOver={e => { e.currentTarget.style.background = '#fff' }}
          onMouseOut={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.92)' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>or</span>
          <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={labelStyle}>Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(96,165,250,0.7)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                style={inputStyle}
                onFocus={e => { e.target.style.borderColor = 'rgba(96,165,250,0.7)' }}
                onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.2)' }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '11px 18px', marginTop: 4,
                background: '#2563eb',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: '0.875rem', fontWeight: 700,
                fontFamily: 'Syne, system-ui, sans-serif',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'background 0.15s',
              }}
              onMouseOver={e => { if (!loading) e.currentTarget.style.background = '#1d4ed8' }}
              onMouseOut={e => { e.currentTarget.style.background = '#2563eb' }}
            >
              {loading
                ? <div className="spinner" style={{ borderTopColor: '#fff', borderColor: 'rgba(255,255,255,0.3)' }} />
                : mode === 'login' ? 'Sign In' : 'Create Account'}
            </button>
          </div>
        </form>

        {/* Toggle */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.85rem', color: 'rgba(255,255,255,0.45)' }}>
          {mode === 'login' ? (
            <>Don't have an account?{' '}
              <button onClick={() => setMode('signup')} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit' }}>
                Sign up
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button onClick={() => setMode('login')} style={{ background: 'none', border: 'none', color: '#60a5fa', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', fontFamily: 'inherit' }}>
                Sign in
              </button>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
