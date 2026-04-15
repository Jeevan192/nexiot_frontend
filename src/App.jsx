import React, { useState, useEffect, lazy, Suspense, useRef } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Loader from './components/Loader/Loader.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'
import { getConfig } from './services/eventService.js'
import { CLUB_CONFIG } from './config/clubConfig.js'

const LAZY_RELOAD_KEY = 'nextiot_lazy_chunk_reload_attempted'

function lazyWithReload(importer) {
  return lazy(async () => {
    try {
      return await importer()
    } catch (error) {
      const message = String(error?.message || error || '')
      const isChunkLoadFailure = /ChunkLoadError|Loading chunk|Failed to fetch dynamically imported module/i.test(message)

      if (isChunkLoadFailure) {
        const retried = sessionStorage.getItem(LAZY_RELOAD_KEY) === '1'
        if (!retried) {
          sessionStorage.setItem(LAZY_RELOAD_KEY, '1')
          const nextUrl = new URL(window.location.href)
          nextUrl.searchParams.set('_r', Date.now().toString())
          window.location.replace(nextUrl.toString())
          return new Promise(() => {})
        }
      }

      throw error
    }
  })
}

const Home = lazyWithReload(() => import('./Pages/Home/Home.jsx'))
const About = lazyWithReload(() => import('./Pages/About/About.jsx'))
const Events = lazyWithReload(() => import('./Pages/Events/Events.jsx'))
const Register = lazyWithReload(() => import('./Pages/Register/Register.jsx'))
const Success = lazyWithReload(() => import('./Pages/Success/Success.jsx'))
const Contact = lazyWithReload(() => import('./Pages/Contact/Contact.jsx'))
const Admin = lazyWithReload(() => import('./Pages/Admin/Admin.jsx'))

const preloadPages = [
  () => import('./Pages/Home/Home.jsx'),
  () => import('./Pages/About/About.jsx'),
  () => import('./Pages/Events/Events.jsx'),
  () => import('./Pages/Register/Register.jsx'),
  () => import('./Pages/Success/Success.jsx'),
  () => import('./Pages/Contact/Contact.jsx'),
  () => import('./Pages/Admin/Admin.jsx'),
]

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    try {
      window.scrollTo({ top: 0, left: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
    } catch {
      // Fallback for older mobile browsers that only accept numeric params.
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}

export default function App() {
  const { pathname } = useLocation()
  const [loading, setLoading] = useState(() => sessionStorage.getItem('nextiot_loader_seen') !== '1')
  const [routeTransitioning, setRouteTransitioning] = useState(false)
  const [, setConfigVersion] = useState(0)
  const previousPathRef = useRef(pathname)

  const routeFallback = <div className="route-fallback">Loading...</div>

  useEffect(() => {
    sessionStorage.removeItem(LAZY_RELOAD_KEY)

    const url = new URL(window.location.href)
    if (url.searchParams.has('_r')) {
      url.searchParams.delete('_r')
      window.history.replaceState({}, '', `${url.pathname}${url.search}${url.hash}`)
    }
  }, [])

  useEffect(() => {
    if (previousPathRef.current === pathname) return

    previousPathRef.current = pathname
    const startTimer = setTimeout(() => setRouteTransitioning(true), 0)
    const transitionTimer = setTimeout(() => setRouteTransitioning(false), 170)

    return () => {
      clearTimeout(startTimer)
      clearTimeout(transitionTimer)
    }
  }, [pathname])

  useEffect(() => {
    let cancelled = false
    let warmed = false

    const warmup = () => {
      if (cancelled || warmed) return
      warmed = true
      preloadPages.forEach((loadPage) => {
        loadPage().catch(() => {
          // Ignore prefetch failures and load on-demand.
        })
      })
    }

    let idleId
    const timeoutId = setTimeout(() => {
      if ('requestIdleCallback' in window) {
        idleId = window.requestIdleCallback(warmup, { timeout: 1600 })
      } else {
        warmup()
      }
    }, 150)

    const handleFirstIntent = () => warmup()
    window.addEventListener('pointerdown', handleFirstIntent, { once: true, passive: true })
    window.addEventListener('keydown', handleFirstIntent, { once: true })

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      window.removeEventListener('pointerdown', handleFirstIntent)
      window.removeEventListener('keydown', handleFirstIntent)
      if (idleId && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(idleId)
      }
    }
  }, [])

  useEffect(() => {
    const applyConfig = (registrationsOpen) => {
      CLUB_CONFIG.registrationsOpen = Boolean(registrationsOpen)
      CLUB_CONFIG.registrationNotice = CLUB_CONFIG.registrationsOpen
        ? 'Registrations are currently open. Join now and secure your seat.'
        : 'Registrations are currently closed. Please check back for the next intake window.'
      setConfigVersion((v) => v + 1)
    }

    const syncConfig = async () => {
      try {
        const res = await getConfig()
        applyConfig(res?.data?.registrationsOpen)
      } catch {
        // Keep last known config if API is temporarily unavailable.
      }
    }

    const isMobile = window.matchMedia('(max-width: 768px), (pointer: coarse)').matches
    const pollMs = isMobile ? 120000 : 45000

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') syncConfig()
    }

    syncConfig()
    const interval = setInterval(syncConfig, pollMs)
    window.addEventListener('focus', syncConfig)
    window.addEventListener('online', syncConfig)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', syncConfig)
      window.removeEventListener('online', syncConfig)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [])

  useEffect(() => {
    if (!loading) return

    const timer = setTimeout(() => {
      setLoading(false)
      sessionStorage.setItem('nextiot_loader_seen', '1')
    }, 1600)

    return () => clearTimeout(timer)
  }, [loading])

  if (loading) return <Loader />

  return (
    <div className="app-shell">
      <div className={`route-transition-overlay${routeTransitioning ? ' active' : ''}`} aria-hidden="true" />
      <ScrollToTop />
      <div className="global-bg">
        <div className="global-bg-grid" />
        <div className="global-bg-scan" />
        <div className="global-bg-particles" />
      </div>

      <a className="skip-link" href="#main-content">Skip to content</a>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'rgba(10,10,20,0.95)',
            color: '#00f5ff',
            border: '1px solid rgba(0,245,255,0.3)',
            fontFamily: 'Rajdhani, sans-serif',
            fontSize: '14px',
            letterSpacing: '0.05em',
          },
          success: { iconTheme: { primary: '#00f5ff', secondary: '#000' } },
          error: { iconTheme: { primary: '#66bfff', secondary: '#000' } },
        }}
      />
      <Routes>
        <Route path="/admin/*" element={<Suspense fallback={routeFallback}><Admin /></Suspense>} />
        <Route
          path="/*"
          element={
            <ErrorBoundary>
              <Navbar />
              <main id="main-content" tabIndex="-1" className="route-shell">
                <div key={pathname} className="route-page">
                  <Routes>
                    <Route path="/" element={<Suspense fallback={routeFallback}><Home /></Suspense>} />
                    <Route path="/about" element={<Suspense fallback={routeFallback}><About /></Suspense>} />
                    <Route path="/events" element={<Suspense fallback={routeFallback}><Events /></Suspense>} />
                    <Route path="/register" element={<Suspense fallback={routeFallback}><Register /></Suspense>} />
                    <Route path="/success" element={<Suspense fallback={routeFallback}><Success /></Suspense>} />
                    <Route path="/contact" element={<Suspense fallback={routeFallback}><Contact /></Suspense>} />
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
              </main>
              <Footer />
            </ErrorBoundary>
          }
        />
      </Routes>
    </div>
  )
}