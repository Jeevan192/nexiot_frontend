import React from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowRight, FiAward, FiUsers, FiZap, FiTarget } from 'react-icons/fi'
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './About.css'

const team = [
  { name: 'Dasari Ishanvith', role: 'President', dept: 'CET', avatar: 'DI' },
  { name: 'P. Harini', role: 'Vice President', dept: 'CET', avatar: 'PH' },
  { name: 'Jeevan Reddy', role: 'Vice President', dept: 'CET', avatar: 'JR' },
  { name: 'Ridhima Balakrishna', role: 'General Secretary', dept: 'CET', avatar: 'RB' },
  { name: 'Ch Sai Harika', role: 'General Secretary', dept: 'CET', avatar: 'CH' },
  { name: 'Ananth', role: 'General Secretary', dept: 'CET', avatar: 'A' },
  { name: 'Sathvika Cheelamanthula', role: 'Joint Secretary', dept: 'CET', avatar: 'SC' },
  { name: 'Guduri Adhvika', role: 'Joint Secretary', dept: 'CET', avatar: 'GA' },
  { name: 'Manpreet Kaur', role: 'Treasurer', dept: 'CET', avatar: 'MK' },
  { name: 'M. Deekshitha', role: 'Treasurer', dept: 'CET', avatar: 'MD' },
  { name: 'Rohan Pudari', role: 'External Affairs', dept: 'CET', avatar: 'RP' },
  { name: 'Sadhika', role: 'Events Head', dept: 'CET', avatar: 'SA' },
  { name: 'Harsha', role: 'Events Head', dept: 'CET', avatar: 'HA' },
  { name: 'Abhinaya', role: 'Design Head', dept: 'CET', avatar: 'AB' },
  { name: 'Natalie Sasha', role: 'Design Head', dept: 'CET', avatar: 'NS' },
  { name: 'Manideep', role: 'Technical Head', dept: 'CET', avatar: 'MA' },
  { name: 'Manjunath', role: 'Technical Head', dept: 'CET', avatar: 'MJ' },
  { name: 'Ramya', role: 'Documentation Head', dept: 'CET', avatar: 'RA' },
  { name: 'Bhavya', role: 'Documentation Head', dept: 'CET', avatar: 'BH' },
  { name: 'Ruthwik', role: 'Sponsorship & Finance', dept: 'CET', avatar: 'RU' },
  { name: 'Vibhav', role: 'Sponsorship & Finance', dept: 'CET', avatar: 'VI' },
  { name: 'Faiz', role: 'PR Head', dept: 'CET', avatar: 'FA' },
  { name: 'Pranitha', role: 'PR Head', dept: 'CET', avatar: 'PR' },
  { name: 'Sathwik B S', role: 'Photography Head', dept: 'CET', avatar: 'SB' },
  { name: 'Shrithan', role: 'Photography Head', dept: 'CET', avatar: 'SH' },
  { name: 'Vikram', role: 'Logistics Head', dept: 'CET', avatar: 'VK' },
  { name: 'Ganesh', role: 'Logistics Head', dept: 'CET', avatar: 'GA' }
]

const timeline = [
  { year: '2024', title: 'Club Inception & Proposal', desc: 'NEX-IOT was proposed by students and faculty of the CET Department to explore the vast potential of the Internet of Things.' },
  { year: '2024', title: 'Inauguration & Fusion Expo', desc: 'Officially launched on Nov 12, 2024, featuring industry speakers and an exhibition of 17 diverse student IoT projects.' }
]

const previousTeam = [
  { name: 'MD Raheesh Arman', role: 'Student Coordinator', dept: 'CET', avatar: 'RA' },
  { name: 'B Praneeth', role: 'Student Coordinator', dept: 'CET', avatar: 'BP' },
  { name: 'G Rami Reddy', role: 'Student Coordinator', dept: 'CET', avatar: 'RR' }
]

export default function About() {
  const navigate = useNavigate()
  return (
    <div className="about-page">
      <div className="page-hero">
        <div className="page-hero-bg" />
        <div className="container">
          <span className="badge badge-cyan">Our Story</span>
          <h1 className="page-hero-title">About <span>NEX-IOT</span></h1>
          <p className="page-hero-sub">
            A student-driven club at CBIT, Hyderabad, dedicated to building the next generation of IoT engineers through hands-on learning, industry exposure, and real-world projects.
          </p>
        </div>
      </div>

      {/* Mission & Vision */}
      <section className="about-mv-section">
        <div className="container">
          <div className="about-mv-grid motion-fade-up motion-delay-2">
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
          <div className="timeline motion-fade-up motion-delay-2">
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
          <p className="section-subtitle">Divided by department.</p>

          <div className="team-departments motion-fade-up motion-delay-2">
            {[
              { title: "Core Committee", roles: ['President', 'Vice President', 'General Secretary', 'Joint Secretary', 'Treasurer'] },
              { title: "External Affairs", roles: ['External Affairs'] },
              { title: "Events", roles: ['Events Head'] },
              { title: "Design", roles: ['Design Head'] },
              { title: "Technical", roles: ['Technical Head'] },
              { title: "Documentation", roles: ['Documentation Head'] },
              { title: "Sponsorship & Finance", roles: ['Sponsorship & Finance'] },
              { title: "Public Relations", roles: ['PR Head'] },
              { title: "Photography", roles: ['Photography Head'] },
              { title: "Logistics", roles: ['Logistics Head'] }
            ].map(group => {
              const members = team.filter(m => group.roles.includes(m.role));
              if (members.length === 0) return null;
              return (
                <div key={group.title} className="team-department-wrapper" style={{ marginBottom: '3rem' }}>
                  <h3 className="department-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--teal)', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
                    {group.title}
                  </h3>
                  <div className="team-grid">
                    {members.map((member, i) => (
                      <div className="team-card glass-card" key={i}>
                        <div className="team-avatar">{member.avatar}</div>
                        <h4 className="team-name">{member.name}</h4>
                        <p className="team-role">{member.role}</p>
                        <span className="badge badge-cyan">{member.dept}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}

            <div className="team-department-wrapper" style={{ marginBottom: '3rem', marginTop: '4rem' }}>
              <h3 className="department-title" style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--gray-300)', borderBottom: '1px solid var(--line)', paddingBottom: '0.5rem' }}>
                Founding Student Coordinators (2024)
              </h3>
              <div className="team-grid opacity-75">
                {previousTeam.map((member, i) => (
                  <div className="team-card glass-card" key={i} style={{ border: '1px dashed var(--line)' }}>
                    <div className="team-avatar" style={{ background: 'var(--card-bg)' }}>{member.avatar}</div>
                    <h4 className="team-name">{member.name}</h4>
                    <p className="team-role">{member.role}</p>
                    <span className="badge badge-outline">{member.dept}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Faculty Advisor */}
      <section className="advisor-section">
        <div className="container">
          <div className="advisor-card glass-card motion-fade-up motion-delay-2">
            <div className="advisor-badge"><FiAward /> Faculty Advisor</div>
            <div className="advisor-avatar">FA</div>
            <h3 className="advisor-name">Ms. N. Sujata Gupta</h3>
            <p className="advisor-dept">Department of CET (Computer Engineering and Technology), CBIT</p>
            <p className="advisor-bio">
              Guiding NEX-IOT with expertise in embedded systems and wireless communications, helping students bridge academic theory with practical IoT implementation.
            </p>
          </div>
        </div>
      </section>

      <div className="container" style={{ textAlign: 'center', paddingBottom: '80px' }}>
        <button
          className="btn btn-primary"
          style={{ padding: '14px 36px' }}
          onClick={() => navigate('/register')}
          disabled={!CLUB_CONFIG.registrationsOpen}
        >
          {CLUB_CONFIG.registrationsOpen ? 'Join Our Community' : 'Registrations Closed'} <FiArrowRight />
        </button>
      </div>
    </div>
  )
}