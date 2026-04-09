import React, { useState } from 'react'
import { FiMail, FiMapPin, FiPhone, FiSend, FiGithub, FiInstagram, FiLinkedin } from 'react-icons/fi'
import toast from 'react-hot-toast'
import api from '../../services/api.js'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) { toast.error('Please fill all required fields'); return }
    setSending(true)
    try {
      await api.post('/contact', form)
      toast.success('Message sent! We\'ll respond within 24 hours.')
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to send message right now. Please try again.'
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="contact-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Get in Touch</span>
          <h1 className="page-hero-title">Contact <span>Us</span></h1>
          <p className="page-hero-sub">Have a question about NEX-IOT? Want to collaborate or sponsor? We'd love to hear from you.</p>
        </div>
      </div>

      <div className="container">
        <div className="contact-layout">
          {/* Info */}
          <div className="contact-info">
            <div className="glass-card contact-info-card">
              <h3>Reach Us</h3>

              <div className="contact-item">
                <div className="contact-item-icon"><FiMail /></div>
                <div>
                  <p className="contact-item-label">Email</p>
                  <a href="mailto:nextiot@cbit.ac.in" className="contact-item-value">nextiot@cbit.ac.in</a>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><FiMapPin /></div>
                <div>
                  <p className="contact-item-label">Location</p>
                  <p className="contact-item-value">CBIT, Gandipet Rd, Hyderabad — 500075</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon"><FiPhone /></div>
                <div>
                  <p className="contact-item-label">Phone</p>
                  <a href="tel:+919963028231" className="contact-item-value">+91 99630 28231</a>
                </div>
              </div>

              <div className="contact-socials">
                <p className="contact-item-label" style={{ marginBottom: 12 }}>Follow Us</p>
                <div className="social-links">
                  <a href="https://github.com" target="_blank" rel="noopener noreferrer"><FiGithub /></a>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FiInstagram /></a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FiLinkedin /></a>
                </div>
              </div>
            </div>

            <div className="glass-card contact-hours-card">
              <h4>Office Hours</h4>
              {[
                { day: 'Mon — Fri', hours: '10:00 AM – 5:00 PM' },
                { day: 'Saturday', hours: '10:00 AM – 2:00 PM' },
                { day: 'Sunday', hours: 'Closed' },
              ].map(({ day, hours }) => (
                <div className="hours-row" key={day}>
                  <span>{day}</span>
                  <span style={{ color: hours === 'Closed' ? 'var(--pink)' : 'var(--cyan)' }}>{hours}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="glass-card contact-form-card">
            <h3>Send a Message</h3>
            <p className="contact-form-sub">We typically respond within 24 hours.</p>

            <form className="contact-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">Name *</label>
                  <input id="contact-name" className="form-input" value={form.name} onChange={set('name')} placeholder="Your name" required />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">Email *</label>
                  <input id="contact-email" className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">Subject</label>
                <input id="contact-subject" className="form-input" value={form.subject} onChange={set('subject')} placeholder="What's this about?" />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">Message *</label>
                <textarea id="contact-message" className="form-input" value={form.message} onChange={set('message')} placeholder="Your message..." rows={5} required />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '14px' }} disabled={sending}>
                {sending ? 'Sending...' : <><FiSend /> Send Message</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}