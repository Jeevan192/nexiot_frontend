import React from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application error boundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fatal-error-wrap" style={{ padding: '20px', color: '#fff', background: '#222' }}>
          <div className="fatal-error-card glass-card" role="alert" aria-live="assertive">
            <div className="fatal-error-icon"><FiAlertTriangle /></div>
            <h2>Something Broke</h2>
            <p>The page hit an unexpected error. Refresh to continue.</p>
            <div style={{ background: '#000', color: '#ff3333', padding: '10px', marginTop: '10px', fontSize: '12px', wordBreak: 'break-all', textAlign: 'left', maxHeight: '200px', overflowY: 'auto' }}>
              {this.state.error?.toString()}
            </div>
            <button className="btn btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '20px' }}>
              <FiRefreshCw /> Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
