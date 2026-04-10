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
  getEvents, createEvent, updateEvent, deleteEvent, getDashboardStats, getAttendance, markAttendance,
} from '../../services/eventService.js'
import AdminSidebar from '../../components/AdminSidebar/AdminSidebar.jsx'
import './Admin.css'

// ===========================
// ADMIN LOGIN
// ===========================
function AdminLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.username || !form.password) { toast.error('Fill in both fields'); return }
    setLoading(true)
    try {
      await login(form)
      toast.success('Welcome back, Admin!')
      navigate('/admin/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid credentials'
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
          <h2>Admin Portal</h2>
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
              placeholder="admin"
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
                autoComplete="current-password"
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
          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '13px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Authenticating...' : <><FiLock /> Sign In to Admin</>}
          </button>
        </form>
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
const MOCK_STATS = {
  totalMembers: 248,
  pendingApprovals: 12,
  upcomingEvents: 4,
  totalEvents: 18,
  attendanceToday: 32,
  thisMonthReg: 28,
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug']
const MOCK_CHART = [30, 45, 28, 60, 75, 52, 88, 28]

function Dashboard() {
  const [stats, setStats] = useState(MOCK_STATS)
  const user = getUser()

  useEffect(() => {
    getDashboardStats()
      .then(res => setStats(res.data))
      .catch(() => setStats(MOCK_STATS))
  }, [])

  const statCards = [
    { label: 'Total Members', value: stats.totalMembers, icon: <FiUsers />, change: '+12%', accent: 'var(--cyan)', iconBg: 'rgba(0,245,255,0.08)', iconColor: 'var(--cyan)', iconBorder: 'rgba(0,245,255,0.15)' },
    { label: 'Pending Approvals', value: stats.pendingApprovals, icon: <FiCheckSquare />, change: 'Today', accent: 'var(--gold)', iconBg: 'rgba(255,215,0,0.08)', iconColor: 'var(--gold)', iconBorder: 'rgba(255,215,0,0.15)' },
    { label: 'Upcoming Events', value: stats.upcomingEvents, icon: <FiCalendar />, change: 'Active', accent: 'var(--green)', iconBg: 'rgba(0,255,136,0.08)', iconColor: 'var(--green)', iconBorder: 'rgba(0,255,136,0.15)' },
    { label: 'This Month Reg.', value: stats.thisMonthReg, icon: <FiBarChart2 />, change: '+8%', accent: 'var(--pink)', iconBg: 'rgba(102,191,255,0.1)', iconColor: 'var(--pink)', iconBorder: 'rgba(102,191,255,0.2)' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--text-primary)', marginBottom: 4 }}>
          Welcome back{user?.name ? `, ${user.name}` : ''}!
        </h2>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>
          // NEX-IOT ADMIN DASHBOARD · {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
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
              { label: 'Total Events Hosted', val: stats.totalEvents, color: 'var(--cyan)' },
              { label: 'Attendance Today', val: stats.attendanceToday, color: 'var(--green)' },
              { label: 'Active Members', val: Math.round(stats.totalMembers * 0.72), color: 'var(--gold)' },
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
const MOCK_REGS = [
  { id: 1, fullName: 'Aditya Kumar', rollNumber: '22B01A0501', branch: 'CSE', year: '3rd Year', email: 'aditya@cbit.ac.in', phone: '9876543210', status: 'pending', createdAt: '2025-08-01' },
  { id: 2, fullName: 'Priya Reddy', rollNumber: '22B01A0423', branch: 'ECE', year: '3rd Year', email: 'priya@cbit.ac.in', phone: '9876543211', status: 'approved', createdAt: '2025-08-02' },
  { id: 3, fullName: 'Karthik Singh', rollNumber: '23B05A0112', branch: 'IT', year: '2nd Year', email: 'karthik@cbit.ac.in', phone: '9876543212', status: 'pending', createdAt: '2025-08-03' },
  { id: 4, fullName: 'Sneha Sharma', rollNumber: '21B01A0334', branch: 'EEE', year: '4th Year', email: 'sneha@cbit.ac.in', phone: '9876543213', status: 'approved', createdAt: '2025-08-04' },
  { id: 5, fullName: 'Rahul Nair', rollNumber: '23B02A0567', branch: 'CSE', year: '2nd Year', email: 'rahul@cbit.ac.in', phone: '9876543214', status: 'pending', createdAt: '2025-08-05' },
]

function Registrations() {
  const [regs, setRegs] = useState(MOCK_REGS)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getRegistrations()
      .then(res => setRegs(res.data))
      .catch(() => setRegs(MOCK_REGS))
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
const EMPTY_EVENT = { title: '', description: '', category: 'Workshop', date: '', time: '', venue: '', capacity: 100, status: 'upcoming', icon: '⚡' }

const MOCK_ADMIN_EVENTS = []

function EventsManagement() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editEvent, setEditEvent] = useState(null)
  const [form, setForm] = useState(EMPTY_EVENT)
  const [loading, setLoading] = useState(true)

  const closeModal = () => { setShowModal(false); setEditEvent(null); setForm(EMPTY_EVENT) }

  useEffect(() => {
    const onlyClubEvents = (items) => items.filter((item) => {
      const source = `${item?.club || item?.organizer || item?.source || ''}`.toLowerCase()
      return source.includes('nex-iot') || source.includes('nexiot') || (source.includes('nex') && source.includes('iot'))
    })

    getEvents()
      .then(res => setEvents(onlyClubEvents(res.data || [])))
      .catch(() => setEvents(MOCK_ADMIN_EVENTS))
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
const MOCK_ATTENDANCE = [
  { id: 1, memberName: 'Aditya Kumar', rollNumber: '22B01A0501', eventName: 'IoT Bootcamp 2025', scannedAt: '2025-08-15T09:12:00' },
  { id: 2, memberName: 'Priya Reddy', rollNumber: '22B01A0423', eventName: 'IoT Bootcamp 2025', scannedAt: '2025-08-15T09:18:00' },
  { id: 3, memberName: 'Sneha Sharma', rollNumber: '21B01A0334', eventName: 'IoT Bootcamp 2025', scannedAt: '2025-08-15T09:22:00' },
]

function Attendance() {
  const [attendance, setAttendance] = useState(MOCK_ATTENDANCE)
  const [qrInput, setQrInput] = useState('')
  const [scanning, setScanning] = useState(false)

  useEffect(() => {
    getAttendance().then(res => setAttendance(res.data)).catch(() => setAttendance(MOCK_ATTENDANCE))
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
            getAttendance().then(res => setAttendance(res.data)).catch(() => toast.error('Refresh failed'))
          }}>
            <FiRefreshCw /> Refresh
          </button>
        </div>
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
      </div>
    </div>
  )
}

// ===========================
// PROTECTED LAYOUT
// ===========================
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