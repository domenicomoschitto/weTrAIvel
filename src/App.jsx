import { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { supabase, isConfigured } from './lib/supabase'
import Auth from './components/Auth'
import Layout from './components/Layout'
import Home from './pages/Home'
import TripView from './pages/TripView'
import StopView from './pages/StopView'

export const AppContext = createContext(null)
export function useApp() { return useContext(AppContext) }

export default function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isConfigured) { setLoading(false); return }
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  if (!isConfigured) return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🧳</div>
        <div className="auth-title">weTrAivel</div>
        <div className="auth-sub" style={{ marginBottom: 20 }}>Setup required</div>
        <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: '16px', fontSize: '0.85rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
          <p>Create a <code style={{ color: 'var(--primary)' }}>.env</code> file in <code style={{ color: 'var(--primary)' }}>travel-vault/</code> with:</p>
          <pre style={{ marginTop: 10, background: 'var(--bg-base)', padding: 12, borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.8rem', overflowX: 'auto' }}>
{`VITE_SUPABASE_URL=https://xxx.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key`}
          </pre>
          <p style={{ marginTop: 10 }}>Then run the SQL from <code style={{ color: 'var(--primary)' }}>SETUP.md</code> and restart the dev server.</p>
        </div>
      </div>
    </div>
  )

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="spinner" />
    </div>
  )

  if (!user) return <Auth />

  return (
    <AppContext.Provider value={{ user }}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="trip/:tripId" element={<TripView />} />
            <Route path="trip/:tripId/stop/:stopId" element={<StopView />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppContext.Provider>
  )
}
