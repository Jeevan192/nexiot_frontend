import React, { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiHome, FiCalendar, FiMail } from 'react-icons/fi'
import './Success.css'

export default function Success() {
  const { state } = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!state?.name) navigate('/')
  }, [])

  if (!state?.name) return null

  return (
    <div className="success-page">
      <div className="success-bg">
        <div className="hero-grid" style={{ position: 'absolute', inset: 0 }} />
        <div className="success-radial" />
      </div>

      <div className="container">
        <div className="success-card glass-card">
          {/* Animated check */}
          <div className="success-icon-wrapper">
            <div className="success-ring success-ring-1" />
            <div className="success-ring success-ring-2" />
            <div className="success-icon">
              <FiCheckCircle />
            </div>
          </div>

          <span className="badge badge-green" style={{ margin: '0 auto 16px' }}>Application Submitted</span>

          <h1 className="success-title">Welcome, <span>{state.name.split(' ')[0]}!</span></h1>
          <p className="success-sub">
            Your application to join Next-IoT has been received. Our team will review it within 48 hours.
          </p>

          <div className="success-info">
            <div className="success-info-item">
              <FiMail />
              <span>Confirmation sent to <strong>{state.email}</strong></span>
            </div>
            {state.regId && (
              <div className="success-info-item">
                <FiCheckCircle />
                <span>Registration ID: <strong style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>#{state.regId}</strong></span>
              </div>
            )}
          </div>

          <div className="success-steps">
            <h4>Your QR Code</h4>
            <div className="success-qr-placeholder">
              <div className="qr-mock">
                <div className="qr-corner qr-tl" />
                <div className="qr-corner qr-tr" />
                <div className="qr-corner qr-bl" />
                <div className="qr-center">
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--cyan-dim)' }}>QR Sent to Email</span>
                </div>
              </div>
              <p>Your unique QR code has been emailed to you. Present it at club events for attendance.</p>
            </div>
          </div>

          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/events')}>
              <FiCalendar /> Browse Events
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/')}>
              <FiHome /> Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}