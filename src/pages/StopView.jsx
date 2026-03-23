import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { getPlaceImage } from '../data/places'
import AddItemModal from '../components/AddItemModal'

const CATEGORIES = ['all', 'transport', 'accommodation', 'documents', 'links', 'notes', 'people']

const CAT_ICONS = {
  transport: '✈️',
  accommodation: '🏨',
  documents: '📄',
  links: '🔗',
  notes: '📝',
  people: '👤',
}

const CAT_LABELS = {
  all: 'All',
  transport: 'Transport',
  accommodation: 'Accommodation',
  documents: 'Documents',
  links: 'Links',
  notes: 'Notes',
  people: 'People',
}

function formatDate(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function formatDateShort(d) {
  if (!d) return null
  return new Date(d + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function nightsCount(start, end) {
  if (!start || !end) return null
  const n = Math.round((new Date(end + 'T00:00:00') - new Date(start + 'T00:00:00')) / (1000 * 60 * 60 * 24))
  return n > 0 ? n : null
}

function VaultItemCard({ item, onDelete }) {
  const icon = CAT_ICONS[item.category] || '📌'

  return (
    <div className="vault-item">
      <div className="vault-item-icon">{icon}</div>
      <div className="vault-item-content">
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
          <div className="vault-item-title">{item.title}</div>
          <button
            className="btn-icon"
            style={{ fontSize: '0.9rem', opacity: 0.5, flexShrink: 0 }}
            onClick={() => onDelete(item.id)}
            title="Delete"
          >
            ✕
          </button>
        </div>
        {item.type === 'link' && item.content ? (
          <a className="vault-item-link" href={item.content} target="_blank" rel="noopener noreferrer">
            {item.content}
          </a>
        ) : item.content ? (
          <div className="vault-item-body">{item.content}</div>
        ) : null}
        {item.file_url && (
          <a className="vault-item-link" href={item.file_url} target="_blank" rel="noopener noreferrer">
            📎 View file
          </a>
        )}
        {item.metadata?.date && (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
            📅 {formatDate(item.metadata.date)}
          </div>
        )}
      </div>
    </div>
  )
}

export default function StopView() {
  const { tripId, stopId } = useParams()
  const navigate = useNavigate()
  const [stop, setStop] = useState(null)
  const [trip, setTrip] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { loadData() }, [stopId])

  async function loadData() {
    setLoading(true)
    const { data: stopData } = await supabase.from('stops').select('*, trips(id, name)').eq('id', stopId).single()
    const { data: itemsData } = await supabase.from('vault_items').select('*').eq('stop_id', stopId).order('created_at', { ascending: false })
    setStop(stopData)
    setTrip(stopData?.trips || null)
    setItems(itemsData || [])
    setLoading(false)
  }

  async function deleteItem(id) {
    await supabase.from('vault_items').delete().eq('id', id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  async function deleteStop() {
    if (!confirm(`Delete "${stop?.name}"? All vault items will be lost.`)) return
    await supabase.from('stops').delete().eq('id', stopId)
    navigate(`/trip/${tripId}`)
  }

  const filtered = activeCategory === 'all'
    ? items
    : items.filter(i => i.category === activeCategory)

  const countFor = (cat) => cat === 'all' ? items.length : items.filter(i => i.category === cat).length

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: 64 }}>
      <div className="spinner" />
    </div>
  )
  if (!stop) return <div className="page" style={{ paddingTop: 32, color: 'var(--text-secondary)' }}>Stop not found.</div>

  const placeImg = getPlaceImage(stop.name)
  const nights = nightsCount(stop.start_date, stop.end_date)

  return (
    <>
      {/* Hero strip */}
      <div style={{
        position: 'relative',
        height: 180,
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #0f2027, #203a43)',
      }}>
        {placeImg ? (
          <img
            src={placeImg.image_url}
            alt={stop.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        ) : null}
        {/* Gradient overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(10,10,15,0.88) 0%, rgba(10,10,15,0.25) 55%, transparent 100%)',
        }} />
        {/* Content */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          padding: '16px 20px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            {trip && (
              <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.55)', marginBottom: 4 }}>
                {trip.name}
              </div>
            )}
            <div style={{
              fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800,
              color: '#fff', letterSpacing: '-0.02em',
            }}>
              {stop.name}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 4, flexWrap: 'wrap' }}>
              {(stop.start_date || stop.end_date) && (
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                  📅 {formatDateShort(stop.start_date)}{stop.end_date ? ` – ${formatDateShort(stop.end_date)}` : ''}
                </span>
              )}
              {nights && (
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                  ⏱ {nights} night{nights > 1 ? 's' : ''}
                </span>
              )}
              {stop.location && (
                <span style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.65)' }}>
                  📍 {stop.location}
                </span>
              )}
            </div>
          </div>
          <button
            className="btn-icon"
            title="Delete stop"
            onClick={deleteStop}
            style={{ color: 'rgba(255,255,255,0.35)', fontSize: '1rem', flexShrink: 0 }}
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="page" style={{ paddingTop: 16 }}>
        {/* Category tabs */}
        <div className="cat-tabs" style={{ marginBottom: 16 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`cat-tab${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat !== 'all' && CAT_ICONS[cat] + ' '}
              {CAT_LABELS[cat]}
              {countFor(cat) > 0 && (
                <span style={{
                  marginLeft: 5,
                  background: activeCategory === cat ? 'rgba(56,189,248,0.2)' : 'var(--bg-elevated)',
                  borderRadius: 10,
                  padding: '1px 6px',
                  fontSize: '0.7rem',
                }}>
                  {countFor(cat)}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Vault items */}
        {filtered.length === 0 ? (
          <div className="empty-state">
            <span className="icon">{activeCategory !== 'all' ? CAT_ICONS[activeCategory] : '📦'}</span>
            <p>
              {activeCategory === 'all'
                ? 'No items yet. Tap + to add tickets, bookings, notes, and anything you need.'
                : `No ${CAT_LABELS[activeCategory].toLowerCase()} items yet.`}
            </p>
          </div>
        ) : (
          <div className="flex-col gap-2">
            {filtered.map(item => (
              <VaultItemCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </div>
        )}
      </div>

      {/* FAB — Add item */}
      <button className="fab" onClick={() => setShowAdd(true)} title="Add item">+</button>

      {showAdd && (
        <AddItemModal
          stopId={stopId}
          onClose={() => setShowAdd(false)}
          onCreated={() => { setShowAdd(false); loadData() }}
        />
      )}
    </>
  )
}
