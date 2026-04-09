import React, { useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiCheckCircle, FiArrowRight, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { submitRegistration } from '../../services/eventService.js'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Register.css'

const BRANCHES = ['CSE', 'ECE', 'EEE', 'IT', 'MECH', 'CIVIL', 'CHEM', 'Other']
const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year']

const PERKS = [
  'Club ID card + Welcome kit',
  'Access to IoT lab equipment',
  'Priority registration for events',
  'Industry mentor connect',
  'Certificate of membership',
  'QR code confirmation email',
]

function validate(form) {
  const errors = {}
  if (!form.fullName.trim()) errors.fullName = 'Required'
  if (!/^[A-Z0-9]+$/.test(form.rollNumber.trim().toUpperCase())) errors.rollNumber = 'Invalid roll number'
  if (!form.branch) errors.branch = 'Select branch'
  if (!form.year) errors.year = 'Select year'
  if (!/^\S+@\S+\.\S+$/.test(form.email)) errors.email = 'Invalid email'
  if (!/^[6-9]\d{9}$/.test(form.phone.trim())) errors.phone = 'Invalid Indian phone number'
  if (!form.whyJoin.trim() || form.whyJoin.trim().length < 20) errors.whyJoin = 'Please write at least 20 characters'
  return errors
}

export default function Register() {
  const navigate = useNavigate()
  const { state } = useLocation()

  const [form, setForm] = useState({
    fullName: '', rollNumber: '', branch: '', year: '',
    email: '', phone: '', whyJoin: '',
  })
  const [skills, setSkills] = useState([])
  const [skillInput, setSkillInput] = useState('')
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)

  const skillInputRef = useRef()

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  const addSkill = (e) => {
    if (e.key === 'Enter' && skillInput.trim()) {
      e.preventDefault()
      const val = skillInput.trim().replace(/,$/, '')
      if (val && !skills.includes(val)) setSkills(s => [...s, val])
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => setSkills(s => s.filter(x => x !== skill))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!CLUB_CONFIG.registrationsOpen) {
      toast.error(CLUB_CONFIG.registrationNotice)
      return
    }
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix the errors.'); return }
    setErrors({})
    setSubmitting(true)
    try {
      const payload = { ...form, skills, eventId: state?.eventId || null }
      const res = await submitRegistration(payload)
      const successPayload = { regId: res.data?.id, name: form.fullName, email: form.email }
      sessionStorage.setItem('nextiot_last_registration', JSON.stringify(successPayload))
      toast.success('Registration submitted! Check your email.')
      navigate('/success', { state: successPayload })
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (!CLUB_CONFIG.registrationsOpen) {
    return (
      <div className="register-page">
        <div className="page-hero">
          <div className="page-hero-bg" />
          <div className="container">
            <span className="badge badge-cyan">Membership Intake Closed</span>
            <h1 className="page-hero-title">NEX-IOT <span>Registrations</span></h1>
            <p className="page-hero-sub">{CLUB_CONFIG.registrationNotice}</p>
          </div>
        </div>

        <div className="container">
          <div className="register-layout" style={{ gridTemplateColumns: '1fr' }}>
            <div className="register-form-card glass-card" style={{ textAlign: 'center' }}>
              <h2 className="register-form-title">Admissions Temporarily Closed</h2>
              <p className="register-form-sub">// NEX-IOT · CBIT · INTAKE PAUSED</p>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
                The next membership window will be announced through the Events page and official club channels.
              </p>
              <button type="button" className="btn btn-primary" onClick={() => navigate('/events')}>
                Browse Events <FiArrowRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="register-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Membership Registration</span>
          <h1 className="page-hero-title">Join <span>NEX-IOT</span></h1>
          <p className="page-hero-sub">Fill in your details below. Applications are reviewed within 48 hours.</p>
        </div>
      </div>

      <div className="container">
        <div className="register-layout">
          {/* Form */}
          <div className="register-form-card glass-card">
            <h2 className="register-form-title">Registration Form</h2>
            <p className="register-form-sub">// NEX-IOT · CBIT · 2025 COHORT</p>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-fullname">Full Name *</label>
                  <input id="reg-fullname" className="form-input" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" required />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-roll">Roll Number *</label>
                  <input id="reg-roll" className="form-input" value={form.rollNumber} onChange={set('rollNumber')} placeholder="e.g. 22B01A0501" required />
                  {errors.rollNumber && <span className="form-error">{errors.rollNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-branch">Branch *</label>
                  <select id="reg-branch" className="form-input" value={form.branch} onChange={set('branch')} required>
                    <option value="">Select branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.branch && <span className="form-error">{errors.branch}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-year">Year *</label>
                  <select id="reg-year" className="form-input" value={form.year} onChange={set('year')} required>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <span className="form-error">{errors.year}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-email">Email *</label>
                  <input id="reg-email" className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" required />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="reg-phone">Phone Number *</label>
                  <input id="reg-phone" className="form-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit number" maxLength={10} required />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-skills">Skills (press Enter to add)</label>
                <div className="skills-chips" onClick={() => skillInputRef.current?.focus()}>
                  {skills.map(s => (
                    <span className="skill-chip" key={s}>
                      {s}
                      <button type="button" className="skill-chip-remove" onClick={() => removeSkill(s)}><FiX /></button>
                    </span>
                  ))}
                  <input
                    id="reg-skills"
                    ref={skillInputRef}
                    className="skills-input"
                    value={skillInput}
                    onChange={e => setSkillInput(e.target.value)}
                    onKeyDown={addSkill}
                    placeholder={skills.length === 0 ? 'Arduino, Python, MQTT...' : ''}
                  />
                </div>
                <p className="skills-hint">Type a skill and press Enter to add it.</p>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reg-why-join">Why do you want to join NEX-IOT? *</label>
                <textarea
                  id="reg-why-join"
                  className="form-input"
                  value={form.whyJoin}
                  onChange={set('whyJoin')}
                  placeholder="Tell us about your interest in IoT and what you hope to build..."
                  rows={4}
                  required
                />
                {errors.whyJoin && <span className="form-error">{errors.whyJoin}</span>}
                <p className="skills-hint">{form.whyJoin.length} / min. 20 characters</p>
              </div>

              <button type="submit" className="btn btn-primary submit-btn" disabled={submitting}>
                {submitting ? 'Submitting...' : <>Submit Application <FiArrowRight /></>}
              </button>
            </form>
          </div>

          {/* Sidebar */}
          <div className="register-sidebar">
            <div className="register-info-card glass-card">
              <h4>What Happens Next?</h4>
              <div className="info-steps">
                {[
                  'You submit this form',
                  'We review your application (48 hrs)',
                  'Email confirmation with QR code sent',
                  'Attend orientation event',
                  'Access IoT lab & resources',
                ].map((step, i) => (
                  <div className="info-step" key={i}>
                    <div className="info-step-num">{i + 1}</div>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="register-info-card glass-card">
              <h4>Membership Perks</h4>
              <div className="register-perks">
                {PERKS.map((p, i) => (
                  <div className="perk-item" key={i}>
                    <FiCheckCircle size={14} />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            {state?.eventName && (
              <div className="register-info-card glass-card" style={{ borderColor: 'rgba(0,245,255,0.3)' }}>
                <h4>Registering For</h4>
                <div className="perk-item">
                  <FiCheckCircle size={14} />
                  <span style={{ color: 'var(--cyan)' }}>{state.eventName}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}