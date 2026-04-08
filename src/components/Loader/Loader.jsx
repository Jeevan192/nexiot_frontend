import React from 'react'
import './Loader.css'

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-inner">
        <div className="loader-logo">NEXT<span>-IOT</span></div>
        <div className="loader-ring" />
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
        <p className="loader-text">Initializing Systems...</p>
      </div>
    </div>
  )
}