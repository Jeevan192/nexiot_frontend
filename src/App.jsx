import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar/Navbar.jsx'
import Footer from './components/Footer/Footer.jsx'
import Loader from './components/Loader/Loader.jsx'
import Home from './Pages/Home/Home.jsx'
import About from './Pages/About/About.jsx'
import Events from './Pages/Events/Events.jsx'
import Register from './Pages/Register/Register.jsx'
import Success from './Pages/Success/Success.jsx'
import Contact from './Pages/Contact/Contact.jsx'
import Admin from './Pages/Admin/Admin.jsx'
import { getToken } from './services/authService.js'

function ProtectedRoute({ children }) {
  const token = getToken()
  return token ? children : <Navigate to="/admin" replace />
}

export default function App() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(timer)
  }, [])

  if (loading) return <Loader />

  return (
    <>
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
          error: { iconTheme: { primary: '#ff3366', secondary: '#000' } },
        }}
      />
      <Routes>
        <Route path="/admin/*" element={<Admin />} />
        <Route
          path="/*"
          element={
            <>
              <Navbar />
              <main>
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
            </>
          }
        />
      </Routes>
    </>
  )
}