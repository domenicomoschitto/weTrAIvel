import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function CreateStopModal({ tripId, orderIndex, onClose, onCreated }) {
  const [name, setName] = useState('')
  const [location, setLocation] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    setError(null)
    const { error } = await supabase.from('stops').insert({
      trip_id: tripId,
      name: name.trim(),
      location: location.trim() || null,
      start_date: startDate || null,
      end_date: endDate || null,
      order_index: orderIndex,
    })
    if (error) { setError(error.message); setSaving(false); return }
    onCreated()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Add Stop</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="auth-error">{error}</div>}
            <div className="form-group">
              <label className="form-label">City / Destination *</label>
              <input
                className="input"
                placeholder="e.g. Rome"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoFocus
              />
            </div>
            <div className="form-group">
              <label className="form-label">Location / Country</label>
              <input
                className="input"
                placeholder="e.g. Rome, Italy"
                value={location}
                onChange={e => setLocation(e.target.value)}
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Arrival</label>
                <input className="input" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
              </div>
              <div className="form-group">
                <label className="form-label">Departure</label>
                <input className="input" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !name.trim()}>
              {saving ? <div className="spinner" /> : 'Add Stop'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
