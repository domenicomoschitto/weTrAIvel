import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useApp } from '../App'
import { getPlaceImage, getFlag } from '../data/places'
import CreateTripModal from '../components/CreateTripModal'

function fmt(d) {
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function dateRange(start, end) {
  if (!start && !end) return null
  if (start && end) return `${fmt(start)} – ${fmt(end)}`
  if (start) return `From ${fmt(start)}`
  return `Until ${fmt(end)}`
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff <= 30) return `In ${diff} days`
  return null
}

// Fallback gradients when no place match
const GRADIENTS = [
  ['#0f2027', '#203a43', '#2c5364'],
  ['#1a1a2e', '#16213e', '#0f3460'],
  ['#0d1117', '#161b22', '#2563eb'],
  ['#1c1c1c', '#2d2d2d', '#7c3aed'],
  ['#0a0a0f', '#111118', '#dc2626'],
  ['#1a2035', '#1e3a5f', '#0369a1'],
  ['#0f1923', '#1a2e44', '#c9973a'],
  ['#16213e', '#0f3460', '#533483'],
]

// Get unique flags for stops
function getStopFlags(stops) {
  if (!stops?.length) return null
  const countryCodes = []
  for (const stop of stops) {
    const place = getPlaceImage(stop.name)
    if (place?.country_code && !countryCodes.includes(place.country_code)) {
      countryCodes.push(place.country_code)
    }
  }
  return countryCodes.length > 0 ? countryCodes.map(getFlag).join('') : null
}

// Get hero image from first stop that has a known place
function getHeroImage(stops) {
  if (!stops?.length) return null
  const sorted = [...stops].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0))
  for (const stop of sorted) {
    const place = getPlaceImage(stop.name)
    if (place) return place.image_url
  }
  return null
}

export default function Home() {
  const navigate = useNavigate()
  const { user } = useApp()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)

  useEffect(() => { loadTrips() }, [])

  async function loadTrips() {
    setLoading(true)
    const { data } = await supabase
      .from('trips')
      .select('*, stops(id, name, order_index)')
      .order('start_date', { ascending: true, nullsFirst: false })
    setTrips(data || [])
    setLoading(false)
  }

  function onTripCreated(trip) {
    setShowCreate(false)
    navigate(`/trip/${trip.id}`)
  }

  // Split into upcoming and past
  const now = new Date()
  const upcoming = trips.filter(t => !t.end_date || new Date(t.end_date + 'T00:00:00') >= now)
  const past = trips.filter(t => t.end_date && new Date(t.end_date + 'T00:00:00') < now)

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || ''

  return (
    <>
      <div className="page page-tabbed" style={{ paddingTop: 28 }}>

        {/* Greeting */}
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: '1.6rem', letterSpacing: '-0.03em' }}>
            {greeting()}{firstName ? `, ${firstName}` : ''}.
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 4 }}>
            {trips.length === 0
              ? 'Start planning your first trip.'
              : `${upcoming.length} upcoming · ${past.length} past`}
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
            <div className="spinner" />
          </div>

        /* Empty */
        ) : trips.length === 0 ? (
          <div style={{
            background: 'var(--bg-surface)',
            border: '1.5px dashed var(--border)',
            borderRadius: 'var(--radius-xl)',
            padding: '52px 24px',
            textAlign: 'center',
            cursor: 'pointer',
          }} onClick={() => setShowCreate(true)}>
            <div style={{ fontSize: '2.5rem', marginBottom: 14 }}>🗺️</div>
            <h3 style={{ marginBottom: 8, fontFamily: 'var(--font-display)' }}>No trips yet</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', maxWidth: 240, margin: '0 auto 20px' }}>
              Add your stops, tickets, bookings and everything you need for the road.
            </p>
            <button className="btn btn-primary">Plan a trip</button>
          </div>

        /* Trip list */
        ) : (
          <div className="flex-col gap-3">
            {upcoming.length > 0 && (
              <>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', marginBottom: 2 }}>
                  Upcoming
                </div>
                {upcoming.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} fallbackIndex={i} onClick={() => navigate(`/trip/${trip.id}`)} />
                ))}
              </>
            )}

            {past.length > 0 && (
              <>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)', marginTop: upcoming.length ? 12 : 0, marginBottom: 2 }}>
                  Past
                </div>
                {past.map((trip, i) => (
                  <TripCard key={trip.id} trip={trip} fallbackIndex={upcoming.length + i} onClick={() => navigate(`/trip/${trip.id}`)} past />
                ))}
              </>
            )}
          </div>
        )}
      </div>

      {/* New trip FAB */}
      <button className="fab" onClick={() => setShowCreate(true)} title="New trip">+</button>

      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreated={onTripCreated}
        />
      )}
    </>
  )
}

function TripCard({ trip, fallbackIndex, onClick, past }) {
  const countdown = daysUntil(trip.start_date)
  const range = dateRange(trip.start_date, trip.end_date)
  const stops = trip.stops || []
  const stopCount = stops.length

  const flags = getStopFlags(stops)
  const heroImage = getHeroImage(stops)
  const [g1, g2, g3] = GRADIENTS[fallbackIndex % GRADIENTS.length]

  return (
    <div
      onClick={onClick}
      style={{
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        cursor: 'pointer',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border)',
        transition: 'transform 0.15s, box-shadow 0.15s',
        opacity: past ? 0.7 : 1,
      }}
      onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)' }}
      onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)' }}
    >
      {/* Cover */}
      <div style={{
        background: `linear-gradient(135deg, ${g1}, ${g2}, ${g3})`,
        padding: '24px 20px 20px',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        position: 'relative',
        minHeight: 96,
        overflow: 'hidden',
      }}>
        {/* Photo background */}
        {heroImage && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `url(${heroImage}) center/cover no-repeat`,
            opacity: 0.18,
          }} />
        )}

        <div style={{ position: 'relative', zIndex: 1 }}>
          {countdown && !past && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(37,99,235,0.9)',
              color: '#fff',
              fontSize: '0.7rem', fontWeight: 700,
              padding: '3px 9px', borderRadius: 20, marginBottom: 10,
              fontFamily: 'var(--font-display)', letterSpacing: '0.02em',
            }}>
              {countdown}
            </div>
          )}
          {past && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(255,255,255,0.12)',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.7rem', fontWeight: 600,
              padding: '3px 9px', borderRadius: 20, marginBottom: 10,
            }}>
              Completed
            </div>
          )}
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem', fontWeight: 800,
            color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.2,
          }}>
            {trip.name}
          </div>
        </div>

        {/* Flags (or fallback emoji) */}
        <div style={{
          fontSize: flags ? '1.6rem' : '2rem',
          flexShrink: 0, marginLeft: 12, marginTop: 2, opacity: 0.9,
          position: 'relative', zIndex: 1,
          letterSpacing: flags?.length > 4 ? '-0.05em' : 'normal',
        }}>
          {flags || '✈️'}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        background: 'var(--bg-surface)',
        padding: '12px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {range && (
            <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>
              📅 {range}
            </span>
          )}
          {stopCount > 0 && (
            <span style={{
              fontSize: '0.72rem', fontWeight: 600,
              background: 'var(--primary-dim)', color: 'var(--primary)',
              padding: '2px 8px', borderRadius: 20, whiteSpace: 'nowrap',
            }}>
              {stopCount} {stopCount === 1 ? 'stop' : 'stops'}
            </span>
          )}
        </div>
        <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }}>›</span>
      </div>
    </div>
  )
}
