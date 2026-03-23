import { useState, useMemo } from 'react'
import { supabase } from '../lib/supabase'
import { getPlaceImage, getFlag } from '../data/places'

export default function EditStopModal({ stop, onClose, onSaved }) {
  const [name, setName] = useState(stop.name || '')
  const [startDate, setStartDate] = useState(stop.start_date || '')
  const [endDate, setEndDate] = useState(stop.end_date || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const place = useMemo(() => {
    const p = getPlaceImage(name.trim())
    return p?.image_url ? p : null
  }, [name])

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    const { data, error } = await supabase.from('stops').update({
      name: name.trim(),
      start_date: startDate || null,
      end_date: endDate || null,
    }).eq('id', stop.id).select().single()
    if (error) { setError(error.message); setSaving(false); return }
    onSaved(data)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ padding: 0, overflow: 'hidden', paddingBottom: 32 }}>

        {/* Hero image */}
        <div style={{
          position: 'relative',
          height: place ? 120 : 0,
          overflow: 'hidden',
          transition: 'height 0.3s ease',
          borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
        }}>
          {place && (
            <>
              <img src={place.image_url} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)' }} />
              <div style={{ position: 'absolute', bottom: 12, left: 16, right: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: '1.4rem' }}>{getFlag(place.country_code)}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                  {place.display_name || name.trim()}
                </span>
              </div>
            </>
          )}
        </div>

        <div style={{ padding: '20px 20px 0' }}>
          {!place && (
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: -4 }}>
              <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, marginTop: place ? 16 : 0 }}>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Edit Stop
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                Update stop details
              </div>
            </div>
            <button className="btn-icon" onClick={onClose} style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>✕</button>
          </div>

          <form onSubmit={handleSubmit}>
            {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                City / Destination
              </label>
              <input
                className="input"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
                style={{ fontSize: '1rem', fontWeight: 600, fontFamily: 'var(--font-display)' }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
                Dates
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
              disabled={saving || !name.trim()}
              style={{ width: '100%', justifyContent: 'center', padding: '13px', fontSize: '0.9rem' }}
            >
              {saving ? <div className="spinner" /> : '✓ Save Changes'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
