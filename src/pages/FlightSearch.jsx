import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

function formatDateInput(daysFromNow) {
  return new Date(Date.now() + daysFromNow * 86400000).toISOString().split('T')[0]
}

const today = formatDateInput(0)

export default function FlightSearch() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [tripType, setTripType] = useState('round')
  const [from, setFrom] = useState(searchParams.get('from') || '')
  const [to, setTo] = useState(searchParams.get('to') || '')
  const [depart, setDepart] = useState(formatDateInput(7))
  const [returnDate, setReturnDate] = useState(formatDateInput(14))
  const [adults, setAdults] = useState(1)
  const [cabinClass, setCabinClass] = useState('economy')
  const [error, setError] = useState('')

  function swapFromTo() {
    setFrom(to)
    setTo(from)
  }

  function handleDepartChange(val) {
    setDepart(val)
    // If return is before new depart, push it forward by 7 days
    if (returnDate && val && returnDate < val) {
      const d = new Date(val + 'T00:00:00')
      d.setDate(d.getDate() + 7)
      setReturnDate(d.toISOString().split('T')[0])
    }
  }

  function handleSearch() {
    if (!from.trim() || !to.trim()) {
      setError('Please fill in both From and To fields.')
      return
    }
    setError('')
    const q = `flights from ${from.trim()} to ${to.trim()} on ${depart}`
    const url = `https://www.google.com/travel/flights?q=${encodeURIComponent(q)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleSkyscanner() {
    if (!from.trim() || !to.trim()) {
      setError('Please fill in both From and To fields to open Skyscanner.')
      return
    }
    setError('')
    const fromSlug = from.trim().toLowerCase().replace(/\s+/g, '-')
    const toSlug = to.trim().toLowerCase().replace(/\s+/g, '-')
    const d = new Date(depart + 'T00:00:00')
    const dd = String(d.getDate()).padStart(2, '0')
    const mm = String(d.getMonth() + 1).padStart(2, '0')
    const yy = String(d.getFullYear()).slice(2)
    const url = `https://www.skyscanner.net/transport/flights/${fromSlug}/${toSlug}/${dd}${mm}${yy}/`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  function handleKayak() {
    if (!from.trim() || !to.trim()) {
      setError('Please fill in both From and To fields to open Kayak.')
      return
    }
    setError('')
    const f = from.trim().replace(/\s+/g, '-')
    const t = to.trim().replace(/\s+/g, '-')
    const url = `https://www.kayak.com/flights/${encodeURIComponent(f)}-${encodeURIComponent(t)}/${depart}${tripType === 'round' ? `/${returnDate}` : ''}/${adults}adults`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #080814 0%, #0d1b38 45%, #152444 100%)',
        padding: '32px 20px 28px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', right: -10, top: -10,
          fontSize: '8rem', opacity: 0.04, lineHeight: 1,
          transform: 'rotate(-15deg)',
          pointerEvents: 'none',
        }}>
          ✈
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
            ✈ Flights
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6,
          }}>
            Search Flights
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Powered by Google Flights
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

          {/* Trip type toggle */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
            <button
              onClick={() => setTripType('round')}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: tripType === 'round' ? 'var(--primary)' : 'var(--border)',
                background: tripType === 'round' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: tripType === 'round' ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              ⇄ Round trip
            </button>
            <button
              onClick={() => setTripType('oneway')}
              style={{
                flex: 1,
                padding: '9px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: tripType === 'oneway' ? 'var(--primary)' : 'var(--border)',
                background: tripType === 'oneway' ? 'var(--primary)' : 'var(--bg-elevated)',
                color: tripType === 'oneway' ? '#fff' : 'var(--text-secondary)',
                fontFamily: 'var(--font-display)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              → One way
            </button>
          </div>

          {/* From */}
          <div style={{ marginBottom: 4 }}>
            <label style={{
              display: 'block',
              fontSize: '0.68rem', fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              marginBottom: 6,
            }}>
              From
            </label>
            <input
              type="text"
              value={from}
              onChange={e => setFrom(e.target.value)}
              placeholder="City or airport (e.g. London, LHR)"
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

          {/* Swap button */}
          <div style={{ display: 'flex', justifyContent: 'center', margin: '10px 0' }}>
            <button
              onClick={swapFromTo}
              title="Swap From and To"
              style={{
                width: 32, height: 32,
                borderRadius: '50%',
                border: '1px solid var(--border)',
                background: 'var(--bg-surface)',
                color: 'var(--text-secondary)',
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
                flexShrink: 0,
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--primary)'
                e.currentTarget.style.color = 'var(--primary)'
                e.currentTarget.style.transform = 'rotate(180deg)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-secondary)'
                e.currentTarget.style.transform = 'none'
              }}
            >
              ⇅
            </button>
          </div>

          {/* To */}
          <div style={{ marginBottom: 16 }}>
            <label style={{
              display: 'block',
              fontSize: '0.68rem', fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              marginBottom: 6,
            }}>
              To
            </label>
            <input
              type="text"
              value={to}
              onChange={e => setTo(e.target.value)}
              placeholder="City or airport (e.g. Rome, FCO)"
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
              <label style={{
                display: 'block',
                fontSize: '0.68rem', fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                marginBottom: 6,
              }}>
                Depart
              </label>
              <input
                type="date"
                value={depart}
                min={today}
                onChange={e => handleDepartChange(e.target.value)}
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
              <label style={{
                display: 'block',
                fontSize: '0.68rem', fontWeight: 700,
                color: tripType === 'oneway' ? 'var(--text-muted)' : 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                marginBottom: 6,
                opacity: tripType === 'oneway' ? 0.4 : 1,
              }}>
                Return
              </label>
              <input
                type="date"
                value={returnDate}
                min={depart || today}
                disabled={tripType === 'oneway'}
                onChange={e => setReturnDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '11px 10px',
                  background: tripType === 'oneway' ? 'var(--bg-base)' : 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: tripType === 'oneway' ? 'var(--text-muted)' : 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                  opacity: tripType === 'oneway' ? 0.45 : 1,
                  cursor: tripType === 'oneway' ? 'not-allowed' : 'text',
                }}
              />
            </div>
          </div>

          {/* Passengers + Class */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '0.68rem', fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                marginBottom: 6,
              }}>
                Adults
              </label>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 0,
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
              }}>
                <button
                  onClick={() => setAdults(a => Math.max(1, a - 1))}
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
                  {adults}
                </span>
                <button
                  onClick={() => setAdults(a => Math.min(9, a + 1))}
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
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '0.68rem', fontWeight: 700,
                color: 'var(--text-muted)',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                fontFamily: 'var(--font-display)',
                marginBottom: 6,
              }}>
                Class
              </label>
              <select
                value={cabinClass}
                onChange={e => setCabinClass(e.target.value)}
                style={{
                  width: '100%',
                  height: 42,
                  padding: '0 10px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  cursor: 'pointer',
                  boxSizing: 'border-box',
                }}
              >
                <option value="economy">Economy</option>
                <option value="premium-economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
            </div>
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
            className="btn btn-primary"
            onClick={handleSearch}
            style={{
              width: '100%',
              padding: '13px',
              fontSize: '0.92rem',
              fontWeight: 700,
              letterSpacing: '0.03em',
            }}
          >
            Search on Google Flights ↗
          </button>
        </div>

        {/* Info note */}
        <p style={{
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          textAlign: 'center',
          lineHeight: 1.5,
          marginBottom: 16,
        }}>
          Opens Google Flights in a new tab with your search pre-filled.
        </p>

        {/* Try also */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <p style={{
            fontSize: '0.72rem', fontWeight: 700,
            color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontFamily: 'var(--font-display)',
            marginBottom: 4,
          }}>
            Try also:
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn btn-ghost"
              onClick={handleSkyscanner}
              style={{ flex: 1, fontSize: '0.82rem' }}
            >
              Skyscanner ↗
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleKayak}
              style={{ flex: 1, fontSize: '0.82rem' }}
            >
              Kayak ↗
            </button>
          </div>
        </div>

      </div>
    </>
  )
}
