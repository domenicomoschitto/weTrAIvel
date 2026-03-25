import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function formatDateInput(daysFromNow) {
  return new Date(Date.now() + daysFromNow * 86400000).toISOString().split('T')[0]
}

const today = formatDateInput(0)

function Stepper({ value, min, max, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--bg-elevated)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        style={{
          width: 38, height: 42,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        −
      </button>
      <span style={{
        flex: 1, textAlign: 'center',
        fontSize: '0.9rem', fontWeight: 700,
        color: 'var(--text-primary)',
        fontFamily: 'var(--font-display)',
      }}>
        {value}
      </span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        style={{
          width: 38, height: 42,
          background: 'transparent',
          border: 'none',
          color: 'var(--text-secondary)',
          fontSize: '1.1rem',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        +
      </button>
    </div>
  )
}

export default function HotelSearch() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [platform, setPlatform] = useState('booking')
  const [destination, setDestination] = useState(searchParams.get('destination') || '')
  const [checkin, setCheckin] = useState(formatDateInput(7))
  const [checkout, setCheckout] = useState(formatDateInput(10))
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [rooms, setRooms] = useState(1)
  const [error, setError] = useState('')

  function handleCheckinChange(val) {
    setCheckin(val)
    if (checkout && val && checkout <= val) {
      const d = new Date(val + 'T00:00:00')
      d.setDate(d.getDate() + 3)
      setCheckout(d.toISOString().split('T')[0])
    }
  }

  function validate() {
    if (!destination.trim()) {
      setError('Please enter a destination.')
      return false
    }
    setError('')
    return true
  }

  function handleSearch() {
    if (!validate()) return
    if (platform === 'booking') {
      openBooking()
    } else {
      openAirbnb()
    }
  }

  function openBooking() {
    if (!validate()) return
    const url = `https://www.booking.com/search.html?ss=${encodeURIComponent(destination.trim())}&checkin=${checkin}&checkout=${checkout}&group_adults=${adults}&group_children=${children}&no_rooms=${rooms}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function openAirbnb() {
    if (!validate()) return
    const url = `https://www.airbnb.com/s/${encodeURIComponent(destination.trim())}/homes?checkin=${checkin}&checkout=${checkout}&adults=${adults}&children=${children}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.68rem', fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    fontFamily: 'var(--font-display)',
    marginBottom: 6,
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #071410 0%, #0d2b24 45%, #122f28 100%)',
        padding: '32px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -10, top: -10,
          fontSize: '8rem', opacity: 0.04, lineHeight: 1,
          transform: 'rotate(-10deg)',
          pointerEvents: 'none',
        }}>
          🏨
        </div>

        <button
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute', top: 14, left: 14,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.75)',
            borderRadius: 'var(--radius-md)',
            padding: '6px 12px',
            fontSize: '0.78rem',
            cursor: 'pointer',
            zIndex: 2,
          }}
        >
          ← Back
        </button>

        <div style={{ position: 'relative', zIndex: 1, marginTop: 10 }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 8, fontFamily: 'var(--font-display)',
          }}>
            🏨 Stays
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6,
          }}>
            Find Hotels & Stays
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Search Booking.com & Airbnb
          </p>
        </div>
      </div>

      <div className="page page-tabbed" style={{ paddingTop: 20 }}>

        {/* Form card */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-md)',
          padding: '20px',
          marginBottom: 16,
        }}>

          {/* Platform toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => setPlatform('booking')}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: platform === 'booking' ? '#16a34a' : 'var(--border)',
                background: platform === 'booking' ? '#16a34a' : 'var(--bg-elevated)',
                color: platform === 'booking' ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              🏨 Booking.com
            </button>
            <button
              onClick={() => setPlatform('airbnb')}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: platform === 'airbnb' ? '#ff5a5f' : 'var(--border)',
                background: platform === 'airbnb' ? '#ff5a5f' : 'var(--bg-elevated)',
                color: platform === 'airbnb' ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              🏠 Airbnb
            </button>
          </div>

          {/* Destination */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Destination</label>
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="City, region or landmark"
              style={{
                width: '100%',
                padding: '11px 13px',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
          </div>

          {/* Dates row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={labelStyle}>Check-in</label>
              <input
                type="date"
                value={checkin}
                min={today}
                onChange={e => handleCheckinChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
            <div>
              <label style={labelStyle}>Check-out</label>
              <input
                type="date"
                value={checkout}
                min={checkin || today}
                onChange={e => setCheckout(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          </div>

          {/* Guests row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 20 }}>
            <div>
              <label style={labelStyle}>Adults</label>
              <Stepper value={adults} min={1} max={9} onChange={setAdults} />
            </div>
            <div>
              <label style={labelStyle}>Children</label>
              <Stepper value={children} min={0} max={6} onChange={setChildren} />
            </div>
            {platform === 'booking' && (
              <div>
                <label style={labelStyle}>Rooms</label>
                <Stepper value={rooms} min={1} max={9} onChange={setRooms} />
              </div>
            )}
            {platform === 'airbnb' && (
              <div>
                <label style={{ ...labelStyle, opacity: 0.4 }}>Rooms</label>
                <div style={{
                  height: 42,
                  background: 'var(--bg-base)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0.35,
                  fontSize: '0.75rem',
                  color: 'var(--text-muted)',
                }}>
                  N/A
                </div>
              </div>
            )}
          </div>

          {/* Error */}
          {error && (
            <div style={{
              fontSize: '0.8rem',
              color: '#ef4444',
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              borderRadius: 'var(--radius-md)',
              padding: '9px 12px',
              marginBottom: 14,
            }}>
              {error}
            </div>
          )}

          {/* Search button */}
          <button
            onClick={handleSearch}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
              borderRadius: 'var(--radius-md)',
              border: 'none',
              cursor: 'pointer',
              background: platform === 'booking' ? '#16a34a' : '#ff5a5f',
              color: '#fff',
              transition: 'opacity 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.opacity = '0.88'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            {platform === 'booking' ? 'Search on Booking.com ↗' : 'Search on Airbnb ↗'}
          </button>
        </div>

        {/* View on other platform */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontFamily: 'var(--font-display)',
            marginBottom: 4,
          }}>
            View on:
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            {platform !== 'booking' && (
              <button
                className="btn btn-ghost"
                onClick={openBooking}
                style={{ flex: 1, fontSize: '0.82rem' }}
              >
                🏨 Booking.com ↗
              </button>
            )}
            {platform !== 'airbnb' && (
              <button
                className="btn btn-ghost"
                onClick={openAirbnb}
                style={{ flex: 1, fontSize: '0.82rem' }}
              >
                🏠 Airbnb ↗
              </button>
            )}
          </div>
        </div>

      </div>
    </>
  )
}
