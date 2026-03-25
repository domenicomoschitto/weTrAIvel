import { useState, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { searchAirports, searchFlights } from '../lib/amadeus'

const HAS_KEY = !!import.meta.env.VITE_AMADEUS_CLIENT_ID

// Parse ISO duration PT2H30M → "2h 30m"
function parseDuration(str) {
  if (!str) return ''
  const h = str.match(/(\d+)H/)
  const m = str.match(/(\d+)M/)
  const parts = []
  if (h) parts.push(`${h[1]}h`)
  if (m) parts.push(`${m[1]}m`)
  return parts.join(' ') || str
}

// Extract HH:MM from ISO datetime
function formatTime(iso) {
  if (!iso) return ''
  return iso.slice(11, 16)
}

function AirportDropdown({ results, onSelect }) {
  if (!results.length) return null
  return (
    <div style={{
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      zIndex: 100,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-lg)',
      marginTop: 4,
      overflow: 'hidden',
    }}>
      {results.map((loc) => (
        <div
          key={loc.id}
          onMouseDown={() => onSelect(loc)}
          style={{
            padding: '10px 14px',
            cursor: 'pointer',
            borderBottom: '1px solid var(--border)',
            fontSize: '0.82rem',
            lineHeight: 1.4,
          }}
          onMouseOver={e => e.currentTarget.style.background = 'var(--bg-hover)'}
          onMouseOut={e => e.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontWeight: 700, color: 'var(--primary)', fontFamily: 'var(--font-display)' }}>
            {loc.iataCode}
          </span>
          <span style={{ color: 'var(--text-secondary)', marginLeft: 6 }}>
            — {loc.name}, {loc.address?.cityName}, {loc.address?.countryCode}
          </span>
        </div>
      ))}
    </div>
  )
}

function FlightOfferCard({ offer, dictionaries }) {
  const price = offer.price?.total
  const currency = offer.price?.currency || 'EUR'
  const itineraries = offer.itineraries || []

  function renderItinerary(itin, label) {
    const segs = itin.segments || []
    if (!segs.length) return null
    const first = segs[0]
    const last = segs[segs.length - 1]
    const stops = segs.length - 1
    const carrier = dictionaries?.carriers?.[first.carrierCode] || first.carrierCode

    return (
      <div style={{ marginBottom: itineraries.length > 1 ? 10 : 0 }}>
        {label && (
          <div style={{
            fontSize: '0.65rem', fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            marginBottom: 6,
          }}>
            {label}
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Departure */}
          <div style={{ textAlign: 'center', minWidth: 52 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {formatTime(first.departure?.at)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {first.departure?.iataCode}
            </div>
          </div>

          {/* Route line */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              {parseDuration(itin.duration)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 4 }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span style={{ fontSize: '0.7rem' }}>✈</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>
            <div style={{
              fontSize: '0.65rem',
              color: stops === 0 ? 'var(--success)' : 'var(--warning)',
              fontWeight: 600,
            }}>
              {stops === 0 ? 'Direct' : `${stops} stop${stops > 1 ? 's' : ''}`}
            </div>
          </div>

          {/* Arrival */}
          <div style={{ textAlign: 'center', minWidth: 52 }}>
            <div style={{ fontWeight: 800, fontSize: '1rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {formatTime(last.arrival?.at)}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>
              {last.arrival?.iataCode}
            </div>
          </div>
        </div>

        {/* Carrier */}
        <div style={{ marginTop: 5, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          {carrier}
        </div>
      </div>
    )
  }

  const origin = offer.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || ''
  const dest = offer.itineraries?.[0]?.segments?.slice(-1)[0]?.arrival?.iataCode || ''
  const bookUrl = `https://www.google.com/travel/flights?q=flights+from+${origin}+to+${dest}`

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 'var(--radius-lg)',
      padding: '16px',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      gap: 16,
      alignItems: 'flex-start',
    }}>
      {/* Route info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {itineraries.length === 1
          ? renderItinerary(itineraries[0], null)
          : (
            <>
              {renderItinerary(itineraries[0], 'Outbound')}
              {itineraries[1] && (
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10 }}>
                  {renderItinerary(itineraries[1], 'Return')}
                </div>
              )}
            </>
          )
        }
      </div>

      {/* Price + CTA */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, flexShrink: 0 }}>
        <div>
          <div style={{
            fontSize: '1.25rem', fontWeight: 800,
            color: 'var(--primary)',
            fontFamily: 'var(--font-display)',
            textAlign: 'right',
          }}>
            {Number(price).toFixed(0)} {currency}
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'right' }}>
            per person
          </div>
        </div>
        <a
          href={bookUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            background: 'var(--primary)',
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
  )
}

export default function FlightSearchLive() {
  const [searchParams] = useSearchParams()

  const [tripType, setTripType] = useState('round') // 'round' | 'one'
  const [fromQuery, setFromQuery] = useState(searchParams.get('from') || '')
  const [fromCode, setFromCode] = useState('')
  const [toQuery, setToQuery] = useState(searchParams.get('to') || '')
  const [toCode, setToCode] = useState('')
  const [autocompleteFrom, setAutocompleteFrom] = useState([])
  const [autocompleteTo, setAutocompleteTo] = useState([])
  const [showFromDrop, setShowFromDrop] = useState(false)
  const [showToDrop, setShowToDrop] = useState(false)
  const [departDate, setDepartDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [adults, setAdults] = useState(1)
  const [travelClass, setTravelClass] = useState('ECONOMY')
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState('')

  const fromTimer = useRef(null)
  const toTimer = useRef(null)

  // Debounced airport search — FROM
  useEffect(() => {
    clearTimeout(fromTimer.current)
    if (fromQuery.length < 2) { setAutocompleteFrom([]); return }
    fromTimer.current = setTimeout(async () => {
      try {
        const locs = await searchAirports(fromQuery)
        setAutocompleteFrom(locs)
        setShowFromDrop(true)
      } catch {}
    }, 400)
    return () => clearTimeout(fromTimer.current)
  }, [fromQuery])

  // Debounced airport search — TO
  useEffect(() => {
    clearTimeout(toTimer.current)
    if (toQuery.length < 2) { setAutocompleteTo([]); return }
    toTimer.current = setTimeout(async () => {
      try {
        const locs = await searchAirports(toQuery)
        setAutocompleteTo(locs)
        setShowToDrop(true)
      } catch {}
    }, 400)
    return () => clearTimeout(toTimer.current)
  }, [toQuery])

  function selectFrom(loc) {
    setFromQuery(`${loc.address?.cityName} (${loc.iataCode})`)
    setFromCode(loc.iataCode)
    setShowFromDrop(false)
    setAutocompleteFrom([])
  }

  function selectTo(loc) {
    setToQuery(`${loc.address?.cityName} (${loc.iataCode})`)
    setToCode(loc.iataCode)
    setShowToDrop(false)
    setAutocompleteTo([])
  }

  function swap() {
    const tmpQ = fromQuery, tmpC = fromCode
    setFromQuery(toQuery); setFromCode(toCode)
    setToQuery(tmpQ); setToCode(tmpC)
  }

  async function handleSearch(e) {
    e.preventDefault()
    if (!fromCode || !toCode) {
      setError('Please select airports from the dropdown suggestions.')
      return
    }
    if (!departDate) { setError('Please choose a departure date.'); return }
    setError('')
    setLoading(true)
    setResults(null)
    try {
      const data = await searchFlights({
        origin: fromCode,
        destination: toCode,
        departDate,
        returnDate: tripType === 'round' ? returnDate : undefined,
        adults,
        travelClass,
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
        background: 'linear-gradient(160deg, #080814 0%, #0d1b38 45%, #152444 100%)',
        padding: '28px 20px 24px',
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
            Live Flight Search
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 0 }}>
            Real-time data · Amadeus API
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
          {/* Trip type toggle */}
          <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
            {[{ id: 'round', label: 'Round trip' }, { id: 'one', label: 'One way' }].map(t => (
              <button
                key={t.id}
                onClick={() => setTripType(t.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: tripType === t.id ? 'var(--primary)' : 'var(--border)',
                  background: tripType === t.id ? 'var(--primary-dim)' : 'transparent',
                  color: tripType === t.id ? 'var(--primary)' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            {/* FROM / SWAP / TO row */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', marginBottom: 12 }}>
              {/* FROM */}
              <div style={{ flex: 1, position: 'relative' }}>
                <label style={labelStyle}>From</label>
                <input
                  style={inputStyle}
                  placeholder="City or airport"
                  value={fromQuery}
                  onChange={e => { setFromQuery(e.target.value); setFromCode('') }}
                  onFocus={() => autocompleteFrom.length && setShowFromDrop(true)}
                  onBlur={() => setTimeout(() => setShowFromDrop(false), 150)}
                />
                {showFromDrop && (
                  <AirportDropdown results={autocompleteFrom} onSelect={selectFrom} />
                )}
              </div>

              {/* Swap */}
              <button
                type="button"
                onClick={swap}
                style={{
                  width: 36, height: 36,
                  borderRadius: '50%',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-elevated)',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                  marginBottom: 1,
                }}
                title="Swap"
              >
                ⇄
              </button>

              {/* TO */}
              <div style={{ flex: 1, position: 'relative' }}>
                <label style={labelStyle}>To</label>
                <input
                  style={inputStyle}
                  placeholder="City or airport"
                  value={toQuery}
                  onChange={e => { setToQuery(e.target.value); setToCode('') }}
                  onFocus={() => autocompleteTo.length && setShowToDrop(true)}
                  onBlur={() => setTimeout(() => setShowToDrop(false), 150)}
                />
                {showToDrop && (
                  <AirportDropdown results={autocompleteTo} onSelect={selectTo} />
                )}
              </div>
            </div>

            {/* Dates row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>Depart</label>
                <input
                  type="date"
                  style={inputStyle}
                  value={departDate}
                  onChange={e => setDepartDate(e.target.value)}
                  min={new Date().toISOString().slice(0, 10)}
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ ...labelStyle, color: tripType === 'one' ? 'var(--border)' : 'var(--text-muted)' }}>
                  Return
                </label>
                <input
                  type="date"
                  style={{
                    ...inputStyle,
                    opacity: tripType === 'one' ? 0.4 : 1,
                    pointerEvents: tripType === 'one' ? 'none' : 'auto',
                  }}
                  value={returnDate}
                  onChange={e => setReturnDate(e.target.value)}
                  min={departDate || new Date().toISOString().slice(0, 10)}
                  disabled={tripType === 'one'}
                />
              </div>
            </div>

            {/* Adults + Class row */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
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

              {/* Class */}
              <div style={{ flex: 2 }}>
                <label style={labelStyle}>Class</label>
                <select
                  style={{ ...inputStyle, cursor: 'pointer' }}
                  value={travelClass}
                  onChange={e => setTravelClass(e.target.value)}
                >
                  <option value="ECONOMY">Economy</option>
                  <option value="PREMIUM_ECONOMY">Premium Economy</option>
                  <option value="BUSINESS">Business</option>
                  <option value="FIRST">First</option>
                </select>
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
                background: loading ? 'var(--border)' : 'var(--primary)',
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
              {loading ? 'Searching...' : 'Search Flights'}
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
              Searching flights...
            </div>
          </div>
        )}

        {!loading && results && results.offers.length === 0 && (
          <div className="empty-state">
            <span className="icon">✈️</span>
            <p>No flights found for this route and date. Try adjusting your search.</p>
          </div>
        )}

        {!loading && results && results.offers.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700,
              color: 'var(--text-muted)',
              letterSpacing: '0.1em', textTransform: 'uppercase',
              fontFamily: 'var(--font-display)',
              marginBottom: 4,
            }}>
              {results.offers.length} result{results.offers.length !== 1 ? 's' : ''}
            </div>
            {results.offers.map((offer, i) => (
              <FlightOfferCard key={offer.id || i} offer={offer} dictionaries={results.dictionaries} />
            ))}
          </div>
        )}
      </div>
    </>
  )
}
