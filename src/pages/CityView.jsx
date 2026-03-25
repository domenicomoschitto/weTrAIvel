import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlaceImage, getFlag } from '../data/places'
import { getCityData } from '../data/cities'
import AddStopToTripModal from '../components/AddStopToTripModal'

export default function CityView() {
  const { cityName } = useParams()
  const navigate = useNavigate()
  const [showAddStop, setShowAddStop] = useState(false)

  const place = getPlaceImage(cityName)
  const cityData = getCityData(cityName)

  const displayName = place?.display_name || cityName
  const countryCode = place?.country_code || ''
  const flag = countryCode ? getFlag(countryCode) : ''
  const imageUrl = place?.image_url || null

  const attractionsUrl = `https://www.tripadvisor.com/Search?q=${encodeURIComponent(displayName + ' attractions')}`

  return (
    <>
      {/* Hero */}
      <div style={{ position: 'relative', height: 240, overflow: 'hidden', background: '#0a0a1a', flexShrink: 0 }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={displayName}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(160deg, #0a0a1a 0%, #0f2040 50%, #1a3060 100%)' }} />
        )}

        {/* Gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.2) 40%, rgba(0,0,0,0.72) 100%)',
        }} />

        {/* Back button */}
        <button
          className="btn btn-ghost"
          onClick={() => navigate(-1)}
          style={{
            position: 'absolute',
            top: 14,
            left: 14,
            background: 'rgba(0,0,0,0.35)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff',
            backdropFilter: 'blur(8px)',
            fontSize: '0.78rem',
            padding: '7px 13px',
            zIndex: 2,
          }}
        >
          ← Back
        </button>

        {/* City name + tagline */}
        <div style={{ position: 'absolute', bottom: 20, left: 18, right: 18, zIndex: 2 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            color: '#fff',
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 6,
            textShadow: '0 2px 12px rgba(0,0,0,0.5)',
          }}>
            {displayName}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            {flag && <span style={{ fontSize: '1.1rem' }}>{flag}</span>}
            {cityData?.facts?.country && (
              <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.75)', fontWeight: 500 }}>
                {cityData.facts.country}
              </span>
            )}
            {cityData?.tagline && (
              <>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>·</span>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', fontStyle: 'italic' }}>
                  {cityData.tagline}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sticky action bar */}
      <div style={{
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'var(--bg-surface)',
        borderBottom: '1px solid var(--border)',
        padding: '10px 14px',
        display: 'flex',
        gap: 8,
        overflowX: 'auto',
        scrollbarWidth: 'none',
        boxShadow: 'var(--shadow-sm)',
      }}>
        <button
          className="btn btn-primary"
          style={{ flexShrink: 0, fontSize: '0.78rem', padding: '8px 14px' }}
          onClick={() => navigate(`/flights?to=${encodeURIComponent(displayName)}`)}
        >
          ✈ Search Flights
        </button>
        <button
          className="btn btn-ghost"
          style={{ flexShrink: 0, fontSize: '0.78rem', padding: '8px 14px' }}
          onClick={() => navigate(`/hotels?destination=${encodeURIComponent(displayName)}`)}
        >
          🏨 Find Hotels
        </button>
        <a
          href={attractionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{ flexShrink: 0, fontSize: '0.78rem', padding: '8px 14px' }}
        >
          🗺️ Attractions
        </a>
        <button
          className="btn btn-ghost"
          onClick={() => setShowAddStop(true)}
          style={{ flexShrink: 0, fontSize: '0.78rem', padding: '8px 14px' }}
        >
          📍 Add to Trip
        </button>
      </div>

      {/* Page body */}
      <div className="page page-tabbed" style={{ paddingTop: 20 }}>

        {cityData ? (
          <>
            {/* Quick facts chips */}
            <div style={{
              display: 'flex',
              gap: 8,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              paddingBottom: 4,
              marginBottom: 20,
            }}>
              {cityData.facts.language && (
                <FactChip icon="🗣" label={cityData.facts.language} />
              )}
              {cityData.facts.currency && (
                <FactChip icon="💰" label={cityData.facts.currency} />
              )}
              {cityData.facts.airport && (
                <FactChip icon="✈" label={cityData.facts.airport} />
              )}
              {cityData.facts.timezone && (
                <FactChip icon="🕐" label={cityData.facts.timezone} />
              )}
              {cityData.facts.bestTime && (
                <FactChip icon="🌤" label={cityData.facts.bestTime} />
              )}
            </div>

            {/* Description */}
            <p style={{
              fontSize: '0.9rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.7,
              marginBottom: 28,
            }}>
              {cityData.description}
            </p>

            {/* Traveler Needs */}
            {cityData.travelerNeeds?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <span className="section-title">What Every Traveler Needs</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cityData.travelerNeeds.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: 13,
                        padding: '13px 15px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <span style={{ fontSize: '1.25rem', flexShrink: 0, lineHeight: 1.3 }}>{item.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 3 }}>
                          {item.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                          {item.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Official Links */}
            {cityData.officialLinks?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <div className="section-header" style={{ marginBottom: 14 }}>
                  <span className="section-title">Official Links & Tickets</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityData.officialLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 13,
                        padding: '13px 15px',
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border)',
                        borderRadius: 'var(--radius-lg)',
                        textDecoration: 'none',
                        transition: 'border-color 0.15s, box-shadow 0.15s',
                        boxShadow: 'var(--shadow-sm)',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = 'var(--border-hover)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'var(--border)'
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)'
                      }}
                    >
                      <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>{link.icon}</span>
                      <span style={{
                        flex: 1,
                        fontSize: '0.88rem',
                        fontWeight: 600,
                        color: 'var(--text-primary)',
                      }}>
                        {link.label}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', flexShrink: 0 }}>↗</span>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* No city data — generic helpful block */
          <div style={{ marginBottom: 28 }}>
            {/* Quick info if we have place data */}
            {place && (
              <div style={{
                display: 'flex',
                gap: 8,
                overflowX: 'auto',
                scrollbarWidth: 'none',
                paddingBottom: 4,
                marginBottom: 20,
              }}>
                {countryCode && <FactChip icon={flag} label={place.country_code} />}
              </div>
            )}

            <div style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px 20px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🗺️</div>
              <div style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 8,
              }}>
                Explore {displayName}
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                Use the links above to search for flights, hotels, and top attractions. Add this destination to a trip to start planning your visit.
              </p>
              <button
                className="btn btn-primary"
                style={{ fontSize: '0.82rem' }}
                onClick={() => setShowAddStop(true)}
              >
                📍 Add to a Trip
              </button>
            </div>
          </div>
        )}

        {/* Plan this trip banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)',
          borderRadius: 'var(--radius-xl)',
          padding: '22px 20px',
          marginBottom: 16,
          position: 'relative',
          overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', right: -8, top: -8, fontSize: '4.5rem', opacity: 0.07 }}>✈</div>
          <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: 'var(--font-display)', marginBottom: 6 }}>
            Ready to go?
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color: '#fff', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Plan your {displayName} trip with AI
          </div>
          <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.5, marginBottom: 14 }}>
            Get a custom itinerary, best stops, transport tips and more — instantly.
          </p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.78rem' }}
              onClick={() => window.dispatchEvent(new CustomEvent('volare:open-ai-chat', { detail: { mode: 'research', city: displayName } }))}
            >
              ✦ Ask AI
            </button>
            <button
              className="btn"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.15)', fontSize: '0.78rem' }}
              onClick={() => setShowAddStop(true)}
            >
              📍 Add to Trip
            </button>
          </div>
        </div>
      </div>

      {/* Add to Trip Modal */}
      {showAddStop && (
        <AddStopToTripModal
          cityName={cityName}
          onClose={() => setShowAddStop(false)}
        />
      )}
    </>
  )
}

function FactChip({ icon, label }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 5,
      padding: '5px 11px',
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 20,
      fontSize: '0.75rem',
      fontWeight: 600,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      boxShadow: 'var(--shadow-sm)',
    }}>
      <span>{icon}</span>
      <span>{label}</span>
    </div>
  )
}
