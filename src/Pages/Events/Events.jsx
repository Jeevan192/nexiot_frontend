import React, { useState, useEffect } from 'react'
import { FiCalendar, FiLoader } from 'react-icons/fi'
import EventCard from '../../components/EventCard/EventCard.jsx'
import { getEvents } from '../../services/eventService.js'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Events.css'

const CATEGORIES = ['All', 'Workshop', 'Conference', 'Fest', 'Talk', 'Project Sprint']
const STATUSES = ['All', 'open', 'upcoming', 'ongoing', 'completed', 'closed']
const GALLERY_ITEMS = [
  { img: '/pdf-images/img_p10_1.png', title: 'Fusion Expo Inaugaral' },
  { img: '/pdf-images/img_p11_1.png', title: 'Club Poster Unveiling' },
  { img: '/pdf-images/img_p11_2.png', title: 'Fusion Expo Showcase' },
  { img: '/pdf-images/img_p12_1.png', title: 'Hardware Demonstrations' },
  { img: '/pdf-images/img_p12_2.png', title: 'Technical Review' },
  { img: '/pdf-images/img_p13_1.png', title: 'Pitching Ideas' },
  { img: '/pdf-images/img_p10_1.png', title: 'Fusion Expo Inaugarals' },
  { img: '/pdf-images/img_p11_1.png', title: 'Club Poster Unveiling' },
  { img: '/pdf-images/img_p11_2.png', title: 'Fusion Expo Showcase' },
  { img: '/pdf-images/img_p12_1.png', title: 'Hardware Demonstrations' },
  { img: '/pdf-images/img_p12_2.png', title: 'Technical Review' },
  { img: '/pdf-images/img_p13_1.png', title: 'Pitching Ideas' },
]

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [activeStatus, setActiveStatus] = useState('All')

  useEffect(() => {
    let active = true

    const fetchEvents = async (attempt = 1) => {
      try {
        const res = await getEvents()
        const freshEvents = Array.isArray(res?.data) ? res.data : []
        if (!active) return
        setEvents(freshEvents)
        setLoadError('')
      } catch (err) {
        if (!active) return
        if (attempt < 2) {
          fetchEvents(attempt + 1)
          return
        }
        console.error('Events fetch failed:', err)
        setLoadError('Unable to fetch latest events from database. Please try again in a moment.')
        setEvents([])
      } finally {
        if (active) setLoading(false)
      }
    }

    fetchEvents()
    return () => { active = false }
  }, [])

  const filtered = (events || []).filter(e => {
    if (!e) return false;
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
            CBIT-listed technical and campus events relevant to the NEX-IOT community. Stay updated and register based on current intake status.
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
          <div className="events-loading-wrap">
            <div className="events-spinner"><FiLoader size={28} /></div>
            <p>Loading events...</p>
          </div>
        ) : loadError ? (
          <div className="events-empty">
            <FiCalendar size={40} />
            <p>{loadError}</p>
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

        {/* --- EVENT GALLERY SECION --- */}
        <div className="gallery-section motion-fade-up motion-delay-4" style={{ marginTop: '80px', marginBottom: '80px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-cyan">Media</span>
            <h2 className="section-title">Event <span>Gallery</span></h2>
            <p className="section-subtitle">Glimpses from the Club Inauguration & Fusion Expo 2024</p>
          </div>

          {/* Marquee Track Container */}
          <div className="gallery-track-container">
            
            {/* Soft gradient edges for smooth entry/exit */}
            <div className="gallery-fade gallery-fade-left" />
            <div className="gallery-fade gallery-fade-right" />

            <div className="gallery-track">
              {GALLERY_ITEMS.map((item, i) => (
                <div className="gallery-item glass-card" key={i} style={{ backgroundImage: `url(${item.img})` }}>
                  <div className="gallery-overlay">
                    <h4>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
