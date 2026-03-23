import { useState } from 'react'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { id: 'transport',     icon: '✈️', label: 'Transport' },
  { id: 'accommodation', icon: '🏨', label: 'Accommodation' },
  { id: 'documents',     icon: '📄', label: 'Documents' },
  { id: 'links',         icon: '🔗', label: 'Links' },
  { id: 'notes',         icon: '📝', label: 'Notes' },
  { id: 'people',        icon: '👤', label: 'People' },
]

const TYPES = {
  transport:     ['text', 'link'],
  accommodation: ['text', 'link'],
  documents:     ['text', 'file'],
  links:         ['link'],
  notes:         ['text'],
  people:        ['text'],
}

export default function AddItemModal({ stopId, onClose, onCreated }) {
  const [category, setCategory] = useState('transport')
  const [type, setType] = useState('text')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [date, setDate] = useState('')
  const [file, setFile] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  function onCategoryChange(cat) {
    setCategory(cat)
    const types = TYPES[cat]
    if (!types.includes(type)) setType(types[0])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)

    let fileUrl = null
    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${stopId}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('vault-files')
        .upload(path, file)
      if (uploadError) { setError(uploadError.message); setSaving(false); return }
      const { data: urlData } = supabase.storage.from('vault-files').getPublicUrl(path)
      fileUrl = urlData.publicUrl
    }

    const { error } = await supabase.from('vault_items').insert({
      stop_id: stopId,
      category,
      type,
      title: title.trim(),
      content: content.trim() || null,
      file_url: fileUrl,
      metadata: date ? { date } : null,
    })
    if (error) { setError(error.message); setSaving(false); return }
    onCreated()
  }

  const availableTypes = TYPES[category]

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <span className="modal-title">Add to Vault</span>
          <button className="btn-icon" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {error && <div className="auth-error">{error}</div>}

            {/* Category selector */}
            <div className="form-group">
              <label className="form-label">Category</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => onCategoryChange(cat.id)}
                    style={{
                      padding: '8px 6px',
                      borderRadius: 'var(--radius-md)',
                      border: `1px solid ${category === cat.id ? 'var(--primary)' : 'var(--border)'}`,
                      background: category === cat.id ? 'var(--primary-dim)' : 'var(--bg-elevated)',
                      color: category === cat.id ? 'var(--primary)' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 4,
                      fontFamily: 'var(--font)',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type selector (if multiple options) */}
            {availableTypes.length > 1 && (
              <div className="form-group">
                <label className="form-label">Type</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {availableTypes.map(t => (
                    <button
                      key={t}
                      type="button"
                      className={`cat-tab${type === t ? ' active' : ''}`}
                      onClick={() => setType(t)}
                    >
                      {t === 'text' ? '📝 Text' : t === 'link' ? '🔗 Link' : '📎 File'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Title */}
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                className="input"
                placeholder={
                  category === 'transport' ? 'e.g. Train Rome → Florence' :
                  category === 'accommodation' ? 'e.g. Hotel Santa Maria' :
                  category === 'documents' ? 'e.g. Passport' :
                  category === 'links' ? 'e.g. Hotel booking' :
                  category === 'people' ? 'e.g. Travel companion' :
                  'Title'
                }
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                autoFocus
              />
            </div>

            {/* Content: text or link */}
            {(type === 'text' || type === 'link') && (
              <div className="form-group">
                <label className="form-label">
                  {type === 'link' ? 'URL' : 'Details'}
                </label>
                {type === 'link' ? (
                  <input
                    className="input"
                    type="url"
                    placeholder="https://..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                ) : (
                  <textarea
                    className="textarea"
                    placeholder={
                      category === 'transport' ? 'Train number, seat, platform, departure time…' :
                      category === 'accommodation' ? 'Booking ref, check-in time, address, WiFi…' :
                      category === 'people' ? 'Name, phone, role…' :
                      'Notes…'
                    }
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                )}
              </div>
            )}

            {/* File upload */}
            {type === 'file' && (
              <div className="form-group">
                <label className="form-label">File (PDF, image)</label>
                <input
                  className="input"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png,.webp"
                  onChange={e => setFile(e.target.files[0])}
                  style={{ cursor: 'pointer' }}
                />
              </div>
            )}

            {/* Optional date */}
            {(category === 'transport' || category === 'accommodation') && (
              <div className="form-group">
                <label className="form-label">Date (optional)</label>
                <input
                  className="input"
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={saving || !title.trim()}>
              {saving ? <div className="spinner" /> : 'Add to Vault'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
