import React, { useState, useEffect } from 'react'
import { FiCalendar, FiLoader } from 'react-icons/fi'
import toast from 'react-hot-toast'
import EventCard from '../../components/EventCard/EventCard.jsx'
import { getEvents } from '../../services/eventService.js'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Events.css'

const MOCK_EVENTS = [
  {
    id: 'ev-1',
    title: 'NeXIoT Club Inauguration',
    description: 'The official launch of NeXIoT Club at CBIT. An event dedicated to fostering innovation, learning, and collaboration in IoT and emerging tech.',
    category: 'Talk',
    status: 'completed',
    date: '2024-11-12T10:00:00Z',
    time: '10:00 AM - 12:00 PM',
    venue: 'Assembly Hall, CBIT, Hyderabad',
    registered: 250,
    capacity: 250,
    club: 'NEX-IOT',
    icon: '🚀',
    image: '/pdf-images/img_p5_1.png'
  },
  {
    id: 'ev-2',
    title: 'Fusion Expo',
    description: 'An exhibition showcasing 17 diverse IoT projects built by student teams tackling real-world challenges, followed by a Q&A and networking session.',
    category: 'Project Sprint',
    status: 'completed',
    date: '2024-11-12T13:00:00Z',
    time: '1:00 PM - 3:00 PM',
    venue: 'Seminar Hall, R&E Block, CBIT',
    registered: 250,
    capacity: 250,
    club: 'NEX-IOT',
    icon: '⚡',
    image: '/pdf-images/img_p10_1.png'
  }
]

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

        {/* --- EVENT GALLERY SECION --- */}
        <div className="gallery-section motion-fade-up motion-delay-4" style={{ marginTop: '80px', marginBottom: '80px' }}>
          <div className="section-header" style={{ textAlign: 'center', marginBottom: '40px' }}>
            <span className="badge badge-cyan">Media</span>
            <h2 className="section-title">Event <span>Gallery</span></h2>
            <p className="section-subtitle">Glimpses from the Club Inauguration & Fusion Expo 2024</p>
          </div>

          {/* Marquee Track Container */}
          <div className="gallery-track-container" style={{ width: '100%', overflow: 'hidden', position: 'relative', padding: '10px 0' }}>
            
            {/* Soft gradient edges for smooth entry/exit */}
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: '100px', background: 'linear-gradient(to right, var(--bg) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '100px', background: 'linear-gradient(to left, var(--bg) 0%, transparent 100%)', zIndex: 2, pointerEvents: 'none' }} />

            <div className="gallery-track">
              {/* Double array so it seamlessly loops in CSS */}
              {[
                { img: '/pdf-images/img_p10_1.png', title: 'Project Exhibition' },
                { img: '/pdf-images/img_p11_1.png', title: 'Team Presentations' },
                { img: '/pdf-images/img_p11_2.png', title: 'Fusion Expo Showcase' },
                { img: '/pdf-images/img_p12_1.png', title: 'Hardware Demonstrations' },
                { img: '/pdf-images/img_p12_2.png', title: 'Technical Review' },
                { img: '/pdf-images/img_p13_1.png', title: 'Pitching Ideas' },
                // Duplicate for infinite scroll
                { img: '/pdf-images/img_p10_1.png', title: 'Project Exhibition' },
                { img: '/pdf-images/img_p11_1.png', title: 'Team Presentations' },
                { img: '/pdf-images/img_p11_2.png', title: 'Fusion Expo Showcase' },
                { img: '/pdf-images/img_p12_1.png', title: 'Hardware Demonstrations' },
                { img: '/pdf-images/img_p12_2.png', title: 'Technical Review' },
                { img: '/pdf-images/img_p13_1.png', title: 'Pitching Ideas' }
              ].map((item, i) => (
                <div className="gallery-item glass-card" key={i} style={{ 
                  flex: '0 0 auto', 
                  width: '320px', 
                  height: '240px', 
                  background: `url(${item.img}) center/cover no-repeat`, 
                  borderRadius: '12px', 
                  border: '1px solid var(--line)', 
                  transition: 'transform 0.4s ease, border-color 0.4s ease', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div className="gallery-overlay" style={{ 
                    position: 'absolute', 
                    inset: 0, 
                    background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)', 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    padding: '20px', 
                    opacity: 0, 
                    transition: 'opacity 0.3s ease' 
                  }}>
                    <h4 style={{ color: 'var(--cyan)', margin: 0, fontSize: '1.1rem' }}>{item.title}</h4>
                  </div>
                </div>
              ))}
            </div>

            {/* CSS Animation Blocks injected inline for the track */}
            <style dangerouslySetInnerHTML={{__html: `
              .gallery-track {
                display: flex;
                gap: 20px;
                width: max-content;
                animation: autoScroll 35s linear infinite;
              }
              .gallery-track:hover {
                animation-play-state: paused;
              }
              .gallery-item:hover {
                transform: translateY(-8px) scale(1.02);
                border-color: var(--cyan) !important;
                z-index: 10;
                box-shadow: 0 10px 30px rgba(0, 245, 255, 0.15);
              }
              .gallery-item:hover .gallery-overlay {
                opacity: 1 !important;
              }
              @keyframes autoScroll {
                0% { transform: translateX(0); }
                100% { transform: translateX(calc(-50% - 10px)); } /* Scrolls exactly half the flex width */
              }
            `}} />
          </div>
        </div>

      </div>
    </div>
  )
}