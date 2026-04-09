import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiInstagram, FiLinkedin, FiTwitter, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div>
            <div className="footer-brand-logo">
              <img src="/final-logo-transparent.png" alt="NEX-IOT Logo" className="footer-logo-image" />
            </div>
            <p className="footer-tagline">
              Build the Future with IoT — A student-led tech club at CBIT, Hyderabad, driving innovation in embedded systems and connected devices.
            </p>
            <div className="footer-social">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><FiGithub /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram"><FiInstagram /></a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><FiLinkedin /></a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter"><FiTwitter /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4>Navigation</h4>
            <ul className="footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/events">Events</Link></li>
              <li><Link to="/register">{CLUB_CONFIG.registrationsOpen ? 'Join Club' : 'Registrations Closed'}</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/events">Projects Gallery</Link></li>
              <li><Link to="/events">Workshop Materials</Link></li>
              <li><Link to="/about">Club Documentation</Link></li>
              <li><Link to="/contact">Blog & Updates</Link></li>
              <li><Link to="/admin">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4>Contact</h4>
            <div className="footer-contact-item">
              <FiMapPin /> CBIT, Gandipet, Hyderabad
            </div>
            <div className="footer-contact-item">
              <FiMail /> nextiot@cbit.ac.in
            </div>
            <div className="footer-contact-item">
              <FiPhone />  99630 28231
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="footer-copyright">
            © 2025 <span>NEX-IOT Club</span> · CBIT, Hyderabad. All rights reserved.
          </p>
          <p className="footer-made">
            Organized by <span>Ms. N. Sujata Gupta</span>
          </p>
        </div>
      </div>
    </footer>
  )
}