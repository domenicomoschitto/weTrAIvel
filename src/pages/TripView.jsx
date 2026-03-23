import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { callClaude, buildOptimizerContext } from '../lib/claude'
import { getPlaceImage } from '../data/places'
import CreateStopModal from '../components/CreateStopModal'
import EditTripModal from '../components/EditTripModal'

function formatDate(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function nightsCount(start, end) {
  if (!start || !end) return null
  const n = Math.round((new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / (1000 * 60 * 60 * 24))
  return n > 0 ? n : null
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = Math.ceil((new Date(dateStr + 'T00:00:00') - new Date()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return null
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Tomorrow'
  if (diff <= 60) return `In ${diff} days`
  return null
}

export default function TripView() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [showEdit, setShowEdit] = useState(false)
  const [optimizing, setOptimizing] = useState(false)
  const [optimizerResult, setOptimizerResult] = useState(null)
  const [deletingTrip, setDeletingTrip] = useState(false)

  useEffect(() => { loadData() }, [tripId])

  async function loadData() {
    setLoading(true)
    const [{ data: tripData }, { data: stopsData }] = await Promise.all([
      supabase.from('trips').select('*').eq('id', tripId).single(),
      supabase.from('stops').select('*, vault_items(count)').eq('trip_id', tripId).order('order_index'),
    ])
    setTrip(tripData)
    setStops(stopsData || [])
    setLoading(false)
  }

  async function deleteTrip() {
    if (!confirm(`Delete "${trip?.name}"? This cannot be undone.`)) return
    setDeletingTrip(true)
    await supabase.from('trips').delete().eq('id', tripId)
    navigate('/')
  }

  async function runOptimizer() {
    if (stops.length < 2) {
      alert('Add at least 2 stops to optimize the trip order.')
      return
    }
    setOptimizing(true)
    setOptimizerResult(null)
    try {
      const system = buildOptimizerContext(trip, stops)
      const result = await callClaude({
        system,
        messages: [{ role: 'user', content: 'Analyze this trip and suggest optimizations.' }],
      })
      setOptimizerResult(result)
    } catch (e) {
      setOptimizerResult('Error: ' + (e.message || 'Could not reach AI. Check your API key.'))
    }
    setOptimizing(false)
  }

  function onStopCreated() {
    setShowCreate(false)
    loadData()
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
      <div className="spinner" />
    </div>
  )
  if (!trip) return <div className="page" style={{ paddingTop: 32, color: 'var(--text-secondary)' }}>Trip not found.</div>

  const heroImg = stops.length > 0 ? getPlaceImage(stops[0].name) : null
  const countdown = daysUntil(trip.start_date)
  const nights = nightsCount(trip.start_date, trip.end_date)

  return (
    <>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
        padding: '28px 20px 24px',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {heroImg && (
          <div style={{
            position: 'absolute', inset: 0,
            background: `url(${heroImg.image_url}) center/cover no-repeat`,
            opacity: 0.18,
          }} />
        )}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          {countdown && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 5,
              background: 'rgba(37,99,235,0.9)', color: '#fff',
              fontSize: '0.7rem', fontWeight: 700,
              padding: '3px 10px', borderRadius: 20, marginBottom: 10,
              fontFamily: 'var(--font-display)',
            }}>
              ✈ {countdown}
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1,
            }}>
              {trip.name}
            </div>
            <div style={{ display: 'flex', gap: 4 }}>
              <button
                className="btn-icon"
                title="Edit trip"
                onClick={() => setShowEdit(true)}
                style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1rem', flexShrink: 0, marginTop: 4 }}
              >
                ✎
              </button>
              <button
                className="btn-icon"
                title="Delete trip"
                onClick={deleteTrip}
                disabled={deletingTrip}
                style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', flexShrink: 0, marginTop: 4 }}
              >
                🗑️
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            {(trip.start_date || trip.end_date) && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
                📅 {[trip.start_date, trip.end_date].filter(Boolean).map(formatDate).join(' – ')}
              </span>
            )}
            {stops.length > 0 && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
                📍 {stops.length} {stops.length === 1 ? 'stop' : 'stops'}
              </span>
            )}
            {nights && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.65)' }}>
                ⏱ {nights} nights
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 20 }}>
        {/* Optimizer button */}
        <button
          className="btn btn-ghost"
          style={{ width: '100%', justifyContent: 'center', gap: 8, marginBottom: 24 }}
          onClick={runOptimizer}
          disabled={optimizing}
        >
          {optimizing ? <><div className="spinner" /> Analyzing trip...</> : '✦ Optimize Trip Order'}
        </button>
        {optimizerResult && (
          <div className="optimizer-result" style={{ marginTop: -16, marginBottom: 16 }}>
            {optimizerResult}
          </div>
        )}

        {/* Stops section */}
        <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'var(--font-display)' }}>
            Stops
          </span>
          <button
            className="btn btn-primary"
            style={{ padding: '7px 14px', fontSize: '0.82rem' }}
            onClick={() => setShowCreate(true)}
          >
            + Add Stop
          </button>
        </div>

        {stops.length === 0 ? (
          <div className="empty-state">
            <span className="icon">📍</span>
            <p>No stops yet. Add your first destination.</p>
          </div>
        ) : (
          <div style={{ position: 'relative' }}>
            {/* Timeline vertical line */}
            <div style={{
              position: 'absolute', left: 13, top: 18, bottom: 18,
              width: 2, background: 'var(--border)', zIndex: 0,
            }} />

            {stops.map((stop, i) => {
              const img = getPlaceImage(stop.name)
              const itemCount = stop.vault_items?.[0]?.count ?? 0
              const n = nightsCount(stop.start_date, stop.end_date)
              return (
                <div key={stop.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative', paddingBottom: 2 }}>
                  {/* Number dot */}
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: '#fff', border: '2px solid var(--primary)',
                    color: 'var(--primary)', fontSize: '0.72rem', fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-display)', flexShrink: 0, zIndex: 1,
                    marginTop: 10,
                  }}>
                    {i + 1}
                  </div>

                  {/* Stop card */}
                  <div
                    onClick={() => navigate(`/trip/${tripId}/stop/${stop.id}`)}
                    style={{
                      flex: 1, background: 'var(--bg-surface)', border: '1px solid var(--border)',
                      borderRadius: 12, padding: '13px 16px',
                      boxShadow: 'var(--shadow-sm)',
                      display: 'flex', alignItems: 'center', gap: 12,
                      cursor: 'pointer', marginBottom: 8,
                      transition: 'all 0.15s',
                    }}
                    onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--border-hover)'; e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'none' }}
                  >
                    {/* Thumbnail */}
                    {img ? (
                      <div style={{ width: 42, height: 42, borderRadius: 8, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={img.thumb_url} alt={stop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    ) : (
                      <div style={{
                        width: 42, height: 42, borderRadius: 8,
                        background: 'linear-gradient(135deg, var(--bg-elevated), var(--border))',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.1rem', flexShrink: 0,
                      }}>
                        📍
                      </div>
                    )}

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                        {stop.name}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                        {stop.start_date && formatDate(stop.start_date)}
                        {stop.start_date && stop.end_date && ' – '}
                        {stop.end_date && formatDate(stop.end_date)}
                        {n && ` · ${n} night${n > 1 ? 's' : ''}`}
                      </div>
                    </div>

                    {/* Items count */}
                    {itemCount > 0 && (
                      <span style={{
                        fontSize: '0.7rem', fontWeight: 600,
                        background: 'var(--primary-dim)', color: 'var(--primary)',
                        padding: '2px 7px', borderRadius: 10, whiteSpace: 'nowrap', flexShrink: 0,
                      }}>
                        {itemCount} item{itemCount !== 1 ? 's' : ''}
                      </span>
                    )}
                    <span style={{ color: 'var(--text-muted)', flexShrink: 0 }}>›</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateStopModal
          tripId={tripId}
          orderIndex={stops.length}
          onClose={() => setShowCreate(false)}
          onCreated={onStopCreated}
        />
      )}
      {showEdit && trip && (
        <EditTripModal
          trip={trip}
          onClose={() => setShowEdit(false)}
          onSaved={(updated) => { setTrip(updated); setShowEdit(false) }}
        />
      )}
    </>
  )
}
