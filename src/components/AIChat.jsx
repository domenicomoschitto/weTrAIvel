import { useState, useRef, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { callClaude, buildVaultContext, buildOptimizerContext } from '../lib/claude'

const MODES = [
  { id: 'vault', label: '🗂 Vault Assistant' },
  { id: 'optimizer', label: '✨ Trip Optimizer' },
  { id: 'research', label: '🔍 Research' },
]

const WELCOME = {
  vault: "Hi! Ask me anything about your stored trip info — tickets, bookings, addresses, dates.",
  optimizer: "Share your trip details and I'll analyze the route, flag inefficiencies, and suggest a smarter order.",
  research: "Ask me to research destinations, compare transport options, find accommodation, or suggest itineraries.",
}

export default function AIChat() {
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState('vault')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  // Extract tripId and stopId from URL
  const pathParts = location.pathname.split('/')
  const tripId = pathParts[2] || null
  const stopId = pathParts[4] || null

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME[mode] }])
    }
  }, [open])

  useEffect(() => {
    function handleOpenChat(e) {
      const { mode: newMode, city } = e.detail || {}
      if (newMode && MODES.find(m => m.id === newMode)) {
        setMode(newMode)
        const welcome = city
          ? `Hi! I'm ready to help you plan your trip to **${city}**. Ask me about itineraries, best time to visit, what to see, transport options — anything!`
          : WELCOME[newMode]
        setMessages([{ role: 'assistant', content: welcome }])
      }
      setOpen(true)
    }
    window.addEventListener('volare:open-ai-chat', handleOpenChat)
    return () => window.removeEventListener('volare:open-ai-chat', handleOpenChat)
  }, [])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME[mode] }])
    }
  }, [mode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function buildSystemPrompt() {
    if (mode === 'vault' && stopId) {
      const [{ data: stop }, { data: items }] = await Promise.all([
        supabase.from('stops').select('*').eq('id', stopId).single(),
        supabase.from('vault_items').select('*').eq('stop_id', stopId),
      ])
      if (stop && items) return buildVaultContext(stop, items)
    }
    if (mode === 'optimizer' && tripId) {
      const [{ data: trip }, { data: stops }] = await Promise.all([
        supabase.from('trips').select('*').eq('id', tripId).single(),
        supabase.from('stops').select('*').eq('trip_id', tripId).order('order_index'),
      ])
      if (trip && stops) return buildOptimizerContext(trip, stops)
    }
    return `You are a helpful travel assistant. Answer questions concisely and practically.`
  }

  async function sendMessage() {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const userMsg = { role: 'user', content: text }
    const history = [...messages.filter(m => m.role !== 'assistant' || messages.indexOf(m) !== 0), userMsg]
    setMessages(prev => [...prev, userMsg])
    setLoading(true)

    try {
      const system = await buildSystemPrompt()
      const apiMessages = history.filter(m => m.role === 'user' || m.role === 'assistant')
      const reply = await callClaude({ system, messages: apiMessages })
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (e) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: `⚠️ ${e.message || 'Could not reach AI. Make sure the Edge Function is deployed and ANTHROPIC_API_KEY is set.'}`,
      }])
    }
    setLoading(false)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  function switchMode(newMode) {
    setMode(newMode)
    setMessages([{ role: 'assistant', content: WELCOME[newMode] }])
  }

  return (
    <>
      {/* AI FAB */}
      {!open && (
        <button className="ai-fab" onClick={() => setOpen(true)} title="AI Assistant">
          ✦
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <>
          {/* Backdrop */}
          <div
            style={{ position: 'fixed', inset: 0, zIndex: 55 }}
            onClick={() => setOpen(false)}
          />
          <div className="ai-panel" onClick={e => e.stopPropagation()}>
            <div className="ai-panel-header">
              <span className="ai-panel-title">✦ AI Assistant</span>
              <button className="btn-icon" onClick={() => setOpen(false)}>✕</button>
            </div>

            <div className="ai-mode-tabs">
              {MODES.map(m => (
                <button
                  key={m.id}
                  className={`ai-mode-tab${mode === m.id ? ' active' : ''}`}
                  onClick={() => switchMode(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>

            <div className="ai-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`ai-message ${msg.role}`}>
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="ai-message assistant">
                  <div className="dot-loader">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="ai-input-area">
              <textarea
                ref={inputRef}
                className="ai-input"
                placeholder="Ask anything…"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
              />
              <button
                className="btn btn-primary"
                style={{ padding: '9px 14px', fontSize: '0.85rem' }}
                onClick={sendMessage}
                disabled={loading || !input.trim()}
              >
                {loading ? <div className="spinner" /> : '↑'}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  )
}
