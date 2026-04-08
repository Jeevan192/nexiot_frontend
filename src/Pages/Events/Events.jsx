import React, { useState, useEffect } from 'react'
import { FiCalendar, FiLoader } from 'react-icons/fi'
import EventCard from '../../components/EventCard/EventCard.jsx'
import { getEvents } from '../../services/eventService.js'
import './Events.css'

const MOCK_EVENTS = [
  { id: 1, title: 'IoT Bootcamp 2025', category: 'Workshop', icon: '🔌', status: 'open', date: '2025-08-15', time: '9:00 AM', venue: 'Lab 302, CBIT', registered: 45, capacity: 60, deadline: '2025-08-10', description: 'A 2-day intensive bootcamp covering ESP32, MQTT, and cloud integration. Beginners welcome.' },
  { id: 2, title: 'Hack-IoT Hackathon', category: 'Hackathon', icon: '⚡', status: 'upcoming', date: '2025-09-20', time: '8:00 AM', venue: 'Seminar Hall, CBIT', registered: 28, capacity: 100, deadline: '2025-09-15', description: '24-hour hackathon to build a working IoT prototype. Prizes worth ₹50,000. Form teams of 3-4.' },
  { id: 3, title: 'Smart Agriculture Workshop', category: 'Workshop', icon: '🌱', status: 'open', date: '2025-08-28', time: '2:00 PM', venue: 'CR-101, CBIT', registered: 22, capacity: 40, deadline: '2025-08-25', description: 'Build a soil moisture monitoring system with Arduino and send data to a cloud dashboard.' },
  { id: 4, title: 'Edge AI with TinyML', category: 'Talk', icon: '🤖', status: 'upcoming', date: '2025-09-05', time: '11:00 AM', venue: 'Online + CBIT', registered: 67, capacity: 200, deadline: '2025-09-03', description: 'Guest lecture by an industry ML engineer on deploying neural nets on microcontrollers.' },
  { id: 5, title: 'PCB Design Masterclass', category: 'Workshop', icon: '🛠️', status: 'completed', date: '2025-07-10', time: '10:00 AM', venue: 'EEE Lab, CBIT', registered: 35, capacity: 35, description: 'Hands-on session using KiCad for schematic capture and PCB layout. Participants took home fabricated boards.' },
  { id: 6, title: 'IoT Security Deep Dive', category: 'Talk', icon: '🔒', status: 'upcoming', date: '2025-10-01', time: '3:00 PM', venue: 'Seminar Hall, CBIT', registered: 12, capacity: 150, deadline: '2025-09-28', description: 'Industry expert covers device hardening, TLS for embedded, and OWASP IoT Top 10 vulnerabilities.' },
]

const CATEGORIES = ['All', 'Workshop', 'Hackathon', 'Talk', 'Project Sprint']
const STATUSES = ['All', 'open', 'upcoming', 'completed', 'closed']

export default function Events() {
  const [events, setEvents] = useState(MOCK_EVENTS)
  const [loading, setLoading] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')

  useEffect(() => {
    setLoading(true)
    getEvents()
      .then(res => setEvents(res.data))
      .catch(() => setEvents(MOCK_EVENTS))
      .finally(() => setLoading(false))
  }, [])

  const filtered = events.filter(e => {
    const catMatch = activeCategory === 'All' || e.category === activeCategory
    const statusMatch = activeStatus === 'All' || e.status === activeStatus
    return catMatch && statusMatch
  })

  return (
    <div className="events-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Upcoming & Past</span>
          <h1 className="page-hero-title">Club <span>Events</span></h1>
          <p className="page-hero-sub">
            Workshops, hackathons, and tech talks — there's always something happening at Next-IoT. Register early; seats fill fast.
          </p>
        </div>
      </div>

      <div className="container">
        {/* Category filter */}
        <div className="events-filter-bar">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <div style={{ width: 1, background: 'var(--border-glass)', margin: '0 4px' }} />
          {STATUSES.map(s => (
            <button
              key={s}
              className={`filter-btn${activeStatus === s ? ' active' : ''}`}
              onClick={() => setActiveStatus(s)}
              style={{ textTransform: 'capitalize' }}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-secondary)' }}>
            <div style={{ animation: 'rotate 1s linear infinite', display: 'inline-block' }}><FiLoader size={28} /></div>
            <p style={{ marginTop: 12, fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Loading events...</p>
          </div>
        ) : (
          <div className="events-grid">
            {filtered.length === 0 ? (
              <div className="events-empty">
                <FiCalendar size={40} />
                <p>No events found for the selected filters.</p>
              </div>
            ) : (
              filtered.map(event => <EventCard key={event.id} event={event} />)
            )}
          </div>
        )}
      </div>
    </div>
  )
}