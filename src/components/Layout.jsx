import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import AIChat from './AIChat'

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isHome = location.pathname === '/'

  async function signOut() {
    await supabase.auth.signOut()
  }

  return (
    <>
      <nav className="navbar">
        {isHome ? (
          <span className="navbar-logo">🧳 weTrAivel</span>
        ) : (
          <button className="btn-icon" onClick={() => navigate(-1)} title="Back" style={{ fontSize: '1.2rem' }}>
            ←
          </button>
        )}

        <span className="navbar-title" style={isHome ? { textAlign: 'right', flex: 0 } : {}}>
          {isHome ? '' : ''}
        </span>

        <button
          className="btn-icon"
          onClick={signOut}
          title="Sign out"
          style={{ fontSize: '1rem' }}
        >
          ⏻
        </button>
      </nav>

      <Outlet />
      <AIChat />
    </>
  )
}
