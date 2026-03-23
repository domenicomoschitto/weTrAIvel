import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'
import { getPlaceImage } from '../data/places'

const BADGES = [
  { id: 'first-trip', icon: '🗺️', name: 'First Trip', desc: 'Plan your first trip', threshold: 1, stat: 'trips' },
  { id: 'explorer', icon: '🧭', name: 'Explorer', desc: '3 trips planned', threshold: 3, stat: 'trips' },
  { id: 'globetrotter', icon: '🌍', name: 'Globetrotter', desc: '3 countries visited', threshold: 3, stat: 'countries' },
  { id: 'city-hopper', icon: '🏙️', name: 'City Hopper', desc: '5 cities discovered', threshold: 5, stat: 'cities' },
  { id: 'jet-setter', icon: '✈️', name: 'Jet-setter', desc: '10 trips planned', threshold: 10, stat: 'trips' },
  { id: 'world-citizen', icon: '🌐', name: 'World Citizen', desc: '5 countries visited', threshold: 5, stat: 'countries' },
]

export default function Profile() {
  const { user } = useApp()
  const [stats, setStats] = useState({ trips: 0, countries: 0, cities: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadStats() }, [])

  async function loadStats() {
    setLoading(true)
    const { data: trips } = await supabase.from('trips').select('id')
    const { data: stops } = await supabase.from('stops').select('name')

    const tripCount = trips?.length || 0
    const cities = stops || []

    const countryCodes = new Set()
    const cityNames = new Set()
    for (const stop of cities) {
      const place = getPlaceImage(stop.name)
      if (place?.country_code) countryCodes.add(place.country_code)
      cityNames.add(stop.name.toLowerCase())
    }

    setStats({
      trips: tripCount,
      countries: countryCodes.size,
      cities: cityNames.size,
    })
    setLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const name = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Traveller'
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const email = user?.email || ''

  const earnedBadges = BADGES.filter(b => stats[b.stat] >= b.threshold)

  return (
    <div className="page page-tabbed" style={{ paddingTop: 28 }}>

      {/* Profile header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div className="profile-avatar">{initials}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em', marginBottom: 2 }}>
            {name}
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {email}
          </div>
          <div style={{ marginTop: 6 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, background: 'var(--primary-dim)', color: 'var(--primary)', padding: '2px 8px', borderRadius: 10 }}>
              ✈ Volare Traveller
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
          <div className="spinner" />
        </div>
      ) : (
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <div className="stat-card">
            <div className="stat-number">{stats.trips}</div>
            <div className="stat-label">Trips</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.countries}</div>
            <div className="stat-label">Countries</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{stats.cities}</div>
            <div className="stat-label">Cities</div>
          </div>
        </div>
      )}

      {/* Badges */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', marginBottom: 14 }}>
          Achievements
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
          {BADGES.map(badge => {
            const earned = stats[badge.stat] >= badge.threshold
            return (
              <div key={badge.id} className={`badge${earned ? ' earned' : ''}`} title={badge.desc}>
                <div className="badge-icon" style={{ opacity: earned ? 1 : 0.4 }}>
                  {badge.icon}
                </div>
                <div className="badge-name" style={{ color: earned ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {badge.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Menu */}
      <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', marginBottom: 10 }}>
        Account
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 28 }}>
        <div className="profile-menu-item" style={{ opacity: 0.5, cursor: 'default' }}>
          <span className="menu-icon">⚙️</span>
          <div className="menu-text">
            <div className="menu-label">Settings</div>
            <div className="menu-sub">Coming soon</div>
          </div>
          <span className="menu-arrow">›</span>
        </div>
        <div className="profile-menu-item" style={{ opacity: 0.5, cursor: 'default' }}>
          <span className="menu-icon">🔔</span>
          <div className="menu-text">
            <div className="menu-label">Notifications</div>
            <div className="menu-sub">Coming soon</div>
          </div>
          <span className="menu-arrow">›</span>
        </div>
        <button className="profile-menu-item" onClick={signOut} style={{ color: 'var(--danger)' }}>
          <span className="menu-icon">⏻</span>
          <div className="menu-text">
            <div className="menu-label" style={{ color: 'var(--danger)' }}>Sign Out</div>
          </div>
          <span className="menu-arrow">›</span>
        </button>
      </div>

      {/* Version */}
      <div style={{ textAlign: 'center', fontSize: '0.72rem', color: 'var(--text-muted)', paddingBottom: 8 }}>
        Volare · v1.0.0
      </div>
    </div>
  )
}
