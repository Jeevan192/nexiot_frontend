import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FiCheckCircle, FiArrowRight, FiX } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { submitRegistration } from '../../services/eventService.js'
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
    if ((e.key === 'Enter' || e.key === ',') && skillInput.trim()) {
      e.preventDefault()
      const val = skillInput.trim().replace(/,$/, '')
      if (val && !skills.includes(val)) setSkills(s => [...s, val])
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => setSkills(s => s.filter(x => x !== skill))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); toast.error('Please fix the errors.'); return }
    setErrors({})
    setSubmitting(true)
    try {
      const payload = { ...form, skills, eventId: state?.eventId || null }
      const res = await submitRegistration(payload)
      toast.success('Registration submitted! Check your email.')
      navigate('/success', { state: { regId: res.data?.id, name: form.fullName, email: form.email } })
    } catch (err) {
      const msg = err.response?.data?.message || 'Submission failed. Please try again.'
      toast.error(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="register-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Membership Registration</span>
          <h1 className="page-hero-title">Join <span>Next-IoT</span></h1>
          <p className="page-hero-sub">Fill in your details below. Applications are reviewed within 48 hours.</p>
        </div>
      </div>

      <div className="container">
        <div className="register-layout">
          {/* Form */}
          <div className="register-form-card glass-card">
            <h2 className="register-form-title">Registration Form</h2>
            <p className="register-form-sub">// NEXT-IOT · CBIT · 2025 COHORT</p>

            <form className="register-form" onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input className="form-input" value={form.fullName} onChange={set('fullName')} placeholder="Your full name" />
                  {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Roll Number *</label>
                  <input className="form-input" value={form.rollNumber} onChange={set('rollNumber')} placeholder="e.g. 22B01A0501" />
                  {errors.rollNumber && <span className="form-error">{errors.rollNumber}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Branch *</label>
                  <select className="form-input" value={form.branch} onChange={set('branch')}>
                    <option value="">Select branch</option>
                    {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                  {errors.branch && <span className="form-error">{errors.branch}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Year *</label>
                  <select className="form-input" value={form.year} onChange={set('year')}>
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                  {errors.year && <span className="form-error">{errors.year}</span>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input className="form-input" type="email" value={form.email} onChange={set('email')} placeholder="your@email.com" />
                  {errors.email && <span className="form-error">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <input className="form-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="10-digit number" maxLength={10} />
                  {errors.phone && <span className="form-error">{errors.phone}</span>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Skills (press Enter or comma to add)</label>
                <div className="skills-chips" onClick={() => skillInputRef.current?.focus()}>
                  {skills.map(s => (
                    <span className="skill-chip" key={s}>
                      {s}
                      <button type="button" className="skill-chip-remove" onClick={() => removeSkill(s)}><FiX /></button>
                    </span>
                  ))}
                  <input
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
                <label className="form-label">Why do you want to join Next-IoT? *</label>
                <textarea
                  className="form-input"
                  value={form.whyJoin}
                  onChange={set('whyJoin')}
                  placeholder="Tell us about your interest in IoT and what you hope to build..."
                  rows={4}
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