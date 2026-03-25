import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getPlaceImage, getFlag } from '../data/places'
import CreateTripModal from './CreateTripModal'

export default function AddStopToTripModal({ cityName, onClose }) {
  const navigate = useNavigate()
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)
  const [showCreateTrip, setShowCreateTrip] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedTripId, setSelectedTripId] = useState(null)
  const [step, setStep] = useState('pick') // 'pick' | 'dates'

  const place = useMemo(() => {
    const p = getPlaceImage(cityName)
    return p?.image_url ? p : null
  }, [cityName])

  useEffect(() => { loadTrips() }, [])

  async function loadTrips() {
    const { data } = await supabase
      .from('trips')
      .select('id, name')
      .order('created_at', { ascending: false })
    setTrips(data || [])
    setLoading(false)
  }

  function handleTripSelect(tripId) {
    setSelectedTripId(tripId)
    setStep('dates')
  }

  async function handleAddStop(e) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { data: existingStops } = await supabase
      .from('stops')
      .select('id')
      .eq('trip_id', selectedTripId)
    const orderIndex = existingStops?.length || 0
    const { error: err } = await supabase.from('stops').insert({
      trip_id: selectedTripId,
      name: cityName,
      location: place ? (place.display_name || cityName) : cityName,
      start_date: startDate || null,
      end_date: endDate || null,
      order_index: orderIndex,
    })
    if (err) { setError(err.message); setSaving(false); return }
    onClose()
    navigate(`/trip/${selectedTripId}`)
  }

  async function handleTripCreated(trip) {
    setShowCreateTrip(false)
    await supabase.from('stops').insert({
      trip_id: trip.id,
      name: cityName,
      location: place ? (place.display_name || cityName) : cityName,
      start_date: null,
      end_date: null,
      order_index: 0,
    })
    onClose()
    navigate(`/trip/${trip.id}`)
  }

  if (showCreateTrip) {
    return <CreateTripModal onClose={() => setShowCreateTrip(false)} onCreated={handleTripCreated} />
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', paddingBottom: 32 }}>

        {/* Hero */}
        <div style={{
          position: 'relative',
          height: place ? 120 : 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        }}>
          {place && (
            <>
              <img src={place.image_url} alt={cityName} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>{getFlag(place.country_code)}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.01em', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {place.display_name || cityName}
                </span>
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {!place && step === 'pick' && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: -4 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
            </div>
          )}

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, marginTop: place ? 16 : 0 }}>
            <div>
              {step === 'pick' ? (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    New Stop
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    Add {place?.display_name || cityName} to a trip
                  </div>
                </>
              ) : (
                <>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                    Set Dates
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                    When are you in {place?.display_name || cityName}?
                  </div>
                </>
              )}
            </div>
            <button
              className="btn-icon"
              onClick={step === 'dates' ? () => setStep('pick') : onClose}
              style={{ fontSize: '1rem', color: 'var(--text-muted)' }}
            >
              {step === 'dates' ? '←' : '✕'}
            </button>
          </div>

          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          {step === 'pick' ? (
            <>
              {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: 32 }}>
                  <div className="spinner" />
                </div>
              ) : trips.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px 0 16px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No trips yet — create one below.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12, maxHeight: 220, overflowY: 'auto' }}>
                  {trips.map(trip => (
                    <button
                      key={trip.id}
                      className="btn"
                      style={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        padding: '12px 16px',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        color: 'var(--text-primary)',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                      }}
                      onClick={() => handleTripSelect(trip.id)}
                    >
                      🗺️ {trip.name}
                    </button>
                  ))}
                </div>
              )}
              <button
                className="btn btn-primary"
                style={{ width: '100%', justifyContent: 'center', marginTop: trips.length ? 4 : 0 }}
                onClick={() => setShowCreateTrip(true)}
              >
                + New Trip
              </button>
            </>
          ) : (
            <form onSubmit={handleAddStop}>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                  Dates (optional)
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Arrival</div>
                    <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: 20 }}>→</div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>Departure</div>
                    <input className="input" type="date" value={endDate} min={startDate} onChange={e => setEndDate(e.target.value)} />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={saving}
                style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.9rem' }}
              >
                {saving ? <div className="spinner" /> : '📍 Add Stop'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
