import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import AIChat from './AIChat'

const TABS = [
  { path: '/', label: 'Discover', icon: '🧭' },
  { path: '/trips', label: 'My Trips', icon: '🗺️' },
  { path: '/profile', label: 'Profile', icon: '👤' },
]

const TOP_LEVEL = ['/', '/trips', '/profile']

export default function Layout() {
  const navigate = useNavigate()
  const location = useLocation()
  const isTopLevel = TOP_LEVEL.includes(location.pathname)

  return (
    <>
      {/* Top navbar */}
      <nav className="navbar">
        {isTopLevel ? (
          <span className="navbar-logo">✈ Volare</span>
        ) : (
          <button className="btn-icon" onClick={() => navigate(-1)} title="Back" style={{ fontSize: '1.2rem' }}>
            ←
          </button>
        )}
        <span className="navbar-title" />
        <div style={{ width: 32 }} />
      </nav>

      <Outlet />
      <AIChat />

      {/* Bottom tab bar */}
      <nav className="bottom-tabs">
        {TABS.map(tab => (
          <button
            key={tab.path}
            className={`bottom-tab${location.pathname === tab.path ? ' active' : ''}`}
            onClick={() => navigate(tab.path)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </>
  )
}
