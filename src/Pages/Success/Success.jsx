import React, { useEffect, useMemo } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { FiCheckCircle, FiHome, FiCalendar, FiMail } from 'react-icons/fi'
import './Success.css'

export default function Success() {
  const { state } = useLocation()
  const navigate = useNavigate()
  const fallbackState = useMemo(() => {
    try {
      return JSON.parse(sessionStorage.getItem('nextiot_last_registration') || 'null')
    } catch {
      return null
    }
  }, [])
  const pageState = state || fallbackState

  useEffect(() => {
    if (!pageState?.name) navigate('/register')
  }, [navigate, pageState])

  if (!pageState?.name) return null

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

          <h1 className="success-title">Welcome, <span>{pageState.name.split(' ')[0]}!</span></h1>
          <p className="success-sub">
            Your application to join NEX-IOT has been received. Our team will review it within 48 hours.
          </p>

          <div className="success-info">
            <div className="success-info-item">
              <FiMail />
              <span>Confirmation sent to <strong>{pageState.email}</strong></span>
            </div>
            {pageState.regId && (
              <div className="success-info-item">
                <FiCheckCircle />
                <span>Registration ID: <strong style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>#{pageState.regId}</strong></span>
              </div>
            )}
          </div>

          <div className="success-steps">
            <h4>Your QR Code</h4>
            <div className="success-qr-placeholder">
              <div className="qr-mock" role="img" aria-label="QR code sent to email">
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