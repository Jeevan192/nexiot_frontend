import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import {
  FiSearch, FiPlus, FiEdit2, FiTrash2, FiCheck, FiDownload,
  FiUsers, FiCalendar, FiBarChart2, FiMenu, FiX, FiLoader,
  FiLock, FiMail, FiEye, FiEyeOff, FiCheckSquare, FiRefreshCw
} from 'react-icons/fi'
import toast from 'react-hot-toast'
import { login, isAuthenticated, getUser } from '../../services/authService.js'
import {
  getRegistrations, approveRegistration, deleteRegistration, exportRegistrations,
  getEvents, createEvent, updateEvent, deleteEvent, getDashboardStats, getAttendance, markAttendance, createAdmin,
  getConfig, updateConfig,
} from '../../services/eventService.js'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx'
import './Admin.css'

// ===========================
// ADMIN LOGIN / REGISTER
// ===========================
function AdminLogin() {
  const navigate = useNavigate()
  const [isRegistering, setIsRegistering] = useState(false)
  const [form, setForm] = useState({ username: '', password: '', secretKey: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Fill in both fields'); return }
    setLoading(true)
    try {
      if (isRegistering) {
        if (!form.secretKey) { toast.error('Secret key required for new admins'); setLoading(false); return; }
        await createAdmin({ username: form.username, password: form.password, secretKey: form.secretKey })
        toast.success('Admin created successfully! You can now login.')
        setIsRegistering(false)
        setForm(f => ({ ...f, password: '', secretKey: '' }))
      } else {
        await login({ username: form.username, password: form.password })
        toast.success('Welcome back, Admin!')
        navigate('/admin/dashboard')
      }
    } catch (err) {
      const msg = err.response?.data?.message || (isRegistering ? 'Registration failed' : 'Invalid credentials')
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-login-page">
      <div className="admin-login-bg" />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
        <div className="hero-grid" style={{ position: 'absolute', inset: 0 }} />
      </div>
      <div className="admin-login-card glass-card" style={{ zIndex: 1, position: 'relative' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ position: 'absolute', top: 20, left: 20, background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em', zIndex: 10, padding: '5px' }}
        >
          <FiX size={18} /> Return to Site
        </button>
        <div className="admin-login-header" style={{ marginTop: 20 }}>
          <div className="admin-login-icon">IoT</div>
          <h2>{isRegistering ? 'Register Admin' : 'Admin Portal'}</h2>
          <p>// NEX-IOT · CBIT · SECURE ACCESS</p>
        </div>
        <form className="admin-login-form" onSubmit={handleLogin} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              className="form-input"
              value={form.username}
              onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
              placeholder="Username"
              autoComplete="username"
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="admin-password"
                className="form-input"
                type={showPw ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
                autoComplete={isRegistering ? "new-password" : "current-password"}
                style={{ paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowPw(!showPw)}
                aria-label={showPw ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}
              >
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
          </div>
          
          {isRegistering && (
            <div className="form-group" style={{ marginTop: '1rem' }}>
              <label className="form-label" htmlFor="admin-secret">Master Secret Key (Required)</label>
              <input
                id="admin-secret"
                className="form-input"
                type="password"
                value={form.secretKey}
                onChange={e => setForm(f => ({ ...f, secretKey: e.target.value }))}
                placeholder="Secure Key"
              />
            </div>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Authenticating...' : <><FiLock /> {isRegistering ? 'Create Admin Account' : 'Sign In to Admin'}</>}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 15 }}>
          <button 
             type="button" 
             onClick={() => setIsRegistering(!isRegistering)}
             style={{ background: 'none', border: 'none', color: 'var(--cyan)', cursor: 'pointer', textDecoration: 'underline' }}
          >
            {isRegistering ? 'Already have an account? Login' : 'Need a new admin account? Register'}
          </button>
        </p>
        <p style={{ textAlign: 'center', marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>
          Protected by JWT · Role-Based Access Control
        </p>
      </div>
    </div>
  )
}

// ===========================
// DASHBOARD
// ===========================
const EMPTY_STATS = {
  totalMembers: 0,
  pendingApprovals: 0,
  upcomingEvents: 0,
  totalEvents: 0,
  attendanceToday: 0,
  thisMonthReg: 0,
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
const MOCK_CHART = [30, 45, 28, 60, 75, 52, 88, 28]

function Dashboard() {
  const [stats, setStats] = useState(EMPTY_STATS)
  const [loadingStats, setLoadingStats] = useState(true)
  const [config, setConfigState] = useState({ registrationsOpen: false })
  const user = getUser()

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch((e) => { console.error(e); })
      .finally(() => setLoadingStats(false))
    getConfig()
      .then(res => {
        const status = Boolean(res?.data?.registrationsOpen)
        setConfigState({ registrationsOpen: status })
        CLUB_CONFIG.registrationsOpen = status
        CLUB_CONFIG.registrationNotice = status
          ? 'Registrations are currently open. Join now and secure your seat.'
          : 'Registrations are currently closed. Please check back for the next intake window.'
      })
      .catch(e => console.error(e))
  }, [])

  const handleToggleReg = async () => {
    const newStatus = !config.registrationsOpen
    try {
      await updateConfig({ registrationsOpen: newStatus })
      setConfigState({ registrationsOpen: newStatus })
      CLUB_CONFIG.registrationsOpen = newStatus
      CLUB_CONFIG.registrationNotice = newStatus
        ? 'Registrations are currently open. Join now and secure your seat.'
        : 'Registrations are currently closed. Please check back for the next intake window.'
      toast.success(`Registrations ${newStatus ? 'Opened' : 'Closed'}`)
    } catch { toast.error('Failed to update config') }
  }

  const statCards = [
    { label: 'Total Members', value: loadingStats ? '--' : stats.totalMembers, icon: <FiUsers />, change: '+12%', accent: 'var(--cyan)', iconBg: 'rgba(0,245,255,0.08)', iconColor: 'var(--cyan)', iconBorder: 'rgba(0,245,255,0.15)' },
    { label: 'Pending Approvals', value: loadingStats ? '--' : stats.pendingApprovals, icon: <FiCheckSquare />, change: 'Today', accent: 'var(--gold)', iconBg: 'rgba(255,215,0,0.08)', iconColor: 'var(--gold)', iconBorder: 'rgba(255,215,0,0.15)' },
    { label: 'Upcoming Events', value: loadingStats ? '--' : stats.upcomingEvents, icon: <FiCalendar />, change: 'Active', accent: 'var(--green)', iconBg: 'rgba(0,255,136,0.08)', iconColor: 'var(--green)', iconBorder: 'rgba(0,255,136,0.15)' },
    { label: 'This Month Reg.', value: loadingStats ? '--' : stats.thisMonthReg, icon: <FiBarChart2 />, change: '+8%', accent: 'var(--pink)', iconBg: 'rgba(102,191,255,0.1)', iconColor: 'var(--pink)', iconBorder: 'rgba(102,191,255,0.2)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 4 }}>
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </h2>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
            // NEX-IOT ADMIN DASHBOARD · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <button 
           onClick={handleToggleReg} 
           className={`btn ${config.registrationsOpen ? 'btn-secondary' : 'btn-primary'}`} 
           style={{ padding: '8px 16px', fontSize: '0.75rem' }}
        >
          {config.registrationsOpen ? 'Close Global Registrations' : 'Open Global Registrations'}
        </button>
      </div>

      <div className="stats-grid">
        {statCards.map((s, i) => (
          <div key={i} className="stat-card glass-card" style={{ '--accent': s.accent }}>
            <div className="stat-card-header">
              <div className="stat-icon" style={{ '--icon-bg': s.iconBg, '--icon-color': s.iconColor, '--icon-border': s.iconBorder, background: s.iconBg, color: s.iconColor, borderColor: s.iconBorder }}>
                {s.icon}
              </div>
              <span className="stat-change">{s.change}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="chart-row">
        <div className="chart-card glass-card">
          <h4>Monthly Registrations</h4>
          <div className="bar-chart">
            {MOCK_CHART.map((val, i) => (
              <div className="bar-item" key={i}>
                <div className="bar" style={{ height: `${(val / 100) * 90}px` }} />
                <span className="bar-label">{MONTHS[i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-card glass-card">
          <h4>Quick Stats</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
            {[
              { label: 'Total Events Hosted', val: loadingStats ? '--' : stats.totalEvents, color: 'var(--cyan)' },
              { label: 'Attendance Today', val: loadingStats ? '--' : stats.attendanceToday, color: 'var(--green)' },
              { label: 'Active Members', val: loadingStats ? '--' : Math.round(stats.totalMembers * 0.72), color: 'var(--gold)' },
              { label: 'Avg. Event Attendance', val: '~68%', color: 'var(--pink)' },
            ].map(({ label, val, color }) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-glass)' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: 'var(--text-secondary)', letterSpacing: '0.06em' }}>{label}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 700, color }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ===========================
// REGISTRATIONS
// ===========================
function Registrations() {
  const [regs, setRegs] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRegistrations()
      .then(res => setRegs(res.data))
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false))
  }, [])

  const handleApprove = async (id) => {
    try {
      await approveRegistration(id)
      setRegs(r => r.map(x => x.id === id ? { ...x, status: 'approved' } : x))
      toast.success('Registration approved!')
    } catch { toast.error('Failed to approve') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this registration?')) return
    try {
      await deleteRegistration(id)
      setRegs(r => r.filter(x => x.id !== id))
      toast.success('Registration deleted')
    } catch { toast.error('Failed to delete') }
  }

  const handleExport = async (format) => {
    try {
      const res = await exportRegistrations(format)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `registrations.${format}`
      a.click()
      URL.revokeObjectURL(url)
      toast.success(`Exported as ${format.toUpperCase()}`)
    } catch { toast.error('Export failed') }
  }

  const filtered = regs.filter(r =>
    [r.fullName, r.rollNumber, r.email, r.branch].some(v => v?.toLowerCase().includes(search.toLowerCase()))
  )

  const statusConfig = {
    approved: 'badge-green',
    pending: 'badge-gold',
    rejected: 'badge-pink',
  }

  return (
    <div>
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>All Registrations <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>({filtered.length})</span></h3>
          <div className="admin-table-actions">
            <div className="admin-search">
              <FiSearch size={14} />
              <input placeholder="Search by name, roll, email..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => handleExport('csv')}>
              <FiDownload /> CSV
            </button>
            <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => handleExport('xlsx')}>
              <FiDownload /> Excel
            </button>
          </div>
        </div>

        {loading ? (
          <div className="admin-loading"><span className="spinning"><FiLoader /></span> Loading registrations...</div>
        ) : filtered.length === 0 ? (
          <div className="admin-empty"><FiUsers size={32} /><p>No registrations found</p></div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Roll No.</th>
                  <th>Branch / Year</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id}>
                    <td className="td-mono">{i + 1}</td>
                    <td className="td-name">{r.fullName}</td>
                    <td className="td-mono">{r.rollNumber}</td>
                    <td>{r.branch} · {r.year}</td>
                    <td>{r.email}</td>
                    <td className="td-mono">{r.phone}</td>
                    <td><span className={`badge ${statusConfig[r.status] || 'badge-cyan'}`}>{r.status}</span></td>
                    <td className="td-mono">{new Date(r.createdAt).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="table-actions">
                        {r.status === 'pending' && (
                          <button className="icon-btn success" title="Approve" onClick={() => handleApprove(r.id)}><FiCheck /></button>
                        )}
                        <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(r.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================
// EVENTS MANAGEMENT
// ===========================
const EMPTY_EVENT = { title: '', description: '', category: 'Workshop', date: '', time: '', venue: '', capacity: 100, status: 'upcoming', image: '' }

const MOCK_ADMIN_EVENTS = []

function EventsManagement() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [loading, setLoading] = useState(true)

  const closeModal = () => { setShowModal(false); setEditEvent(null); setForm(EMPTY_EVENT) }

  useEffect(() => {
    getEvents()
      .then(res => setEvents(res.data || []))
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!showModal) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeModal()
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showModal])

  const openModal = (event = null) => {
    setEditEvent(event)
    setForm(event ? { ...event } : EMPTY_EVENT)
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.date || !form.venue) { toast.error('Fill required fields'); return }
    try {
      if (editEvent) {
        await updateEvent(editEvent.id, form)
        setEvents(ev => ev.map(x => x.id === editEvent.id ? { ...x, ...form } : x))
        toast.success('Event updated!')
      } else {
        const res = await createEvent(form)
        setEvents(ev => [...ev, res.data || { ...form, id: Date.now(), registered: 0 }])
        toast.success('Event created!')
      }
      closeModal()
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to save event. Please try again.'
      toast.error(msg)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this event?')) return
    try {
      await deleteEvent(id)
    } catch (err) {
      const msg = err.response?.data?.message || 'Unable to delete event. Please try again.'
      toast.error(msg)
      return
    }
    setEvents(ev => ev.filter(x => x.id !== id))
    toast.success('Event deleted')
  }

  const fset = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  return (
    <div>
      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>Events Management <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>({events.length})</span></h3>
          <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.78rem' }} onClick={() => openModal()}>
            <FiPlus /> Add Event
          </button>
        </div>

        {loading ? (
          <div className="admin-loading"><span className="spinning"><FiLoader /></span> Loading events...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Capacity</th>
                  <th>Registered</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((ev, i) => (
                  <tr key={ev.id}>
                    <td className="td-mono">{i + 1}</td>
                    <td className="td-name">{ev.title}</td>
                    <td>{ev.category}</td>
                    <td className="td-mono">{new Date(ev.date).toLocaleDateString('en-IN')}</td>
                    <td>{ev.venue}</td>
                    <td className="td-mono">{ev.capacity}</td>
                    <td>
                      <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>
                        {ev.registered}/{ev.capacity}
                      </span>
                    </td>
                    <td><span className={`badge ${ev.status === 'open' ? 'badge-green' : ev.status === 'completed' ? 'badge-gold' : ev.status === 'closed' ? 'badge-pink' : 'badge-cyan'}`}>{ev.status}</span></td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" title="Edit" onClick={() => openModal(ev)}><FiEdit2 /></button>
                        <button className="icon-btn danger" title="Delete" onClick={() => handleDelete(ev.id)}><FiTrash2 /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && closeModal()}>
          <div className="modal-card">
            <button className="modal-close" onClick={closeModal}><FiX /></button>
            <h3>{editEvent ? 'Edit Event' : 'Create New Event'}</h3>
            <form className="modal-form" onSubmit={handleSave}>
              <div className="form-group">
                <label className="form-label">Event Title *</label>
                <input className="form-input" value={form.title} onChange={fset('title')} placeholder="e.g. IoT Workshop 2025" required />
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={fset('category')}>
                    {['Workshop', 'Hackathon', 'Talk', 'Project Sprint', 'Other'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Status</label>
                  <select className="form-input" value={form.status} onChange={fset('status')}>
                    {['upcoming', 'open', 'closed', 'completed'].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Date *</label>
                  <input className="form-input" type="date" value={form.date} onChange={fset('date')} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Time</label>
                  <input className="form-input" type="time" value={form.time} onChange={fset('time')} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Venue *</label>
                  <input className="form-input" value={form.venue} onChange={fset('venue')} placeholder="e.g. Seminar Hall" required />
                </div>
                <div className="form-group">
                  <label className="form-label">Capacity</label>
                  <input className="form-input" type="number" value={form.capacity} onChange={fset('capacity')} min={1} />
                </div>
              </div>
              <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Event Poster / Picture</label>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={(e) => {
                        const file = e.target.files[0]
                        if(!file) return;
                        if(file.size > 5 * 1024 * 1024) {
                          alert('Picture too large! Max 5MB.');
                          return;
                        }
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setForm(f => ({ ...f, image: reader.result }))
                        }
                        reader.readAsDataURL(file)
                      }} 
                      style={{ fontSize: '0.8rem', flex: 1 }} 
                    />
                    {form.image && (
                      <img src={form.image} alt="Preview" style={{ height: '36px', width: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-glass)' }} />
                    )}
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">External Registration Link</label>
                  <input className="form-input" value={form.external_link || ''} onChange={fset('external_link')} placeholder="https://..." />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-input" value={form.description} onChange={fset('description')} rows={3} placeholder="Event description..." />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center', padding: '12px' }}>
                  {editEvent ? 'Update Event' : 'Create Event'}
                </button>
                <button type="button" className="btn btn-secondary" style={{ padding: '12px 20px' }} onClick={closeModal}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ===========================
// ATTENDANCE
// ===========================
function Attendance() {
  const [attendance, setAttendance] = useState([])
  const [loading, setLoading] = useState(true)
  const [qrInput, setQrInput] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    getAttendance()
      .then(res => setAttendance(res.data))
      .catch((e) => { console.error(e); })
      .finally(() => setLoading(false))
  }, [])

  const handleScan = async (e) => {
    e.preventDefault()
    if (!qrInput.trim()) return
    setScanning(true)
    try {
      const res = await markAttendance(qrInput.trim())
      toast.success('Attendance marked!')
      setAttendance(a => [res.data, ...a])
    } catch {
      toast.error('QR code not found or already scanned')
    } finally {
      setScanning(false)
      setQrInput('')
    }
  }

  return (
    <div>
      <div className="glass-card" style={{ marginBottom: 24, padding: '24px' }}>
        <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 16, letterSpacing: '0.05em' }}>
          Scan QR Code
        </h4>
        <form onSubmit={handleScan} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            className="form-input"
            value={qrInput}
            onChange={e => setQrInput(e.target.value)}
            placeholder="Enter or paste QR code / registration ID..."
            style={{ flex: 1, minWidth: 200 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 24px' }} disabled={scanning}>
            {scanning ? 'Scanning...' : <><FiCheckSquare /> Mark Attendance</>}
          </button>
        </form>
      </div>

      <div className="admin-table-wrapper">
        <div className="admin-table-header">
          <h3>Attendance Records <span style={{ color: 'var(--cyan)', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>({attendance.length})</span></h3>
          <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.75rem' }} onClick={() => {
            setLoading(true)
            getAttendance()
              .then(res => setAttendance(res.data))
              .catch(() => toast.error('Refresh failed'))
              .finally(() => setLoading(false))
          }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
        {loading ? (
          <div className="admin-loading"><span className="spinning"><FiLoader /></span> Loading attendance...</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Member</th>
                  <th>Roll No.</th>
                  <th>Event</th>
                  <th>Scanned At</th>
                </tr>
              </thead>
              <tbody>
                {attendance.map((a, i) => (
                  <tr key={a.id}>
                    <td className="td-mono">{i + 1}</td>
                    <td className="td-name">{a.memberName}</td>
                    <td className="td-mono">{a.rollNumber}</td>
                    <td>{a.eventName}</td>
                    <td className="td-mono">{new Date(a.scannedAt).toLocaleString('en-IN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

// ===========================
// PROTECTED LAYOUT
// ===========================

function Contacts() {
  const [queries, setQueries] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    import('../../services/eventService.js').then(s => {
      s.getContacts().then(res => setQueries(res.data)).catch(e => console.error(e)).finally(() => setLoading(false))
    })
  }, [])

  const handleResolve = async (id) => {
    try {
      const s = await import('../../services/eventService.js');
      await s.resolveContact(id)
      setQueries(queries.map(q => q._id === id ? { ...q, isResolved: true } : q))
      toast.success('Query marked as resolved!')
    } catch { toast.error('Failed to resolve') }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this query?')) return;
    try {
      const s = await import('../../services/eventService.js');
      await s.deleteContact(id)
      setQueries(queries.filter(q => q._id !== id))
      toast.success('Deleted successfully')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Contact Queries</h2>
      <div className="glass-card table-container">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>Date</th><th>Name</th><th>Email</th><th>Subject</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {queries.map(q => (
                <tr key={q._id}>
                  <td className="td-mono">{new Date(q.createdAt).toLocaleDateString()}</td>
                  <td>{q.name}</td>
                  <td>{q.email}</td>
                  <td style={{maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden'}}>{q.subject} - {q.message}</td>
                  <td><span className={`badge ${q.isResolved ? 'badge-green' : 'badge-pink'}`}>{q.isResolved ? 'Resolved' : 'Pending'}</span></td>
                  <td>
                    <div className="table-actions">
                      {!q.isResolved && <button className="icon-btn" onClick={() => handleResolve(q._id)}><span style={{color: 'green'}}>Ok</span></button>}
                      <button className="icon-btn danger" onClick={() => handleDelete(q._id)}><FiTrash2 /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {queries.length === 0 && <tr><td colSpan="6" style={{textAlign: 'center'}}>No queries found</td></tr>}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function AdminManagement() {
  const [admins, setAdmins] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const user = getUser()

  React.useEffect(() => {
    import('../../services/eventService.js').then(s => {
      s.getAdmins().then(res => setAdmins(res.data)).catch(e => console.error(e)).finally(() => setLoading(false))
    })
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Revoke access for this admin?')) return;
    try {
      const s = await import('../../services/eventService.js');
      await s.deleteAdmin(id)
      setAdmins(admins.filter(a => a._id !== id))
      toast.success('Admin removed')
    } catch { toast.error('Failed to remove admin') }
  }

  return (
    <div>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Admin Roles & Access</h2>
      <div className="glass-card table-container">
        {loading ? <p>Loading...</p> : (
          <table className="admin-table">
            <thead><tr><th>#</th><th>Username</th><th>Role</th><th>Created</th><th>Actions</th></tr></thead>
            <tbody>
              {admins.map((a, i) => (
                <tr key={a._id}>
                  <td className="td-mono">{i+1}</td>
                  <td>{a.username}</td>
                  <td><span className="badge badge-cyan">{a.role || 'Admin'}</span></td>
                  <td className="td-mono">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : 'N/A'}</td>
                  <td>
                    {user?.role === 'superadmin' && a.username !== 'admin' && (
                      <button className="icon-btn danger" onClick={() => handleDelete(a._id)}><FiTrash2 /></button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function AdminProtected() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const user = getUser()

  const pageLabels = {
    '/admin/dashboard': 'Dashboard',
    '/admin/registrations': 'Registrations',
    '/admin/events': 'Events',
    '/admin/attendance': 'Attendance',
    '/admin/analytics': 'Analytics',
  }

  const location = useLocation()
  const pageTitle = pageLabels[location.pathname] || 'Admin'

  // Close mobile sidebar automatically on navigation
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false)
  }, [location.pathname])

  if (!isAuthenticated()) return <Navigate to="/admin" replace />

  return (
    <div className="admin-layout">
      {mobileOpen && <div className="admin-sidebar-overlay" onClick={() => setMobileOpen(false)} />}
      <AdminSidebar collapsed={collapsed} mobileOpen={mobileOpen} setCollapsed={setCollapsed} />
      <div className={`admin-main${collapsed ? ' collapsed' : ''}`}>
        <div className="admin-topbar">
          <div className="admin-topbar-left">
            {/* Desktop Toggle */}
            <button className="topbar-toggle desktop-only" onClick={() => setCollapsed(!collapsed)}>
              {collapsed ? <FiMenu /> : <FiX />}
            </button>
            {/* Mobile Toggle */}
            <button className="topbar-toggle mobile-only" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FiX /> : <FiMenu />}
            </button>
            <h2>{pageTitle}</h2>
          </div>
          <div className="admin-topbar-right">
            <div className="admin-user-badge">
              <div className="admin-user-avatar">{user?.name?.[0] || 'A'}</div>
              <span className="admin-user-name">{user?.name || 'Admin'}</span>
            </div>
          </div>
        </div>
        <div className="admin-content">
          <Routes>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="registrations" element={<Registrations />} />
            <Route path="events" element={<EventsManagement />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="analytics" element={<Dashboard />} />
              <Route path="contacts" element={<Contacts />} />
              <Route path="users" element={<AdminManagement />} />
              <Route path="*" element={<Navigate to="dashboard" />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}

// ===========================
// ADMIN ROOT
// ===========================
export default function Admin() {
  return (
    <Routes>
      <Route path="/" element={isAuthenticated() ? <Navigate to="/admin/dashboard" /> : <AdminLogin />} />
      <Route path="/*" element={<AdminProtected />} />
    </Routes>
  )
}
