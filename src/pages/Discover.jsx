import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getPlaceImage, getFlag } from '../data/places'

// Curated city collections
const COLLECTIONS = [
  {
    id: 'hot',
    label: '🔥 Hot Right Now',
    cities: ['tropea', 'siracusa', 'lecce', 'agrigento', 'catania', 'palermo'],
  },
  {
    id: 'city-breaks',
    label: '🏙️ City Breaks',
    cities: ['rome', 'milan', 'florence', 'naples', 'bologna', 'paris', 'amsterdam', 'prague', 'vienna', 'berlin'],
  },
  {
    id: 'italy',
    label: '🇮🇹 Italy — Deep Cuts',
    cities: ['siena', 'verona', 'padova', 'genoa', 'modena', 'pisa', 'salerno', 'bari', 'brindisi', 'reggio-emilia', 'livorno', 'rimini', 'caserta'],
  },
  {
    id: 'coastal',
    label: '🌊 Coastal Gems',
    cities: ['positano', 'amalfi', 'tropea', 'siracusa', 'mykonos', 'nice', 'dubrovnik', 'santorini'],
  },
  {
    id: 'spain',
    label: '🇪🇸 Spain',
    cities: ['madrid', 'barcelona', 'sevilla', 'granada', 'bilbao', 'valencia', 'malaga', 'palma', 'cordoba', 'las-palmas'],
  },
  {
    id: 'spain-deep',
    label: '🇪🇸 Spain — Beyond the Classics',
    cities: ['zaragoza', 'murcia', 'alicante', 'valladolid', 'vigo', 'gijon', 'vitoria-gasteiz', 'a-coruna', 'elche', 'oviedo'],
  },
  {
    id: 'hidden',
    label: '💎 Hidden Gems',
    cities: ['lecce', 'tropea', 'siena', 'agrigento', 'modena', 'bologna', 'valletta', 'edinburgh', 'sintra', 'vitoria-gasteiz', 'vigo', 'elche'],
  },
  {
    id: 'nature',
    label: '🏔️ Nature & Scenery',
    cities: ['zurich', 'interlaken', 'cinque-terre', 'agrigento', 'tuscany', 'santorini'],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All', icon: '✦' },
  { id: 'beaches', label: 'Beaches', icon: '🏖️' },
  { id: 'cities', label: 'Cities', icon: '🏙️' },
  { id: 'culture', label: 'Culture', icon: '🏛️' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'food', label: 'Food & Wine', icon: '🍷' },
  { id: 'nightlife', label: 'Nightlife', icon: '🎶' },
]

const CATEGORY_COLLECTIONS = {
  beaches: ['tropea', 'siracusa', 'santorini', 'mykonos', 'positano', 'rimini', 'ibiza', 'nice', 'dubrovnik', 'malaga', 'alicante', 'palma', 'las-palmas', 'valencia'],
  cities: ['rome', 'milan', 'florence', 'naples', 'paris', 'barcelona', 'berlin', 'amsterdam', 'vienna', 'madrid', 'bilbao', 'sevilla'],
  culture: ['agrigento', 'siracusa', 'athens', 'florence', 'rome', 'palermo', 'lecce', 'prague', 'istanbul', 'edinburgh', 'cordoba', 'granada', 'sevilla', 'bilbao'],
  nature: ['zurich', 'interlaken', 'cinque-terre', 'tuscany', 'agrigento', 'amalfi', 'santorini', 'las-palmas', 'vigo'],
  food: ['modena', 'bologna', 'naples', 'palermo', 'catania', 'paris', 'barcelona', 'porto', 'madrid', 'sevilla', 'bilbao', 'valencia'],
  nightlife: ['rimini', 'berlin', 'ibiza', 'barcelona', 'amsterdam', 'madrid', 'prague'],
}

function DestCard({ cityName, onClick }) {
  const place = getPlaceImage(cityName)
  if (!place?.image_url) return null
  const flag = getFlag(place.country_code)
  return (
    <div className="dest-card" onClick={onClick}>
      <img src={place.image_url} alt={place.display_name || cityName} loading="lazy" />
      <div className="dest-card-overlay" />
      <div className="dest-card-info">
        <div className="dest-card-name">{place.display_name || cityName}</div>
        <div className="dest-card-sub">{flag} {place.country_code}</div>
      </div>
    </div>
  )
}

function CollectionRow({ label, cities, onCityClick }) {
  const visible = cities.filter(c => getPlaceImage(c)?.image_url)
  if (!visible.length) return null
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="section-header">
        <span className="section-title">{label}</span>
      </div>
      <div className="dest-scroll">
        {visible.map(city => (
          <DestCard key={city} cityName={city} onClick={() => onCityClick(city)} />
        ))}
      </div>
    </div>
  )
}

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState('all')
  const navigate = useNavigate()

  function handleCityClick(cityName) {
    navigate(`/city/${cityName}`)
  }

  const collections = activeCategory === 'all'
    ? COLLECTIONS
    : [{ id: activeCategory, label: CATEGORIES.find(c => c.id === activeCategory)?.label || '', cities: CATEGORY_COLLECTIONS[activeCategory] || [] }]

  return (
    <>
      {/* Hero */}
      <div className="discover-hero">
        {/* Subtle star particles effect via CSS */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle at 20% 30%, rgba(37,99,235,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(124,58,237,0.1) 0%, transparent 50%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8, fontFamily: 'var(--font-display)' }}>
            ✦ Explore Europe
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 6 }}>
            Where to next?
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5 }}>
            Discover cities, plan trips, find experiences across Europe.
          </p>
          <div className="discover-search" onClick={() => {}}>
            <span style={{ fontSize: '1rem', opacity: 0.6 }}>🔍</span>
            <span style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Search destinations…</span>
          </div>
        </div>
      </div>

      <div className="page page-tabbed" style={{ paddingTop: 20 }}>
        {/* Category chips */}
        <div className="category-chips" style={{ marginBottom: 24 }}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`category-chip${activeCategory === cat.id ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Collections */}
        {collections.map(col => (
          <CollectionRow
            key={col.id}
            label={col.label}
            cities={col.cities}
            onCityClick={handleCityClick}
          />
        ))}

        {/* Inspiration banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px 20px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -10, top: -10, fontSize: '5rem', opacity: 0.08 }}>✈</div>
          <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 8 }}>
            AI Travel Planner
          </div>
          <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 8 }}>
            Let AI plan your perfect trip
          </div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5, marginBottom: 16 }}>
            Tell us your dream destination and we'll build an itinerary, suggest stops, and optimize your route.
          </p>
          <button
            className="btn"
            style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.8rem' }}
            onClick={() => window.dispatchEvent(new CustomEvent('volare:open-ai-chat', { detail: { mode: 'research' } }))}
          >
            ✦ Start Planning
          </button>
        </div>
      </div>

    </>
  )
}
