import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const FILTERS = [
  { id: 'all',           label: 'All',       icon: '✦'  },
  { id: 'transport',     label: 'Transport', icon: '✈️'  },
  { id: 'accommodation', label: 'Stays',     icon: '🏨'  },
]

const CAT_STYLE = {
  transport:     { bg: 'rgba(37,99,235,0.1)',  color: '#2563eb', icon: '✈️' },
  accommodation: { bg: 'rgba(22,163,74,0.1)',  color: '#16a34a', icon: '🏨' },
}

// Subtitle hints based on title keywords
const TRANSPORT_HINTS = ['flight', 'train', 'bus', 'ferry', 'taxi', 'transfer', 'coach', 'metro', 'tram', 'car']
function transportIcon(title) {
  const t = title.toLowerCase()
  if (t.includes('flight') || t.includes('fly') || t.includes('air')) return '✈️'
  if (t.includes('train') || t.includes('rail') || t.includes('tgv') || t.includes('frecciarossa')) return '🚂'
  if (t.includes('bus') || t.includes('coach')) return '🚌'
  if (t.includes('ferry') || t.includes('boat') || t.includes('cruise')) return '🚢'
  if (t.includes('taxi') || t.includes('uber') || t.includes('car')) return '🚗'
  if (t.includes('metro') || t.includes('subway') || t.includes('tram')) return '🚇'
  if (t.includes('transfer')) return '🔄'
  return '✈️'
}

function formatDate(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function TravelItemCard({ item, onClick }) {
  const isTransport = item.category === 'transport'
  const style = CAT_STYLE[item.category]
  const icon = isTransport ? transportIcon(item.title) : '🏨'
  const itemDate = item.metadata?.date
  const stop = item.stops

  return (
    <div
      onClick={onClick}
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        cursor: 'pointer',
        boxShadow: 'var(--shadow-sm)',
        transition: 'all 0.15s',
      }}
      onMouseOver={e => {
        e.currentTarget.style.borderColor = 'var(--border-hover)'
        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
        e.currentTarget.style.transform = 'translateY(-1px)'
      }}
      onMouseOut={e => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
        e.currentTarget.style.transform = 'none'
      }}
    >
      {/* Icon bubble */}
      <div style={{
        width: 40, height: 40,
        borderRadius: 'var(--radius-md)',
        background: style.bg,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem', flexShrink: 0,
      }}>
        {icon}
      </div>

      {/* Body */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontSize: '0.9rem', fontWeight: 700,
          color: 'var(--text-primary)',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {item.title}
        </div>

        {item.content && (
          <div style={{
            fontSize: '0.78rem', color: 'var(--text-secondary)',
            marginTop: 2,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
          }}>
            {item.content}
          </div>
        )}

        <div style={{ display: 'flex', gap: 6, marginTop: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          {stop?.name && (
            <span style={{
              fontSize: '0.7rem', color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 2,
            }}>
              📍 {stop.name}
            </span>
          )}
          {itemDate && (
            <span style={{
              fontSize: '0.7rem', fontWeight: 600,
              background: style.bg, color: style.color,
              padding: '2px 7px', borderRadius: 10,
            }}>
              {formatDate(itemDate)}
            </span>
          )}
        </div>
      </div>

      <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', flexShrink: 0, marginTop: 10 }}>›</span>
    </div>
  )
}

export default function Travel() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => { loadItems() }, [])

  async function loadItems() {
    setLoading(true)
    const { data } = await supabase
      .from('vault_items')
      .select('*, stops(id, name, start_date, end_date, trip_id, trips(id, name, start_date))')
      .in('category', ['transport', 'accommodation'])
      .order('created_at', { ascending: true })
    setItems(data || [])
    setLoading(false)
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.category === filter)

  // Group by trip
  const grouped = filtered.reduce((acc, item) => {
    const tripId = item.stops?.trip_id || 'unknown'
    if (!acc[tripId]) {
      acc[tripId] = {
        tripId,
        tripName: item.stops?.trips?.name || 'Unknown Trip',
        tripId2: item.stops?.trips?.id,
        tripStartDate: item.stops?.trips?.start_date,
        items: [],
      }
    }
    acc[tripId].items.push(item)
    return acc
  }, {})

  const groups = Object.values(grouped).sort((a, b) => {
    if (!a.tripStartDate && !b.tripStartDate) return 0
    if (!a.tripStartDate) return 1
    if (!b.tripStartDate) return -1
    return new Date(a.tripStartDate) - new Date(b.tripStartDate)
  })

  const totalCount = filtered.length
  const transportCount = items.filter(i => i.category === 'transport').length
  const stayCount = items.filter(i => i.category === 'accommodation').length

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(160deg, #080814 0%, #0d1b38 45%, #152444 100%)',
        padding: '28px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Background plane */}
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
            ✦ Logistics hub
          </div>
          <h1 style={{
            fontSize: '1.75rem', fontWeight: 800, color: '#fff',
            letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6,
          }}>
            Travel
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 16 }}>
            All your flights, trains, hotels and bookings in one place.
          </p>

          {/* Stats row */}
          {!loading && items.length > 0 && (
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '7px 14px',
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600,
              }}>
                ✈️ {transportCount} transport
              </div>
              <div style={{
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 'var(--radius-md)',
                padding: '7px 14px',
                fontSize: '0.78rem', color: 'rgba(255,255,255,0.75)', fontWeight: 600,
              }}>
                🏨 {stayCount} stays
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="page page-tabbed" style={{ paddingTop: 20 }}>

        {/* Quick Search */}
        <div style={{ marginBottom: 24 }}>
          <div style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            marginBottom: 10,
          }}>
            Quick Search ↗
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Flights card */}
            <div
              onClick={() => navigate('/flights')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                ✈️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  Search Flights
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                  Compare prices on Google Flights
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }}>→</span>
            </div>

            {/* Hotels card */}
            <div
              onClick={() => navigate('/hotels')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(22,163,74,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                🏨
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  Hotels & Stays
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                  Find deals on Booking.com & Airbnb
                </div>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '1rem', flexShrink: 0 }}>→</span>
            </div>
          </div>

          {/* Live Search section */}
          <div style={{
            fontSize: '0.68rem', fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            marginTop: 18, marginBottom: 10,
          }}>
            Live Search
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {/* Live Flights card */}
            <div
              onClick={() => navigate('/flights-live')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(37,99,235,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                ✈️
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  Live Flights
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                  Real data via Amadeus
                </div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.65rem', fontWeight: 700,
                color: '#16a34a',
                background: 'rgba(22,163,74,0.1)',
                border: '1px solid rgba(22,163,74,0.2)',
                borderRadius: 10,
                padding: '2px 7px',
                flexShrink: 0,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#16a34a', display: 'inline-block',
                }} />
                LIVE
              </span>
            </div>

            {/* Live Hotels card */}
            <div
              onClick={() => navigate('/hotels-live')}
              style={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-lg)',
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseOver={e => {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                e.currentTarget.style.transform = 'translateY(-1px)'
              }}
              onMouseOut={e => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.boxShadow = 'none'
                e.currentTarget.style.transform = 'none'
              }}
            >
              <div style={{
                width: 40, height: 40,
                borderRadius: 'var(--radius-md)',
                background: 'rgba(22,163,74,0.1)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem', flexShrink: 0,
              }}>
                🏨
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '0.9rem', fontWeight: 700,
                  color: 'var(--text-primary)',
                }}>
                  Live Hotels
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 1 }}>
                  Real data via Amadeus
                </div>
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: '0.65rem', fontWeight: 700,
                color: '#16a34a',
                background: 'rgba(22,163,74,0.1)',
                border: '1px solid rgba(22,163,74,0.2)',
                borderRadius: 10,
                padding: '2px 7px',
                flexShrink: 0,
              }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: '#16a34a', display: 'inline-block',
                }} />
                LIVE
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{
            fontSize: '0.65rem', fontWeight: 700,
            color: 'var(--text-muted)',
            letterSpacing: '0.1em', textTransform: 'uppercase',
            fontFamily: 'var(--font-display)',
            whiteSpace: 'nowrap',
          }}>
            Your Bookings
          </span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        {/* Filter chips */}
        <div className="category-chips" style={{ marginBottom: 24 }}>
          {FILTERS.map(f => (
            <button
              key={f.id}
              className={`category-chip${filter === f.id ? ' active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.icon} {f.label}
              {f.id !== 'all' && items.filter(i => i.category === f.id).length > 0 && (
                <span style={{
                  marginLeft: 4,
                  background: filter === f.id ? 'rgba(255,255,255,0.2)' : 'var(--bg-elevated)',
                  borderRadius: 10, padding: '1px 6px', fontSize: '0.7rem',
                }}>
                  {items.filter(i => i.category === f.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
            <div className="spinner" />
          </div>

        ) : groups.length === 0 ? (
          <div className="empty-state">
            <span className="icon">{filter === 'accommodation' ? '🏨' : '✈️'}</span>
            <p>
              {filter === 'all'
                ? 'No transport or accommodation added yet. Open a stop and add items.'
                : `No ${filter === 'transport' ? 'transport' : 'stays'} added yet.`}
            </p>
          </div>

        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
            {groups.map(group => (
              <div key={group.tripId}>
                {/* Trip header */}
                <div
                  style={{
                    display: 'flex', alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: '0.72rem', fontWeight: 700,
                      color: 'var(--text-muted)',
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      fontFamily: 'var(--font-display)',
                    }}>
                      🗺️ {group.tripName}
                    </span>
                    {group.tripStartDate && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        · {formatDate(group.tripStartDate)}
                      </span>
                    )}
                  </div>
                  {group.tripId2 && (
                    <button
                      className="btn-icon"
                      style={{ fontSize: '0.75rem', color: 'var(--primary)', padding: '4px 8px' }}
                      onClick={() => navigate(`/trip/${group.tripId2}`)}
                    >
                      View trip ›
                    </button>
                  )}
                </div>

                {/* Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {group.items.map(item => (
                    <TravelItemCard
                      key={item.id}
                      item={item}
                      onClick={() => navigate(`/trip/${item.stops?.trip_id}/stop/${item.stops?.id}`)}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info note at the bottom */}
        {!loading && items.length > 0 && (
          <div style={{
            marginTop: 28,
            padding: '14px 16px',
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.78rem',
            color: 'var(--text-muted)',
            lineHeight: 1.5,
          }}>
            💡 Add more transport and accommodation from any stop in your trips.
          </div>
        )}
      </div>
    </>
  )
}
