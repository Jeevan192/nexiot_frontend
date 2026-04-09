import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  FiGrid, FiUsers, FiCalendar, FiBarChart2, FiSettings,
  FiLogOut, FiCheckSquare, FiDownload
} from 'react-icons/fi'
import { logout } from '../../services/authService.js'
import toast from 'react-hot-toast'

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <FiGrid /> },
  { path: '/admin/registrations', label: 'Registrations', icon: <FiUsers /> },
  { path: '/admin/events', label: 'Events', icon: <FiCalendar /> },
  { path: '/admin/attendance', label: 'Attendance', icon: <FiCheckSquare /> },
  { path: '/admin/analytics', label: 'Analytics', icon: <FiBarChart2 /> },
]

export default function AdminSidebar({ collapsed }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/admin')
  }

  return (
    <aside className={`admin-sidebar${collapsed ? ' collapsed' : ''}`}>
      <div className="admin-sidebar-header">
        <div className="admin-brand">
          <img src="/final-logo-transparent.png" alt="Logo" className={`admin-logo-image ${collapsed ? 'collapsed' : ''}`} />
        </div>
        {!collapsed && <p className="admin-brand-sub" style={{ marginTop: '0.4rem' }}>Admin Panel</p>}
      </div>

      <nav className="admin-nav">
        {adminNav.map(({ path, label, icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `admin-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="admin-nav-icon">{icon}</span>
            {!collapsed && <span className="admin-nav-label">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button className="admin-nav-item danger" onClick={handleLogout}>
          <span className="admin-nav-icon"><FiLogOut /></span>
          {!collapsed && <span className="admin-nav-label">Logout</span>}
        </button>
      </div>
    </aside>
  )
}