import React, { useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowRight, FiZap, FiCpu, FiWifi, FiCode, FiAward, FiUsers, FiCalendar, FiStar } from 'react-icons/fi'
import './Home.css'

const features = [
  { icon: '🔌', title: 'Embedded Systems', desc: 'Hands-on experience with Arduino, Raspberry Pi, and custom PCB design for real-world IoT applications.' },
  { icon: '📡', title: 'Wireless Protocols', desc: 'Deep dive into MQTT, LoRa, Zigbee, BLE — building the communication backbone of connected devices.' },
  { icon: '☁️', title: 'Cloud Integration', desc: 'Stream sensor data to AWS IoT, Azure, and Firebase. Build dashboards that visualize real-time data.' },
  { icon: '🤖', title: 'Edge AI & ML', desc: 'Deploy TinyML models on microcontrollers. Bring intelligence to constrained edge devices.' },
  { icon: '🔒', title: 'IoT Security', desc: 'Learn device hardening, secure boot, TLS for embedded systems, and zero-trust architectures.' },
  { icon: '🛠️', title: 'Project Labs', desc: 'Monthly build sprints. Work in teams to prototype IoT products from concept to working demo.' },
]

const techStack = [
  'Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'LoRaWAN',
  'AWS IoT', 'Azure IoT Hub', 'TinyML', 'FreeRTOS', 'Node-RED',
  'Firebase', 'Python', 'C/C++', 'Docker', 'Kubernetes',
  'Arduino', 'Raspberry Pi', 'ESP32', 'MQTT', 'LoRaWAN',
  'AWS IoT', 'Azure IoT Hub', 'TinyML', 'FreeRTOS', 'Node-RED',
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="home-page">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-bg">
          <div className="hero-grid" />
          <div className="hero-scanline" />
          <div className="hero-orb-1" />
          <div className="hero-orb-2" />
        </div>

        {/* Floating nodes */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="hero-node"
            style={{
              left: `${15 + i * 14}%`,
              top: `${20 + (i % 3) * 25}%`,
              '--dur': `${3 + i * 0.5}s`,
              '--delay': `${i * 0.4}s`,
              '--tx': `${(i % 2 === 0 ? 1 : -1) * 15}px`,
              '--ty': `${(i % 2 === 0 ? -1 : 1) * 10}px`,
            }}
          />
        ))}

        <div className="container">
          <div className="hero-content">
            <div className="hero-eyebrow">
              <div className="hero-eyebrow-line" />
              <span className="hero-eyebrow-text">CBIT · Hyderabad · Est. 2022</span>
            </div>

            <h1 className="hero-title">
              <span className="hero-title-line1">BUILD THE</span>
              <span className="hero-title-line2">FUTURE<br />WITH IoT</span>
            </h1>

            <p className="hero-subtitle">
              Next-IoT is CBIT's premier technology club for students passionate about
              embedded systems, connected devices, and the Internet of Things. Join 200+
              innovators shaping tomorrow's tech.
            </p>

            <div className="hero-cta">
              <button className="btn btn-primary" onClick={() => navigate('/register')}>
                Join Next-IoT <FiArrowRight />
              </button>
              <button className="btn btn-secondary" onClick={() => navigate('/events')}>
                View Events
              </button>
            </div>

            <div className="hero-stats">
              {[
                { num: '200+', label: 'Members' },
                { num: '30+', label: 'Projects' },
                { num: '15+', label: 'Events / Year' },
                { num: '12+', label: 'Mentors' },
              ].map(({ num, label }) => (
                <div className="hero-stat" key={label}>
                  <span className="hero-stat-num">{num}</span>
                  <span className="hero-stat-label">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== TECH STRIP ===== */}
      <div className="tech-strip">
        <div className="tech-strip-inner">
          {techStack.map((tech, i) => (
            <div className="tech-chip" key={i}>
              <div className="dot" />
              {tech}
            </div>
          ))}
        </div>
      </div>

      {/* ===== FEATURES ===== */}
      <section className="features-section">
        <div className="container">
          <p className="section-subtitle animate-fadeInUp" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
            What We Do
          </p>
          <h2 className="section-title">
            Explore the <span>IoT Ecosystem</span>
          </h2>
          <p className="section-subtitle">
            From hardware hacking to cloud deployments — we cover the full stack of connected intelligence.
          </p>

          <div className="features-grid">
            {features.map((f, i) => (
              <div
                className="feature-card glass-card"
                key={i}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <span className="badge badge-cyan" style={{ marginBottom: '24px' }}>Applications Open</span>
            <h2>Ready to Build <span style={{ color: 'var(--cyan)' }}>the Future?</span></h2>
            <p>Join hundreds of CBIT students already building smart homes, industrial sensors, and AI-powered edge devices.</p>
            <button className="btn btn-primary" onClick={() => navigate('/register')}>
              Apply Now — It's Free <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}