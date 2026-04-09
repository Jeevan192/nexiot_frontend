import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiHome, FiInfo, FiCalendar, FiMail, FiUserPlus } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
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

  const handleRegisterClick = () => {
    if (!CLUB_CONFIG.registrationsOpen) {
      toast.error(CLUB_CONFIG.registrationNotice)
      return
    }
    navigate('/register')
  }

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
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-inner">
          <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
            <img 
              src="/final-logo-transparent.png" 
              alt="NEX-IOT Logo" 
              className="nav-logo-image" 
            />
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
            <button className="btn btn-primary nav-register-btn" onClick={handleRegisterClick}>
              <FiUserPlus /> {CLUB_CONFIG.registrationsOpen ? 'Register' : 'Registrations Closed'}
            </button>
          </div>

          <button
            className={`nav-hamburger${menuOpen ? ' open' : ''}`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      <div id="mobile-nav" className={`nav-mobile${menuOpen ? ' open' : ''}`}>
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
            onClick={() => { handleRegisterClick(); setMenuOpen(false) }}
          >
            <FiUserPlus /> {CLUB_CONFIG.registrationsOpen ? 'Join NEX-IOT' : 'Registrations Closed'}
          </button>
        </div>
      </div>
    </>
  )
}