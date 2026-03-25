import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchHotelOffers } from '../lib/amadeus'

const HAS_KEY = !!import.meta.env.VITE_AMADEUS_CLIENT_ID

function StarRating({ rating }) {
  const n = parseInt(rating) || 0
  return (
    <span style={{ color: '#f59e0b', fontSize: '0.85rem' }}>
      {'★'.repeat(n)}{'☆'.repeat(Math.max(0, 5 - n))}
    </span>
  )
}

function HotelOfferCard({ result }) {
  const hotel = result.hotel || {}
  const offer = result.offers?.[0] || {}
  const room = offer.room?.typeEstimated || {}
  const price = offer.price?.total
  const currency = offer.price?.currency || 'EUR'
  const addressLines = hotel.address?.lines?.join(', ') || ''
  const city = hotel.address?.cityCode || ''
  const bookUrl = `https://www.booking.com/search.html?ss=${encodeURIComponent(hotel.name || '')}`

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        {/* Hotel info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '0.95rem', fontWeight: 800,
            color: 'var(--text-primary)',
            marginBottom: 3,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {hotel.name || 'Hotel'}
          </div>

          {hotel.rating && (
            <div style={{ marginBottom: 5 }}>
              <StarRating rating={hotel.rating} />
            </div>
          )}

          {(addressLines || city) && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: 8 }}>
              📍 {[addressLines, city].filter(Boolean).join(', ')}
            </div>
          )}

          {/* Room details */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {room.category && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 700,
                background: 'rgba(22,163,74,0.1)', color: 'var(--success)',
                padding: '2px 8px', borderRadius: 10,
              }}>
                {room.category.replace(/_/g, ' ')}
              </span>
            )}
            {room.beds && (
              <span style={{
                fontSize: '0.68rem', fontWeight: 600,
                background: 'var(--bg-elevated)', color: 'var(--text-secondary)',
                padding: '2px 8px', borderRadius: 10,
              }}>
                {room.beds} bed{room.beds > 1 ? 's' : ''}
              </span>
            )}
          </div>

          {/* Dates */}
          {(offer.checkInDate || offer.checkOutDate) && (
            <div style={{ marginTop: 8, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {offer.checkInDate} → {offer.checkOutDate}
            </div>
          )}
        </div>

        {/* Price + CTA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
          <div>
            <div style={{
              fontSize: '1.2rem', fontWeight: 800,
              color: 'var(--success)',
              fontFamily: 'var(--font-display)',
              textAlign: 'right',
            }}>
              {Number(price).toFixed(0)} {currency}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'right' }}>
              per stay
            </div>
          </div>
          <a
            href={bookUrl}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-block',
              background: 'var(--success)',
              color: '#fff',
              borderRadius: 'var(--radius-md)',
              padding: '7px 12px',
              fontSize: '0.75rem',
              fontWeight: 700,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              fontFamily: 'var(--font-display)',
            }}
          >
            Book ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default function HotelSearchLive() {
  const [searchParams] = useSearchParams()
  const destinationParam = searchParams.get('destination') || ''

  const [cityCode, setCityCode] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [adults, setAdults] = useState(1)
  const [rooms, setRooms] = useState(1)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    if (!cityCode.trim()) { setError('Please enter a city airport code.'); return }
    if (!checkIn || !checkOut) { setError('Please select check-in and check-out dates.'); return }
    setError('')
    setLoading(true)
    setResults(null)
    try {
      const data = await searchHotelOffers({
        cityCode: cityCode.trim().toUpperCase(),
        checkIn,
        checkOut,
        adults,
        rooms,
      })
      setResults(data)
    } catch (err) {
      setError(err.message || 'Search failed. Check your API keys.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-md)',
    fontSize: '0.875rem',
    fontFamily: 'var(--font)',
    background: 'var(--bg-surface)',
    color: 'var(--text-primary)',
    outline: 'none',
  }

  const labelStyle = {
    fontSize: '0.68rem', fontWeight: 700,
    color: 'var(--text-muted)',
    letterSpacing: '0.1em', textTransform: 'uppercase',
    fontFamily: 'var(--font-display)',
    marginBottom: 5, display: 'block',
  }

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #071410 0%, #0d2b24 45%, #122f28 100%)',
        padding: '28px 20px 24px',
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
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{
            fontSize: '0.7rem', fontWeight: 700,
            color: 'rgba(255,255,255,0.45)',
            letterSpacing: '0.12em', textTransform: 'uppercase',
            marginBottom: 8, fontFamily: 'var(--font-display)',
          }}>
            ✦ Amadeus API
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6,
          }}>
            {destinationParam ? `Hotels in ${destinationParam}` : 'Live Hotel Search'}
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 0 }}>
            Real-time availability · Amadeus API
            {destinationParam && (
              <span style={{ display: 'block', marginTop: 4 }}>
                Enter the IATA city code for {destinationParam}
              </span>
            )}
          </p>
          {!HAS_KEY && (
            <span style={{
              display: 'inline-block',
              marginTop: 10,
              background: 'rgba(251,191,36,0.15)',
              border: '1px solid rgba(251,191,36,0.3)',
              color: '#fbbf24',
              borderRadius: 20,
              padding: '3px 10px',
              fontSize: '0.7rem', fontWeight: 700,
            }}>
              Test mode
            </span>
          )}
        </div>
      </div>

      <div className="page page-tabbed" style={{ paddingTop: 20 }}>

        {/* No API key banner */}
        {!HAS_KEY && (
          <div style={{
            background: '#fffbeb',
            border: '1px solid #fde68a',
            borderRadius: 'var(--radius-md)',
            padding: '12px 14px',
            marginBottom: 20,
            fontSize: '0.78rem',
            color: '#92400e',
            lineHeight: 1.6,
          }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Amadeus API not configured</div>
            <div>Get free keys at <strong>developers.amadeus.com</strong> and add to <code>.env</code>:</div>
            <pre style={{
              marginTop: 6,
              background: '#fef3c7',
              borderRadius: 6,
              padding: '6px 10px',
              fontSize: '0.75rem',
              overflowX: 'auto',
            }}>
{`VITE_AMADEUS_CLIENT_ID=...
VITE_AMADEUS_CLIENT_SECRET=...`}
            </pre>
          </div>
        )}

        {/* Search form */}
        <div style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)',
          padding: '18px 16px',
          marginBottom: 24,
          boxShadow: 'var(--shadow-sm)',
        }}>
          <form onSubmit={handleSearch}>
            {/* City code */}
            <div style={{ marginBottom: 12 }}>
              <label style={labelStyle}>City Airport Code (e.g. ROM, PAR, LON)</label>
              <input
                style={{ ...inputStyle, textTransform: 'uppercase' }}
                placeholder="e.g. ROM"
                value={cityCode}
                onChange={e => setCityCode(e.target.value.toUpperCase())}
                maxLength={3}
              />
            </div>

            {/* Dates */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Check-in</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={checkIn}
                  onChange={e => setCheckIn(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Check-out</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={checkOut}
                  onChange={e => setCheckOut(e.target.value)}
                  min={checkIn || new Date().toISOString().slice(0, 10)}
                />
              </div>
            </div>

            {/* Adults + Rooms */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
              {/* Adults stepper */}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Adults</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setAdults(a => Math.max(1, a - 1))}
                    style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    }}
                  >−</button>
                  <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {adults}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAdults(a => Math.min(9, a + 1))}
                    style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    }}
                  >+</button>
                </div>
              </div>

              {/* Rooms stepper */}
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Rooms</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    type="button"
                    onClick={() => setRooms(r => Math.max(1, r - 1))}
                    style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    }}
                  >−</button>
                  <span style={{ minWidth: 20, textAlign: 'center', fontWeight: 700, fontFamily: 'var(--font-display)' }}>
                    {rooms}
                  </span>
                  <button
                    type="button"
                    onClick={() => setRooms(r => Math.min(9, r + 1))}
                    style={{
                      width: 32, height: 32, borderRadius: 'var(--radius-sm)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-elevated)',
                      cursor: 'pointer', fontWeight: 700, fontSize: '1rem',
                    }}
                  >+</button>
                </div>
              </div>
            </div>

            {error && (
              <div style={{
                background: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                borderRadius: 'var(--radius-md)',
                padding: '10px 12px',
                marginBottom: 12,
                fontSize: '0.8rem',
                color: 'var(--danger)',
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                background: loading ? 'var(--border)' : 'var(--success)',
                color: '#fff',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontFamily: 'var(--font-display)',
                letterSpacing: '0.02em',
                transition: 'background 0.15s',
              }}
            >
              {loading ? 'Searching...' : 'Search Hotels'}
            </button>
          </form>
        </div>

        {/* Results */}
        {loading && (
          <div style={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: 48, gap: 14,
          }}>
            <div className="spinner" />
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              Searching hotels...
            </div>
          </div>
        )}

        {!loading && results && results.length === 0 && (
          <div className="empty-state">
            <span className="icon">🏨</span>
            <p>No hotel offers found. Try a different city code or date range.</p>
          </div>
        )}

        {!loading && results && results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              marginBottom: 4,
            }}>
              {results.length} hotel{results.length !== 1 ? 's' : ''} found
            </div>
            {results.map((result, i) => (
              <HotelOfferCard key={result.hotel?.hotelId || i} result={result} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
