const BASE = 'https://test.api.amadeus.com'
let _token = null
let _tokenExpiry = 0

async function getToken() {
  if (_token && Date.now() < _tokenExpiry) return _token
  const res = await fetch(`${BASE}/v1/security/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: import.meta.env.VITE_AMADEUS_CLIENT_ID || '',
      client_secret: import.meta.env.VITE_AMADEUS_CLIENT_SECRET || '',
    }),
  })
  if (!res.ok) throw new Error('Amadeus auth failed')
  const d = await res.json()
  _token = d.access_token
  _tokenExpiry = Date.now() + (d.expires_in - 60) * 1000
  return _token
}

export async function searchAirports(keyword) {
  if (!keyword || keyword.length < 2) return []
  const token = await getToken()
  const res = await fetch(
    `${BASE}/v1/reference-data/locations?subType=AIRPORT,CITY&keyword=${encodeURIComponent(keyword)}&page[limit]=6&sort=analytics.travelers.score`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const d = await res.json()
  return d.data || []
}

export async function searchFlights({ origin, destination, departDate, returnDate, adults, travelClass }) {
  const token = await getToken()
  const params = new URLSearchParams({
    originLocationCode: origin,
    destinationLocationCode: destination,
    departureDate: departDate,
    adults: String(adults),
    travelClass: travelClass.toUpperCase(),
    max: '10',
    currencyCode: 'EUR',
    nonStop: 'false',
  })
  if (returnDate) params.set('returnDate', returnDate)
  const res = await fetch(`${BASE}/v2/shopping/flight-offers?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const d = await res.json()
  if (!res.ok) throw new Error(d.errors?.[0]?.detail || 'Flight search failed')
  return { offers: d.data || [], dictionaries: d.dictionaries || {} }
}

export async function searchHotelsByCity(cityCode) {
  const token = await getToken()
  const res = await fetch(
    `${BASE}/v1/reference-data/locations/hotels/by-city?cityCode=${cityCode}&radius=5&radiusUnit=KM&hotelSource=ALL`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  const d = await res.json()
  if (!res.ok) throw new Error(d.errors?.[0]?.detail || 'Hotel lookup failed')
  return (d.data || []).slice(0, 25).map(h => h.hotelId)
}

export async function searchHotelOffers({ cityCode, checkIn, checkOut, adults, rooms }) {
  const token = await getToken()
  const hotelIds = await searchHotelsByCity(cityCode)
  if (!hotelIds.length) return []
  const params = new URLSearchParams({
    hotelIds: hotelIds.join(','),
    adults: String(adults),
    checkInDate: checkIn,
    checkOutDate: checkOut,
    roomQuantity: String(rooms),
    currency: 'EUR',
    bestRateOnly: 'true',
  })
  const res = await fetch(`${BASE}/v3/shopping/hotel-offers?${params}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const d = await res.json()
  if (!res.ok) throw new Error(d.errors?.[0]?.detail || 'Hotel search failed')
  return d.data || []
}
