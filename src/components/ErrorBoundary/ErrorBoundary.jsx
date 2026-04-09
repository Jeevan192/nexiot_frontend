import React from 'react'
import { FiAlertTriangle, FiRefreshCw } from 'react-icons/fi'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    console.error('Application error boundary caught:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="fatal-error-wrap">
          <div className="fatal-error-card glass-card" role="alert" aria-live="assertive">
            <div className="fatal-error-icon"><FiAlertTriangle /></div>
            <h2>Something Broke</h2>
            <p>The page hit an unexpected error. Refresh to continue.</p>
            <button className="btn btn-primary" onClick={() => window.location.reload()}>
              <FiRefreshCw /> Reload Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
