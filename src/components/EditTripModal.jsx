import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function EditTripModal({ trip, onClose, onSaved }) {
  const [name, setName] = useState(trip.name || '')
  const [startDate, setStartDate] = useState(trip.start_date || '')
  const [endDate, setEndDate] = useState(trip.end_date || '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    const { data, error } = await supabase.from('trips').update({
      name: name.trim(),
      start_date: startDate || null,
      end_date: endDate || null,
    }).eq('id', trip.id).select().single()
    if (error) { setError(error.message); setSaving(false); return }
    onSaved(data)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ paddingBottom: 32 }}>

        {/* Drag handle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20, marginTop: -8 }}>
          <div style={{ width: 36, height: 4, borderRadius: 2, background: 'var(--border)' }} />
        </div>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Edit Trip
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
              Update your trip details
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="auth-error" style={{ marginBottom: 16 }}>{error}</div>}

          {/* Trip name */}
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
              Trip Name
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

          {/* Dates */}
          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.07em', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
              Dates
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 8 }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>From</div>
                <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', paddingTop: 20 }}>→</div>
              <div>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: 4 }}>To</div>
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
  )
}
