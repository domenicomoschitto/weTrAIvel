import { supabase } from './supabase'

export async function callClaude({ system, messages }) {
  const { data, error } = await supabase.functions.invoke('ai-chat', {
    body: { system, messages },
  })
  if (error) throw error
  return data.content[0].text
}

export function buildVaultContext(stop, vaultItems) {
  const grouped = vaultItems.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = []
    acc[item.category].push(item)
    return acc
  }, {})

  const sections = Object.entries(grouped).map(([cat, items]) => {
    const lines = items.map(i => `  - ${i.title}: ${i.content}`).join('\n')
    return `${cat.toUpperCase()}:\n${lines}`
  }).join('\n\n')

  return `You are a helpful travel assistant. The user is currently at stop: "${stop.name}" (${stop.location || ''}).
Here is all the stored information for this stop:

${sections}

Answer questions based only on the information above. Be concise and helpful.`
}

export function buildOptimizerContext(trip, stops) {
  const stopList = stops.map((s, i) =>
    `${i + 1}. ${s.name} (${s.location || 'no location'}) — ${s.start_date || '?'} to ${s.end_date || '?'}`
  ).join('\n')

  return `You are a travel logistics expert. Analyze the following trip itinerary and suggest optimizations.

Trip: "${trip.name}"
Stops in current order:
${stopList}

Evaluate:
1. Geographic efficiency (is the order logical? any backtracking?)
2. Duration at each stop (too short? too long?)
3. Travel time between stops
4. Practical suggestions (e.g. Florence before Venice if coming from Rome)

Be specific and actionable. Suggest a reordered itinerary if needed.`
}
