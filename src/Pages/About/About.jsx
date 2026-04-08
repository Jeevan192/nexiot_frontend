import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiAward, FiUsers, FiZap, FiTarget } from 'react-icons/fi'
import './About.css'

const team = [
  { name: 'Sujatha Gupta', role: 'Club Organizer', dept: 'CET', avatar: 'SG' },
  { name: 'Jeevan Reddy', role: 'President', dept: 'CET', avatar: 'JR' },
  { name: 'Ananth', role: 'Vice President', dept: 'CET', avatar: 'A' },
  { name: 'K Manideep', role: 'Technical Head', dept: 'CET', avatar: 'KM' },
  { name: 'Sri Harsha', role: 'Events Head', dept: 'CET', avatar: 'SH' },
]

const timeline = [
  { year: '2022', title: 'Club Founded', desc: 'Next-IoT was established with 30 founding members and a mission to democratize IoT education at CBIT.' },
  { year: '2023', title: 'First Hackathon', desc: 'Hosted CBIT\'s first IoT hackathon with 120+ participants. 3 projects went on to receive startup funding.' },
  { year: '2024', title: '200 Members', desc: 'Crossed 200 active members. Launched Industry Mentor Program with 12 IoT professionals.' },
  { year: '2025', title: 'Lab Inauguration', desc: 'Dedicated IoT lab inaugurated with ESP32 kits, oscilloscopes, and Raspberry Pi clusters.' },
]

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Our Story</span>
          <h1 className="page-hero-title">About <span>Next-IoT</span></h1>
          <p className="page-hero-sub">
            A student-driven club at CBIT, Hyderabad, dedicated to building the next generation of IoT engineers through hands-on learning, industry exposure, and real-world projects.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="about-mv-section">
        <div className="container">
          <div className="about-mv-grid">
            <div className="glass-card about-mv-card">
              <div className="about-mv-icon"><FiTarget /></div>
              <h3>Our Mission</h3>
              <p>To provide CBIT students with practical, industry-aligned IoT education — from embedded systems fundamentals to cloud-connected deployments — fostering a culture of innovation and collaborative building.</p>
            </div>
            <div className="glass-card about-mv-card">
              <div className="about-mv-icon"><FiZap /></div>
              <h3>Our Vision</h3>
              <p>To become South India's leading student IoT community — producing engineers who can bridge the physical and digital worlds through smart, scalable, and secure connected systems.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="about-timeline-section">
        <div className="container">
          <h2 className="section-title">Our <span>Journey</span></h2>
          <p className="section-subtitle">From a small idea to a thriving community of innovators.</p>
          <div className="timeline">
            {timeline.map((item, i) => (
              <div className="timeline-item" key={i} style={{ animationDelay: `${i * 0.15}s` }}>
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-dot" />
                <div className="timeline-content glass-card">
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="about-team-section">
        <div className="container">
          <h2 className="section-title">Meet the <span>Team</span></h2>
          <p className="section-subtitle">The passionate students driving Next-IoT forward.</p>
          <div className="team-grid">
            {team.map((member, i) => (
              <div className="team-card glass-card" key={i}>
                <div className="team-avatar">{member.avatar}</div>
                <h4 className="team-name">{member.name}</h4>
                <p className="team-role">{member.role}</p>
                <span className="badge badge-cyan">{member.dept}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Faculty Advisor */}
      <section className="advisor-section">
        <div className="container">
          <div className="advisor-card glass-card">
            <div className="advisor-badge"><FiAward /> Faculty Advisor</div>
            <div className="advisor-avatar">FA</div>
            <h3 className="advisor-name">Prof. Ms. N. Sujata Gupta</h3>
            <p className="advisor-dept">Department of Electronics & Communication Engineering, CBIT</p>
            <p className="advisor-bio">
              Guiding Next-IoT with expertise in embedded systems and wireless communications, helping students bridge academic theory with practical IoT implementation.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <button className="btn btn-primary" style={{ padding: '14px 36px' }} onClick={() => navigate('/register')}>
          Join Our Community <FiArrowRight />
        </button>
      </div>
    </div>
  )
}