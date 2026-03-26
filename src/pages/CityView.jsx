import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getPlaceImage, getFlag } from '../data/places'
import { getCityData } from '../data/cities'
import AddStopToTripModal from '../components/AddStopToTripModal'

const RATING_COLORS = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981']

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
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexWrap: 'wrap' }}>
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
              {cityData.facts.language && <FactChip icon="🗣" label={cityData.facts.language} />}
              {cityData.facts.currency && <FactChip icon="💰" label={cityData.facts.currency} />}
              {cityData.facts.airport && <FactChip icon="✈" label={cityData.facts.airport} />}
              {cityData.facts.timezone && <FactChip icon="🕐" label={cityData.facts.timezone} />}
              {cityData.facts.bestTime && <FactChip icon="🌤" label={cityData.facts.bestTime} />}
              {cityData.facts.plug && <FactChip icon="🔌" label={cityData.facts.plug} />}
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

            {/* Budget Estimator */}
            {cityData.budget && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Daily Budget Estimator" />
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                  <BudgetCard tier="Budget" icon="🎒" color="#22c55e" data={cityData.budget.budget} />
                  <BudgetCard tier="Mid" icon="🧳" color="#3b82f6" data={cityData.budget.mid} />
                  <BudgetCard tier="Luxury" icon="💼" color="#a855f7" data={cityData.budget.luxury} />
                </div>
              </section>
            )}

            {/* Recommended Stay + Getting Around (side by side) */}
            <div style={{ display: 'grid', gridTemplateColumns: cityData.gettingAround ? '1fr 1fr' : '1fr', gap: 12, marginBottom: 28 }}>
              {cityData.recommendedDays && (
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    🗓 Recommended Stay
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', letterSpacing: '-0.02em', lineHeight: 1 }}>
                    {cityData.recommendedDays.min}–{cityData.recommendedDays.max}
                    <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)', marginLeft: 4 }}>days</span>
                  </div>
                  {cityData.recommendedDays.note && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.4 }}>
                      {cityData.recommendedDays.note}
                    </div>
                  )}
                </div>
              )}

              {cityData.gettingAround && (
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg)',
                  padding: '14px 16px',
                }}>
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
                    🚇 Getting Around
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 4 }}>
                    {cityData.gettingAround.transit}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                    🚗 Car needed: <strong style={{ color: cityData.gettingAround.carNeeded ? '#ef4444' : '#22c55e' }}>
                      {cityData.gettingAround.carNeeded ? 'Yes' : 'No'}
                    </strong>
                  </div>
                  {cityData.gettingAround.taxiApps?.length > 0 && (
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {cityData.gettingAround.taxiApps.map(app => (
                        <span key={app} style={{
                          fontSize: '0.65rem',
                          fontWeight: 600,
                          padding: '2px 7px',
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border)',
                          borderRadius: 10,
                          color: 'var(--text-secondary)',
                        }}>{app}</span>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Monthly Weather */}
            {cityData.monthlyWeather?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Best Time to Visit" />
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(6, 1fr)',
                  gap: 6,
                }}>
                  {cityData.monthlyWeather.map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'var(--bg-surface)',
                        border: `1px solid ${m.rating >= 4 ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                        borderRadius: 'var(--radius-md)',
                        padding: '9px 6px',
                        textAlign: 'center',
                        position: 'relative',
                      }}
                    >
                      <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 5 }}>
                        {m.month}
                      </div>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: RATING_COLORS[m.rating] || '#666',
                        margin: '0 auto 5px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 800,
                        color: '#fff',
                      }}>
                        {m.rating}
                      </div>
                      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {m.temp}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 10, flexWrap: 'wrap' }}>
                  {[{ r: 5, label: 'Excellent' }, { r: 4, label: 'Good' }, { r: 3, label: 'Decent' }, { r: 2, label: 'Off-peak' }, { r: 1, label: 'Avoid' }].map(({ r, label }) => (
                    <div key={r} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: RATING_COLORS[r] }} />
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Neighborhoods */}
            {cityData.neighborhoods?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Neighborhoods" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityData.neighborhoods.map((n, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 14px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0, lineHeight: 1.3 }}>🏘️</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{n.name}</span>
                          {n.stayHere && (
                            <span style={{
                              fontSize: '0.58rem',
                              fontWeight: 700,
                              padding: '2px 6px',
                              background: 'rgba(34,197,94,0.15)',
                              color: '#22c55e',
                              borderRadius: 8,
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              border: '1px solid rgba(34,197,94,0.3)',
                            }}>Stay here</span>
                          )}
                        </div>
                        <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)', marginBottom: 3 }}>{n.vibe}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>{n.note}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Top Attractions */}
            {cityData.topAttractions?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Top Attractions" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cityData.topAttractions.map((a, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      padding: '13px 15px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: '50%',
                        background: 'var(--bg-elevated)',
                        border: '1px solid var(--border)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        color: 'var(--text-muted)',
                        flexShrink: 0,
                      }}>
                        {i + 1}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                          {a.icon && <span style={{ fontSize: '1rem' }}>{a.icon}</span>}
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{a.name}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: 1.45, marginBottom: a.bookingTip ? 5 : 0 }}>
                          {a.note}
                        </div>
                        {a.bookingTip && (
                          <div style={{
                            fontSize: '0.72rem',
                            color: '#f97316',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                          }}>
                            <span>🎫</span> {a.bookingTip}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Traveler Needs */}
            {cityData.travelerNeeds?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Before You Go" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {cityData.travelerNeeds.map((item, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      padding: '13px 15px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
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

            {/* Hidden Gems */}
            {cityData.hiddenGems?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Hidden Gems" subtitle="Off the tourist trail" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityData.hiddenGems.map((g, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      padding: '12px 15px',
                      background: 'linear-gradient(135deg, rgba(168,85,247,0.06), var(--bg-surface))',
                      border: '1px solid rgba(168,85,247,0.2)',
                      borderRadius: 'var(--radius-lg)',
                    }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0, lineHeight: 1.3 }}>{g.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                          {g.label}
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                          {g.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Day Trips */}
            {cityData.dayTrips?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Day Trips Worth Doing" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityData.dayTrips.map((d, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      padding: '12px 15px',
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius-lg)',
                      boxShadow: 'var(--shadow-sm)',
                    }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0, lineHeight: 1.3 }}>🚂</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 3, flexWrap: 'wrap' }}>
                          <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>{d.destination}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>{d.time}</span>
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                          {d.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Overrated */}
            {cityData.overrated?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Honest Takes" subtitle="Skip or temper expectations" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {cityData.overrated.map((o, i) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 13,
                      padding: '12px 15px',
                      background: 'linear-gradient(135deg, rgba(239,68,68,0.06), var(--bg-surface))',
                      border: '1px solid rgba(239,68,68,0.2)',
                      borderRadius: 'var(--radius-lg)',
                    }}>
                      <span style={{ fontSize: '1.2rem', flexShrink: 0, lineHeight: 1.3 }}>{o.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 3 }}>
                          {o.label}
                        </div>
                        <div style={{ fontSize: '0.77rem', color: 'var(--text-muted)', lineHeight: 1.45 }}>
                          {o.note}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Essentials */}
            {cityData.essentials && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="On-the-Ground Essentials" />
                <div style={{
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                }}>
                  {[
                    { icon: '📱', label: 'SIM / eSIM', value: cityData.essentials.simCard },
                    { icon: '💵', label: 'Tipping', value: cityData.essentials.tipping },
                    { icon: '⚠️', label: 'Safety', value: cityData.essentials.safetyNotes },
                    {
                      icon: '💧',
                      label: 'Tap Water',
                      value: cityData.essentials.waterDrinkable
                        ? '✅ Safe to drink'
                        : '❌ Drink bottled water',
                    },
                  ].map((row, i, arr) => (
                    <div key={i} style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 12,
                      padding: '12px 15px',
                      borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none',
                    }}>
                      <span style={{ fontSize: '1.1rem', flexShrink: 0, lineHeight: 1.4 }}>{row.icon}</span>
                      <div>
                        <div style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
                          {row.label}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                          {row.value}
                        </div>
                      </div>
                    </div>
                  ))}

                  {/* Emergency numbers */}
                  {cityData.essentials.emergencyNumbers && (
                    <div style={{
                      padding: '12px 15px',
                      borderTop: '1px solid var(--border)',
                      background: 'rgba(239,68,68,0.04)',
                    }}>
                      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span>🚨</span> Emergency Numbers
                      </div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        {Object.entries(cityData.essentials.emergencyNumbers).map(([key, val]) => (
                          <div key={key} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            padding: '6px 12px',
                            background: 'var(--bg-elevated)',
                            border: '1px solid var(--border)',
                            borderRadius: 'var(--radius-md)',
                            minWidth: 56,
                          }}>
                            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#ef4444', fontFamily: 'var(--font-display)' }}>{val}</span>
                            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'capitalize', marginTop: 1 }}>{key}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Official Links */}
            {cityData.officialLinks?.length > 0 && (
              <section style={{ marginBottom: 28 }}>
                <SectionHeader title="Official Links & Tickets" />
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
                      <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>
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
            {place && (
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 4, marginBottom: 20 }}>
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
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
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

function SectionHeader({ title, subtitle }) {
  return (
    <div className="section-header" style={{ marginBottom: 14 }}>
      <span className="section-title">{title}</span>
      {subtitle && (
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 8, fontStyle: 'italic' }}>
          {subtitle}
        </span>
      )}
    </div>
  )
}

function BudgetCard({ tier, icon, color, data }) {
  if (!data) return null
  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: `1px solid var(--border)`,
      borderTop: `3px solid ${color}`,
      borderRadius: 'var(--radius-lg)',
      padding: '12px 10px',
      textAlign: 'center',
    }}>
      <div style={{ fontSize: '1.2rem', marginBottom: 4 }}>{icon}</div>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
        {tier}
      </div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color, fontFamily: 'var(--font-display)', lineHeight: 1, marginBottom: 2 }}>
        €{data.daily}
      </div>
      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
        /day
      </div>
      {data.note && (
        <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginTop: 6, lineHeight: 1.35 }}>
          {data.note}
        </div>
      )}
    </div>
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
