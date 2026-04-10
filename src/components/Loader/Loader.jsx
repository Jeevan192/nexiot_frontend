import React, { useEffect, useState } from 'react'
import './Loader.css'

export default function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress 0 to 100 over ~1.3s
    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 15) + 5;
      if (current >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hq-loader-wrapper">
      <div className="hq-loader-bg">
        <div className="hq-loader-grid" />
      </div>
      
      <div className="hq-loader-container">
        {/* Core Rotating Rings */}
        <div className="core-scanner">
          <div className="ring ring-outer"></div>
          <div className="ring ring-middle"></div>
          <div className="ring ring-inner"></div>
          <div className="core-glow"></div>
        </div>

        {/* Data Stream Typography */}
        <div className="hq-data-module">
          <div className="hq-title">
            <span>NEX</span>
            <span className="text-highlight">-IOT</span>
          </div>
          <div className="hq-status">
            <span className="blinking-dot"></span>
            INITIALIZING SECURE CONNECTION
          </div>
          
          {/* Hex Progress Bar & Percentage */}
          <div className="hq-progress-container">
            <div className="progress-track">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              >
                <div className="progress-glow"></div>
              </div>
            </div>
            <div className="progress-percentage">
              {progress}%
            </div>
          </div>
        </div>
        
        {/* Scanning horizontal line effect */}
        <div className="hq-scanline"></div>
      </div>
    </div>
  )
}