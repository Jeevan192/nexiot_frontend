import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi'
import { CLUB_CONFIG } from '../../config/clubConfig.js'

const statusConfig = {
  upcoming: { label: 'Upcoming', cls: 'badge-cyan' },
  open: { label: 'Open', cls: 'badge-green' },
  closed: { label: 'Closed', cls: 'badge-pink' },
  completed: { label: 'Completed', cls: 'badge-gold' },
}

export default function EventCard({ event, onRegister }) {
  const navigate = useNavigate()
  const status = statusConfig[event.status] || statusConfig.upcoming
  const isUpcomingOrOpen = ['upcoming', 'open'].includes(event.status)
  const canRegister = Boolean(event.external_link) && isUpcomingOrOpen

  const handleRegister = () => {
    if (event.external_link) {
      window.open(event.external_link, '_blank', 'noopener,noreferrer')
    }
  }

  return (
    <div className="event-card glass-card" style={{ padding: '0px', overflow: 'hidden' }}>
      {event.image && (
        <div style={{ height: '180px', width: '100%', background: `url(${event.image}) center/cover no-repeat`, backgroundPosition: 'center', borderBottom: '1px solid var(--line)' }} />
      )}
      <div style={{ padding: '24px' }}>
        <div className="event-card-header">
          <div className="event-card-tag">{event.category || 'Workshop'}</div>
          <span className={`badge ${status.cls}`} aria-label={`Status ${status.label}`}>{status.label}</span>
        </div>


        <h3 className="event-card-title">{event.title}</h3>
        <p className="event-card-desc">{event.description}</p>

        <div className="event-card-meta">
          <div className="meta-item">
            <FiCalendar aria-hidden="true" />
            <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
          </div>
          <div className="meta-item">
            <FiClock aria-hidden="true" />
            <span>{event.time || '10:00 AM'}</span>
          </div>
          <div className="meta-item">
            <FiMapPin aria-hidden="true" />
            <span>{event.venue || 'CBIT Seminar Hall'}</span>
          </div>
          <div className="meta-item">
            <FiUsers aria-hidden="true" />
            <span>{event.registered || 0} / {event.capacity || 100} seats</span>
          </div>
        </div>

        {event.deadline && (
          <div className="event-deadline">
            <FiClock size={12} />
            Registration deadline: {new Date(event.deadline).toLocaleDateString('en-IN')}
          </div>
        )}

        <div className="event-card-footer">
          {canRegister ? (
            <button className="btn btn-primary" onClick={handleRegister} aria-label={`Register for ${event.title}`}>
              Register for Event <FiArrowRight />
            </button>
          ) : (
            <button className="btn btn-secondary" disabled>
              {['closed', 'completed'].includes(event.status) ? 'Event Completed/Closed' : 'No Registration Available'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}