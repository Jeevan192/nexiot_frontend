import React, { useState, useEffect } from 'react'
import { FiCalendar, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import EventCard from '../../components/EventCard/EventCard.jsx'
import { getEvents } from '../../services/eventService.js'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Events.css'

const MOCK_EVENTS = []

const CATEGORIES = ['All', 'Workshop', 'Conference', 'Fest', 'Talk', 'Project Sprint']
const STATUSES = ['All', 'open', 'upcoming', 'completed', 'closed']

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')

  useEffect(() => {
    const onlyClubEvents = (items) => items.filter((item) => {
      const source = `${item?.club || item?.organizer || item?.source || ''}`.toLowerCase()
      return source.includes('nex-iot') || source.includes('nexiot') || (source.includes('nex') && source.includes('iot'))
    })

    getEvents()
      .then(res => setEvents(onlyClubEvents(res.data || [])))
      .catch(() => {
        setEvents(MOCK_EVENTS)
        toast('No club-verified events are published yet.')
      })
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
            CBIT-listed technical and campus events relevant to the NEX-IOT community. Registrations are currently closed for all listings.
          </p>
          <span className="badge badge-cyan">{CLUB_CONFIG.registrationNotice}</span>
        </div>
      </div>

      <div className="container">
        {/* Category filter */}
        <div className="events-filter-bar motion-fade-up motion-delay-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
          <div style={{ width: 1, background: 'var(--line)', margin: '0 4px' }} />
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
          <div className="events-grid motion-fade-up motion-delay-3">
            {filtered.length === 0 ? (
              <div className="events-empty">
                <FiCalendar size={40} />
                <p>No NEX-IOT events are published yet.</p>
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