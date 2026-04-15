import React, { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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

const routePrefetchers = {
  '/': () => import('../../Pages/Home/Home.jsx'),
  '/about': () => import('../../Pages/About/About.jsx'),
  '/events': () => import('../../Pages/Events/Events.jsx'),
  '/contact': () => import('../../Pages/Contact/Contact.jsx'),
  '/register': () => import('../../Pages/Register/Register.jsx'),
  '/success': () => import('../../Pages/Success/Success.jsx'),
  '/admin': () => import('../../Pages/Admin/Admin.jsx'),
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuVisible, setMenuVisible] = useState(false)
  const navigate = useNavigate()

  const prefetchRoute = (path) => {
    const load = routePrefetchers[path]
    if (!load) return
    load().catch(() => {
      // Route prefetch is optional. Ignore failures.
    })
  }

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
    if (menuOpen) {
      const openTimer = setTimeout(() => setMenuVisible(true), 0)
      return () => clearTimeout(openTimer)
    }

    const closeTimer = setTimeout(() => setMenuVisible(false), 220)
    return () => clearTimeout(closeTimer)
  }, [menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`} aria-label="Main navigation">
        <div className="navbar-inner">
          <div
            className="nav-logo"
            style={{ cursor: 'pointer' }}
            onMouseEnter={() => prefetchRoute('/')}
            onTouchStart={() => prefetchRoute('/')}
            onClick={() => { setMenuOpen(false); navigate('/'); }}
            onDoubleClick={() => navigate('/admin')}
          >
            <img 
              src="/final-logo-transparent.png" 
              alt="NEX-IOT Logo" 
              className="nav-logo-image" 
              title="Double click for secret admin access"
            />
          </div>

          <ul className="nav-links">
            {navItems.map(({ path, label, icon }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  className={({ isActive }) => isActive ? 'active' : ''}
                  end={path === '/'}
                  onMouseEnter={() => prefetchRoute(path)}
                  onFocus={() => prefetchRoute(path)}
                  onTouchStart={() => prefetchRoute(path)}
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

      <div id="mobile-nav" className={`nav-mobile${menuVisible ? ' visible' : ''}${menuOpen ? ' open' : ''}`}>
        <ul>
          {navItems.map(({ path, label, icon }) => (
            <li key={path}>
              <NavLink
                to={path}
                className={({ isActive }) => isActive ? 'active' : ''}
                end={path === '/'}
                onMouseEnter={() => prefetchRoute(path)}
                onFocus={() => prefetchRoute(path)}
                onTouchStart={() => prefetchRoute(path)}
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
            onMouseEnter={() => prefetchRoute('/register')}
            onTouchStart={() => prefetchRoute('/register')}
            onClick={() => { handleRegisterClick(); setMenuOpen(false) }}
          >
            <FiUserPlus /> {CLUB_CONFIG.registrationsOpen ? 'Join NEX-IOT' : 'Registrations Closed'}
          </button>
        </div>
      </div>
    </>
  )
}