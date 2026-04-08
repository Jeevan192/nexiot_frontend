import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiCalendar, FiMapPin, FiUsers, FiClock, FiArrowRight } from 'react-icons/fi'

const statusConfig = {
  upcoming: { label: 'Upcoming', cls: 'badge-cyan' },
  open: { label: 'Open', cls: 'badge-green' },
  closed: { label: 'Closed', cls: 'badge-pink' },
  completed: { label: 'Completed', cls: 'badge-gold' },
}

export default function EventCard({ event, onRegister }) {
  const navigate = useNavigate()
  const status = statusConfig[event.status] || statusConfig.upcoming

  const handleRegister = () => {
    if (onRegister) onRegister(event)
    else navigate('/register', { state: { eventId: event.id, eventName: event.title } })
  }

  return (
    <div className="event-card glass-card">
      <div className="event-card-header">
        <div className="event-card-tag">{event.category || 'Workshop'}</div>
        <span className={`badge ${status.cls}`}>{status.label}</span>
      </div>

      <div className="event-card-icon">{event.icon || '⚡'}</div>

      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-desc">{event.description}</p>

      <div className="event-card-meta">
        <div className="meta-item">
          <FiCalendar />
          <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="meta-item">
          <FiClock />
          <span>{event.time || '10:00 AM'}</span>
        </div>
        <div className="meta-item">
          <FiMapPin />
          <span>{event.venue || 'CBIT Seminar Hall'}</span>
        </div>
        <div className="meta-item">
          <FiUsers />
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
        {event.status !== 'closed' && event.status !== 'completed' ? (
          <button className="btn btn-primary" onClick={handleRegister}>
            Register Now <FiArrowRight />
          </button>
        ) : (
          <button className="btn btn-secondary" disabled>
            {event.status === 'completed' ? 'Event Over' : 'Registration Closed'}
          </button>
        )}
      </div>
    </div>
  )
}