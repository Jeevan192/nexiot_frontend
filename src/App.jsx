import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Loader from './components/Loader/Loader.jsx'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary.jsx'
import Home from './Pages/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Events from './Pages/Events/Events.jsx'
import Register from './Pages/Register/Register.jsx'
import Success from './Pages/Success/Success.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Admin from './Pages/Admin/Admin.jsx'

export default function App() {
  const [loading, setLoading] = useState(() => sessionStorage.getItem('nextiot_loader_seen') !== '1')

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
        <Route path="/admin/*" element={<Admin />} />
        <Route
          path="/*"
          element={
            <ErrorBoundary>
              <Navbar />
              <main id="main-content" tabIndex="-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/events" element={<Events />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/success" element={<Success />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
              <Footer />
            </ErrorBoundary>
          }
        />
      </Routes>
    </div>
  )
}