import React from 'react'
import './Loader.css'

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader-inner">
        <div className="loader-logo">NEX<span>-IOT</span></div>
        <div className="pinwheel-loader" aria-hidden="true">
          {[...Array(12)].map((_, i) => <span key={i} />)}
          <i className="pinwheel-hub" />
        </div>
        <div className="loader-bar">
          <div className="loader-bar-fill" />
        </div>
        <div className="loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className="loader-text">Calibrating Nexus Grid...</p>
      </div>
    </div>
  )
}