import React, { useMemo, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useMotionTemplate, useScroll, useTransform, animate, useInView, useReducedMotion } from 'framer-motion'
import Tilt from 'react-parallax-tilt'
import { FiArrowRight, FiGlobe, FiSearch, FiLayers, FiCpu, FiMap, FiBookOpen, FiHelpCircle, FiActivity, FiCommand, FiRadio } from 'react-icons/fi'
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { CLUB_CONFIG } from '../../config/clubConfig.js'
import './Home.css'

const AnimatedNumber = ({ value }) => {
  const [display, setDisplay] = useState(0);
  
  const valueStr = String(value);
  const numericMatch = valueStr.match(/\d+/);
  const targetNumber = numericMatch ? parseInt(numericMatch[0], 10) : 0;
  const suffix = valueStr.replace(/\d+/, '');

  return (
    <motion.strong
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      onViewportEnter={() => {
        if (targetNumber > 0) {
          const controls = animate(0, targetNumber, {
            duration: 1.2,
            ease: "easeOut",
            onUpdate: (val) => setDisplay(Math.round(val))
          });
          return () => controls.stop();
        } else {
          setDisplay(targetNumber);
        }
      }}
    >
      {display || "0"}{suffix}
    </motion.strong>
  );
};

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
  'Firebase', 'Python', 'C/C++', 'Docker', 'Kubernetes'
]

const missionRows = [
  { label: 'Track', value: 'Edge AI' },
  { label: 'Current Sprint', value: '05' },
  { label: 'Active Teams', value: '08' },
  { label: 'Review Window', value: 'Fri 6:00 PM' },
]

const platformModules = [
  {
    title: 'Agent Workflows',
    icon: <FiLayers />,
    text: 'Orchestrate multi-step project pipelines with web context, docs, and hardware telemetry in one stream.',
  },
  {
    title: 'Live Search',
    icon: <FiSearch />,
    text: 'Search real-time references, component docs, and implementation examples without leaving the build surface.',
  },
  {
    title: 'Embeddings Ready',
    icon: <FiCpu />,
    text: 'Vectorize project notes and event archives for semantic retrieval, recommendations, and fast internal knowledge lookup.',
  },
  {
    title: 'Global Deploy',
    icon: <FiGlobe />,
    text: 'Ship production-ready demos with structured workflows, clear telemetry, and repeatable release patterns.',
  },
]

const pathways = [
  {
    title: 'Beginner Track',
    subtitle: 'New to IoT',
    text: 'Start with guided hardware basics, sensor wiring, and simple dashboards in the first 3 weeks.',
  },
  {
    title: 'Builder Track',
    subtitle: 'Project Focused',
    text: 'Join sprint teams to ship functional prototypes with firmware, cloud integration, and field tests.',
  },
  {
    title: 'Lead Track',
    subtitle: 'Mentor + Deploy',
    text: 'Mentor juniors, own technical modules, and lead showcase-ready deployments for events and demos.',
  },
]

const quickResources = [
  { title: 'Club Overview', text: 'Understand goals, leadership, and how the club runs.', route: '/about' },
  { title: 'Event Timeline', text: 'Check workshops, demos, and active participation windows.', route: '/events' },
  { title: 'Membership Form', text: 'Apply directly when intake is open for your batch.', route: '/register' },
  { title: 'Support + Queries', text: 'Reach coordinators for doubts, proposals, or collaborations.', route: '/contact' },
]

const faqs = [
  {
    q: 'Do I need prior hardware experience?',
    a: 'No. The Beginner Track is designed for first-year and first-time builders with step-by-step mentoring.',
  },
  {
    q: 'How often are projects and events held?',
    a: 'The club runs regular build sessions and publishes official workshops/events through the Events page.',
  },
  {
    q: 'Can students from any branch join?',
    a: 'Yes. NEX-IOT is interdisciplinary and welcomes students interested in embedded systems and connected products.',
  },
  {
    q: 'How are teams formed for projects?',
    a: 'Teams are formed by interest and skill balance so members can learn across firmware, hardware, and cloud layers.',
  },
]

const impactSignals = [
  { icon: <FiActivity />, title: 'Weekly Build Ops', text: 'Fast execution loops with review checkpoints and mentor feedback.' },
  { icon: <FiRadio />, title: 'Real Device Signals', text: 'Projects are tested on hardware, not only simulated dashboards.' },
  { icon: <FiCommand />, title: 'Deployment Culture', text: 'From idea to demo: members present outcomes in public showcases.' },
]

const trustedBy = ['CBIT CSE', 'CBIT ECE', 'CBIT IT', 'Student Innovation Cell', 'Faculty Mentors', 'Industry Alumni']

const proofStats = [
  { value: '300+', label: 'Active Participants' },
  { value: '17+', label: 'Built Projects' },
  { value: '10+', label: 'Mentors & Advisors' },
  { value: '1', label: 'Fusion Expo Conducted' },
]

const missionModes = [
  {
    id: 'firmware',
    label: 'Firmware',
    objective: 'Ship stable code to constrained hardware with real telemetry and watchdog recovery.',
    stack: ['ESP32', 'FreeRTOS', 'MQTT'],
    difficulty: 'Intermediate',
  },
  {
    id: 'cloud',
    label: 'Cloud',
    objective: 'Build ingestion pipelines, low-latency dashboards, and reliable device management flows.',
    stack: ['AWS IoT', 'Node-RED', 'Grafana'],
    difficulty: 'Beginner-Friendly',
  },
  {
    id: 'edge-ai',
    label: 'Edge AI',
    objective: 'Deploy efficient on-device intelligence for detection, prediction, and autonomous response.',
    stack: ['TinyML', 'TensorFlow Lite', 'ONNX'],
    difficulty: 'Advanced',
  },
]

const blueprintPhases = [
  {
    step: '01',
    title: 'Observe the Problem',
    text: 'Field observations and user interviews define constraints before a single component is chosen.',
  },
  {
    step: '02',
    title: 'Prototype Fast',
    text: 'Build rough hardware + firmware loops in days, then test with real inputs and failure states.',
  },
  {
    step: '03',
    title: 'Instrument Everything',
    text: 'Capture metrics, latency, and edge behavior to make decisions from data instead of guesswork.',
  },
  {
    step: '04',
    title: 'Demo in Public',
    text: 'Deliver with clear storytelling, reproducible setup notes, and measurable outcomes.',
  },
]

export default function Home() {
  const navigate = useNavigate()
  const [activeMode, setActiveMode] = useState(missionModes[0].id)
  const [init, setInit] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const shouldReduceMotion = Boolean(prefersReducedMotion)
  const pointerRafRef = useRef(0)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 768px), (pointer: coarse)')
    const updateTouchState = () => setIsTouchDevice(media.matches)
    updateTouchState()

    if (typeof media.addEventListener === 'function') {
      media.addEventListener('change', updateTouchState)
    } else if (typeof media.addListener === 'function') {
      media.addListener(updateTouchState)
    }

    return () => {
      if (typeof media.removeEventListener === 'function') {
        media.removeEventListener('change', updateTouchState)
      } else if (typeof media.removeListener === 'function') {
        media.removeListener(updateTouchState)
      }
    }
  }, [])

  useEffect(() => {
    if (shouldReduceMotion) {
      setInit(false)
      return undefined
    }

    let mounted = true
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => {
      if (mounted) setInit(true)
    })

    return () => {
      mounted = false
    }
  }, [shouldReduceMotion])

  // Disabled Framer Motion useScroll hook to completely eradicate scrolling 
  // framerate lag and jitter on mobile and entry-level desktop GPUs.
  // const { scrollYProgress } = useScroll();
  // const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  // const ringScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);

  // Global mouse tracking for the spotlight glow
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 3D Parallax tracking values for the hero showcase (normalized -1 to 1)
  const px = useMotionValue(0);
  const py = useMotionValue(0);

  // Smooth springs for the rotation
  const smoothPx = useMotionValue(0);
  const smoothPy = useMotionValue(0);

  useEffect(() => {
    if (shouldReduceMotion) return undefined

    // Only smoothly animate the rotations so it feels weighty like a physical object
    const unsubscribeX = px.on("change", (v) => {
      smoothPx.set(smoothPx.get() + (v - smoothPx.get()) * 0.08); // Spring-like damping
    });
    const unsubscribeY = py.on("change", (v) => {
      smoothPy.set(smoothPy.get() + (v - smoothPy.get()) * 0.08);
    });
    
    // Animation loop for smooth trailing
    let animationFrameId;
    const loop = () => {
      smoothPx.set(smoothPx.get() + (px.get() - smoothPx.get()) * 0.08);
      smoothPy.set(smoothPy.get() + (py.get() - smoothPy.get()) * 0.08);
      animationFrameId = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      unsubscribeX();
      unsubscribeY();
      cancelAnimationFrame(animationFrameId);
    };
  }, [px, py, smoothPx, smoothPy, shouldReduceMotion]);

  const rotateX = useTransform(smoothPy, [-1, 1], [15, -15]); // Up/Down tilts X axis
  const rotateY = useTransform(smoothPx, [-1, 1], [-15, 15]); // Left/Right tilts Y axis

  // Calculate dynamic glare based on smooth mouse position
  const glareX = useTransform(smoothPx, [-1, 1], ['100%', '0%']);
  const glareY = useTransform(smoothPy, [-1, 1], ['100%', '0%']);
  const glareOpacity = useTransform(smoothPx, [-1, 0, 1], [0.3, 0.1, 0.3]);

  // Floating layers internal parallax based on mouse
  const layer1X = useTransform(smoothPx, [-1, 1], [-20, 20]);
  const layer1Y = useTransform(smoothPy, [-1, 1], [-20, 20]);
  const layer2X = useTransform(smoothPx, [-1, 1], [-40, 40]);
  const layer2Y = useTransform(smoothPy, [-1, 1], [-40, 40]);

  useEffect(() => {
    return () => {
      if (pointerRafRef.current) {
        cancelAnimationFrame(pointerRafRef.current)
      }
    }
  }, [])

  function handlePointerMove(e) {
    if (shouldReduceMotion) return

    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const currentTarget = e.currentTarget;

    if (pointerRafRef.current) {
      cancelAnimationFrame(pointerRafRef.current)
    }

    pointerRafRef.current = requestAnimationFrame(() => {
      if (!currentTarget) return;
      let { left, top, width, height } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);

      // Add a damping factor for mobile to make it less chaotic
      const damp = isTouchDevice ? 2.5 : 1;
      const centerX = left + width / 2;
      const centerY = top + height / 2;
      px.set(Math.max(-1, Math.min(1, ((clientX - centerX) / (width / 2)) / damp)));
      py.set(Math.max(-1, Math.min(1, ((clientY - centerY) / (height / 2)) / damp)));
    })
  }

  const selectedMode = useMemo(
    () => missionModes.find((item) => item.id === activeMode) || missionModes[0],
    [activeMode]
  )

  const particlesOptions = useMemo(() => {
    const isMobile = isTouchDevice || window.innerWidth <= 768;
    return {
      background: { color: { value: "transparent" } },
      fpsLimit: isMobile ? 60 : 90,
      interactivity: {
        events: {
          onClick: { enable: !isMobile, mode: "push" },
          onHover: { enable: !isMobile, mode: "grab" },
        },
        modes: {
          push: { quantity: isMobile ? 2 : 4 },
          grab: { distance: isMobile ? 100 : 150, links: { opacity: 0.8, color: '#00f5ff' } },
        },
      },
      particles: {
        color: { value: "#00f5ff" },
        links: { color: "#00f5ff", distance: isMobile ? 80 : 150, enable: !isMobile, opacity: isMobile ? 0.1 : 0.2, width: 1 },
        move: {
          direction: "none",
          enable: true,
          outModes: { default: "bounce" },
          random: false,
          speed: isMobile ? 0 : 1.2,
          straight: false,
        },
        number: { density: { enable: true }, value: isMobile ? 0 : 56 },
        opacity: { value: isMobile ? 0.3 : 0.4 },
        shape: { type: "circle" },
        size: { value: { min: 1, max: 2.5 } },
      },
      detectRetina: !isMobile,
    }
  }, [isTouchDevice, shouldReduceMotion])

  const pointerGlowBackground = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(42, 240, 224, 0.05),
      transparent 80%
    )
  `

  const dynamicBoxShadow = useTransform(
    [smoothPx, smoothPy],
    ([spx, spy]) => `${-spx * 30}px ${-spy * 30 + 40}px 80px rgba(0, 0, 0, 0.6)`
  )

  const glareBackgroundTemplate = useMotionTemplate`radial-gradient(ellipse at ${glareX} ${glareY}, rgba(255, 255, 255, ${glareOpacity}), transparent 60%)`

  const goRegister = () => {
    if (CLUB_CONFIG.registrationsOpen) navigate('/register')
  }

  return (
    <div className="home-page" onPointerMove={shouldReduceMotion ? undefined : handlePointerMove} onTouchMove={shouldReduceMotion ? undefined : handlePointerMove}>
      {/* GLOWING SPOTLIGHT EFFECT */}
      {!shouldReduceMotion && <motion.div
        className="pointer-events-none fixed inset-0 z-30 transition duration-300 pointer-events-none"
        style={{
          background: pointerGlowBackground,
          willChange: 'background'
        }}
      />}
      
      {/* IoT GLOBAL NODE NETWORK BACKGROUND */}
      {!shouldReduceMotion && init && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, overflow: 'hidden' }}>
           <Particles
              id="tsparticles"
              options={particlesOptions}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
            />
        </div>
      )}

      {/* ===== HERO ===== */}
      <section className="hero">
        <motion.div className="hero-bg" />

        <div className="container">
          <div className="hero-layout-centered">
            <motion.div 
              className="hero-content centered"
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.1 } }
              }}
            >
              <motion.div 
                className="hero-eyebrow motion-fade-up"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <div className="hero-eyebrow-line" />
                <span className="hero-eyebrow-text">CBIT · Hyderabad · Est. 2022</span>
              </motion.div>

              <motion.h1 
                className="hero-title"
                initial={{ filter: 'blur(10px)', opacity: 0, y: 40 }}
                animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                <motion.span 
                  className="hero-title-line1"
                    initial={{ letterSpacing: '0.2em' }}
                    animate={{ letterSpacing: '-0.02em' }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    Build the future
                  </motion.span>
                  <br />
                  <motion.span 
                    className="hero-title-line2 aurora-text"
                    animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                    transition={{ duration: 8, ease: 'linear', repeat: Infinity }}
                    style={{ backgroundSize: '200% auto' }}
                  >
                    with IoT.
                  </motion.span>
                </motion.h1>

                <motion.p 
                  className="hero-subtitle"
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  The premier technology club for students passionate about embedded systems, 
                connected devices, and the Internet of Things. Join 200+ innovators.
              </motion.p>

              <motion.div 
                className="hero-cta centered"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <button className="btn btn-primary btn-magnetic" onClick={goRegister} disabled={!CLUB_CONFIG.registrationsOpen}>
                  {CLUB_CONFIG.registrationsOpen ? 'Start Building Now' : 'Registrations Closed'} <FiArrowRight />
                </button>
                <button className="btn btn-secondary btn-magnetic" onClick={() => navigate('/events')}>
                  Explore Ecosystem
                </button>
              </motion.div>
            </motion.div>

            {/* MASSIVE 3D DASHBOARD (THE COPILOT EFFECT) */}
            <div className="dashboard-3d-wrapper" style={{ perspective: 1800, width: '100%', marginTop: '30px' }}>
              <motion.div 
                className="hero-super-dashboard glass-card"
                initial={{ opacity: 0, y: 100, rotateX: 20 }}
                animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                style={{
                  rotateX: shouldReduceMotion ? 0 : rotateX,
                  rotateY: shouldReduceMotion ? 0 : rotateY,
                  transformStyle: "preserve-3d",
                  boxShadow: shouldReduceMotion
                    ? '0 24px 60px -22px rgba(0, 0, 0, 0.6)'
                    : dynamicBoxShadow
                }}
              >
                {/* Dynamic Glare Overlay */}
                {!shouldReduceMotion && <motion.div 
                  className="pointer-events-none absolute inset-0 z-50 rounded-[24px]"
                  style={{
                    background: glareBackgroundTemplate,
                    mixBlendMode: 'overlay',
                  }}
                />}

                {/* Window Header */}
                <div className="dashboard-header" style={{ transform: "translateZ(10px)" }}>
                  <div className="mac-dots">
                    <span className="dot dot-close"></span>
                    <span className="dot dot-min"></span>
                    <span className="dot dot-max"></span>
                  </div>
                  <span className="dashboard-title">nex-iot / telemetry-nexus</span>
                  <span className="badge badge-cyan pulse-badge">System Online</span>
                </div>

                {/* Dashboard Grid Content */}
                <div className="dashboard-bento" style={{ transformStyle: 'preserve-3d' }}>
                  
                  {/* Left Column: Live Queue & Mode Switcher */}
                  <motion.div className="dashboard-col" style={{ transform: "translateZ(30px)", x: shouldReduceMotion ? 0 : layer1X, y: shouldReduceMotion ? 0 : layer1Y }}>
                    <div className="mission-preview">
                      <div className="mission-preview-head">
                        <span>Build Queue</span>
                        <span style={{ color: 'var(--teal)' }}><FiActivity /> Live</span>
                      </div>
                      {missionRows.map((item, idx) => (
                        <div className="mission-preview-row" style={{ '--row-delay': `${idx * 1.1}s` }} key={item.label}>
                          <span>{item.label}</span>
                          <strong>{item.value}</strong>
                        </div>
                      ))}
                    </div>

                    <div className="mode-controller glass-panel">
                      <div className="mode-switch" role="tablist">
                        {missionModes.map((mode) => (
                          <button
                            key={mode.id}
                            type="button"
                            role="tab"
                            aria-selected={mode.id === selectedMode.id}
                            className={`mode-switch-btn ${mode.id === selectedMode.id ? 'active' : ''}`}
                            onClick={() => setActiveMode(mode.id)}
                          >
                            {mode.id === selectedMode.id && (
                              <motion.div layoutId="activeModeBubble" className="mode-switch-bg" />
                            )}
                            <span className="mode-switch-text">{mode.label}</span>
                          </button>
                        ))}
                      </div>
                      <div className="mode-display-wrapper" style={{ height: '70px', marginTop: '10px' }}>
                        <AnimatePresence mode="wait">
                          <motion.div 
                            className="mode-display" 
                            key={selectedMode.id}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                          >
                            <p>{selectedMode.objective}</p>
                          </motion.div>
                        </AnimatePresence>
                      </div>
                    </div>
                  </motion.div>

                  {/* Center/Right Column: Massive Code/Hardware Visualizer floating way higher */}
                  <motion.div 
                    className="dashboard-visualizer glass-panel code-block"
                    style={{ transform: "translateZ(60px)", x: shouldReduceMotion ? 0 : layer2X, y: shouldReduceMotion ? 0 : layer2Y }}
                  >
                    <div className="code-header">
                      <code>firmware_v0.9.cpp</code>
                      <span style={{color: 'var(--muted)'}}>Deploying...</span>
                    </div>
                    <pre className="code-content">
                      <span className="code-keyword">void</span> <span className="code-func">setup_system</span>() {'{\n'}
                      {'  '}Serial.<span className="code-func">begin</span>(115200);{'\n'}
                      {'  '}<span className="code-keyword">if</span> (!WiFi.<span className="code-func">connect</span>(SSID)) {'{\n'}
                      {'    '}<span className="code-comment">// System halting</span>{'\n'}
                      {'    '}sys.<span className="code-func">panic</span>(<span className="code-string">"NETWORK_FAILURE"</span>);{'\n'}
                      {'  }'}{'\n'}
                      {'  '}Cloud.<span className="code-func">sync</span>();{'\n'}
                      {'}'}
                    </pre>
                    
                    <div className="floating-widget" style={{ transform: "translateZ(30px)" }}>
                      <FiRadio className="widget-icon" />
                      <div>
                        <strong>Telemetry Stream</strong>
                        <span>Receiving 12.4kb/s</span>
                      </div>
                    </div>
                  </motion.div>

                </div>
              </motion.div>
            </div>
            
          </div>
        </div>
      </section>

      <motion.section 
        className="impact-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <div className="container">
          <div className="impact-shell">
            {impactSignals.map((item, idx) => (
              <Tilt key={item.title} tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1000} scale={1.02} transitionSpeed={1500}>
                <motion.article 
                  className="impact-card" 
                  variants={{
                    hidden: { opacity: 0, y: 50, rotateX: 20 },
                    visible: { opacity: 1, y: 0, rotateX: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                >
                  <div className="impact-icon">{item.icon}</div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </motion.article>
              </Tilt>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="trust-section" 
        aria-label="Trusted by campus ecosystem"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-60px' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="container">
          <div className="trust-combo-wrapper">
            <div className="proof-row">
              {proofStats.map((item) => (
                <div className="proof-stat" key={item.label}>
                  <AnimatedNumber value={item.value} />
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
            
            <div className="trust-row">
              <p>Trusted By Core Ecosystem</p>
              <div className="trust-tags">
                {trustedBy.map((name) => (
                  <span className="trust-tag" key={name}>{name}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="platform-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="container">
          <div className="platform-shell glass-card">
            <motion.div 
              className="platform-header"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <span className="badge badge-cyan">Build Platform</span>
              <h2 className="platform-title">Build with a <span>Research-Grade Flow</span></h2>
              <p className="platform-sub">
                Inspired by high-signal API product layouts: clear module cards, fast CTA paths, and crisp surface hierarchy.
              </p>
            </motion.div>

            <div className="platform-grid">
              {platformModules.map((item, idx) => (
                <Tilt key={item.title} tiltMaxAngleX={10} tiltMaxAngleY={10} perspective={1000} transitionSpeed={1500} scale={1.03}>
                  <motion.article 
                    className="platform-card" 
                    variants={{
                      hidden: { opacity: 0, y: 40, rotateY: -15 },
                      visible: { opacity: 1, y: 0, rotateY: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                    }}
                  >
                    <div className="platform-icon">{item.icon}</div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </motion.article>
                </Tilt>
              ))}
            </div>

            <motion.div 
              className="platform-actions"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
            >
              <button className="btn btn-primary btn-magnetic" onClick={() => navigate('/events')}>
                Explore Events <FiArrowRight />
              </button>
              <button className="btn btn-secondary btn-magnetic" onClick={goRegister} disabled={!CLUB_CONFIG.registrationsOpen}>
                {CLUB_CONFIG.registrationsOpen ? 'Start Building' : 'Intake Closed'}
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="blueprint-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
      >
        <div className="container">
          <motion.div 
            className="section-headline"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <span className="badge badge-cyan"><FiCommand /> Build Blueprint</span>
            <h2 className="section-title">From Idea to <span>Working System</span></h2>
            <p className="section-subtitle">A disciplined but creative flow that turns student concepts into field-testable IoT products.</p>
          </motion.div>

          <div className="blueprint-grid">
            {blueprintPhases.map((phase) => (
              <motion.article 
                className="blueprint-card" 
                key={phase.step}
                variants={{
                  hidden: { opacity: 0, x: -30 },
                  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ scale: 1.03, boxShadow: 'inset 0 0 0 1px rgba(42, 240, 224, 0.5), 0 15px 35px -10px rgba(0,0,0,0.6)' }}
              >
                <div className="blueprint-step">{phase.step}</div>
                <h3>{phase.title}</h3>
                <p>{phase.text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== FEATURES ===== */}
      <motion.section 
        className="features-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="container">
          <motion.div
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <p className="section-subtitle animate-fadeInUp" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', letterSpacing: '0.2em', color: 'var(--cyan)', marginBottom: '8px', textTransform: 'uppercase' }}>
              What We Do
            </p>
            <h2 className="section-title">
              Explore the <span>IoT Ecosystem</span>
            </h2>
            <p className="section-subtitle">
              From hardware hacking to cloud deployments — we cover the full stack of connected intelligence.
            </p>
          </motion.div>

          <div className="features-grid">
            {features.map((f, i) => (
              <Tilt key={i} tiltMaxAngleX={8} tiltMaxAngleY={8} perspective={1500} scale={1.03}>
                <motion.div
                  className="feature-card glass-card"
                  variants={{
                    hidden: { opacity: 0, scale: 0.9, y: 50 },
                    visible: { opacity: 1, scale: 1, y: 0, transition: { type: 'spring', damping: 12, stiffness: 100 } }
                  }}
                >
                  <div className="feature-topline" />
                  <div className="feature-icon">{f.icon}</div>
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-desc">{f.desc}</p>
                </motion.div>
              </Tilt>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="pathways-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="container">
          <motion.div 
            className="section-headline"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <span className="badge badge-cyan"><FiMap /> Growth Paths</span>
            <h2 className="section-title">Choose a <span>Track That Fits</span></h2>
            <p className="section-subtitle">Clear pathways reduce guesswork and help members find the right starting point quickly.</p>
          </motion.div>

          <div className="pathways-grid">
            {pathways.map((item) => (
              <motion.article 
                className="pathway-card" 
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ scale: 1.02 }}
              >
                <p className="pathway-subtitle">{item.subtitle}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </motion.article>
            ))}
          </div>

          <motion.div 
            className="resource-shell glass-card"
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
            }}
          >
            <div className="resource-head">
              <span className="badge badge-cyan"><FiBookOpen /> Quick Resources</span>
              <p>Everything important is reachable in one click.</p>
            </div>
            <div className="resource-grid">
              {quickResources.map((item) => (
                <button key={item.title} type="button" className="resource-card" onClick={() => navigate(item.route)}>
                  <h4>{item.title}</h4>
                  <p>{item.text}</p>
                  <span>Open <FiArrowRight /></span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        className="faq-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
        variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      >
        <div className="container">
          <motion.div 
            className="section-headline"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
            }}
          >
            <span className="badge badge-cyan"><FiHelpCircle /> FAQ</span>
            <h2 className="section-title">Answers Before You <span>Apply</span></h2>
          </motion.div>
          <div className="faq-grid">
            {faqs.map((item) => (
              <motion.details 
                className="faq-item" 
                key={item.q}
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
                }}
              >
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </motion.details>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ===== CTA ===== */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-box">
            <span className="badge badge-cyan" style={{ marginBottom: '24px' }}>
              {CLUB_CONFIG.registrationsOpen ? 'Applications Open' : 'Applications Closed'}
            </span>
            <h2>Ready to Build <span style={{ color: 'var(--cyan)' }}>the Future?</span></h2>
            <p>Join hundreds of CBIT students already building smart homes, industrial sensors, and AI-powered edge devices.</p>
            <button className="btn btn-primary" onClick={goRegister} disabled={!CLUB_CONFIG.registrationsOpen}>
              {CLUB_CONFIG.registrationsOpen ? 'Apply Now - It is Free' : 'Registrations Closed'} <FiArrowRight />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
