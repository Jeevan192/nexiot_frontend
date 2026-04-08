import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiZap, FiHome, FiInfo, FiCalendar, FiMail, FiUserPlus } from 'react-icons/fi'
import './Navbar.css'

const navItems = [
  { path: '/', label: 'Home', icon: <FiHome /> },
  { path: '/about', label: 'About', icon: <FiInfo /> },
  { path: '/events', label: 'Events', icon: <FiCalendar /> },
  { path: '/contact', label: 'Contact', icon: <FiMail /> },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="navbar-inner">
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <div className="nav-logo-icon">IoT</div>
            <span className="nav-logo-text">NEXT<span>-IoT</span></span>
          </Link>

          <ul className="nav-links">
            {navItems.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={path === '/'}
                >
                  {icon} {label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="nav-cta">
            <button className="btn btn-primary nav-register-btn" onClick={() => navigate('/register')}>
              <FiUserPlus /> Register
            </button>
          </div>

          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div className={`nav-mobile${menuOpen ? ' open' : ''}`}>
        <ul>
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={path === '/'}
                onClick={() => setMenuOpen(false)}
              >
                {icon} {label}
              </NavLink>
            </li>
          ))}
        </ul>
        <div className="nav-mobile-cta">
          <button
            className="btn btn-primary"
            onClick={() => { navigate('/register'); setMenuOpen(false) }}
          >
            <FiUserPlus /> Join Next-IoT
          </button>
        </div>
      </div>
    </>
  )
}