import React from 'react'
import { FaTools, FaSyncAlt, FaHome, FaChevronDown, FaChevronUp, FaExclamationTriangle } from 'react-icons/fa'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      showDetails: false 
    }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service if needed
    console.error("ErrorBoundary caught an exception:", error, errorInfo)
    this.setState({ errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, showDetails: false })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  toggleDetails = () => {
    this.setState(prev => ({ showDetails: !prev.showDetails }))
  }

  render() {
    if (this.state.hasError) {
      // Sleek fallback UI
      return (
        <div style={{
          minHeight: this.props.fullPage ? '100vh' : '400px',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          background: this.props.fullPage ? 'radial-gradient(circle at center, #16181D 0%, #0B0C0E 100%)' : 'rgba(11, 12, 14, 0.4)',
          color: '#fff',
          fontFamily: 'var(--font-body, system-ui, sans-serif)',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: this.props.fullPage ? '0' : '24px',
          border: this.props.fullPage ? 'none' : '1px solid rgba(255, 255, 255, 0.05)',
          backdropFilter: this.props.fullPage ? 'none' : 'blur(8px)',
          boxSizing: 'border-box'
        }}>
          {/* Animated Background Highlights */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: '300px',
            height: '300px',
            background: 'rgba(217, 137, 106, 0.08)',
            borderRadius: '50%',
            blur: '100px',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />
          <div style={{
            position: 'absolute',
            bottom: '10%',
            right: '15%',
            width: '250px',
            height: '250px',
            background: 'rgba(201, 168, 76, 0.06)',
            borderRadius: '50%',
            filter: 'blur(80px)',
            pointerEvents: 'none',
            zIndex: 0
          }} />

          {/* Glass Card */}
          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(30, 32, 38, 0.75)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '32px',
            padding: '2.5rem',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.5), 0 1px 2px rgba(255, 255, 255, 0.05) inset',
            backdropFilter: 'blur(16px)',
            textAlign: 'center'
          }}>
            {/* Header Icon */}
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '24px',
              background: 'rgba(217, 137, 106, 0.12)',
              border: '1px solid rgba(217, 137, 106, 0.25)',
              color: 'var(--color-primary, #D9896A)',
              fontSize: '2rem',
              marginBottom: '1.75rem',
              animation: 'pulse 2s infinite ease-in-out'
            }}>
              <FaTools />
            </div>

            <h2 style={{
              fontSize: '1.6rem',
              fontWeight: 800,
              fontFamily: 'var(--font-heading, inherit)',
              letterSpacing: '-0.02em',
              color: '#fff',
              margin: '0 0 0.75rem',
              textTransform: 'uppercase'
            }}>
              System Diagnostics Alert
            </h2>

            <p style={{
              fontSize: '0.92rem',
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.65)',
              margin: '0 0 2rem',
              fontWeight: 400
            }}>
              Our engines encountered an unexpected runtime glitch while loading this section. 
              Don't worry—our diagnostics have captured the event. You can try reloading or heading back home.
            </p>

            {/* CTAs */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              marginBottom: '2rem'
            }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'var(--color-primary, #D9896A)',
                  border: 'none',
                  borderRadius: '12px',
                  color: '#111',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color 0.2s',
                  boxShadow: '0 8px 16px rgba(217, 137, 106, 0.2)'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}
              >
                <FaSyncAlt /> Reload Component
              </button>

              <button
                onClick={() => {
                  this.handleReset()
                  window.location.href = '/'
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.5rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s, background-color 0.2s'
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)' }}
              >
                <FaHome /> Go to Home
              </button>
            </div>

            {/* Diagnostic Details Accordion */}
            {this.state.error && (
              <div style={{
                textAlign: 'left',
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                paddingTop: '1.25rem'
              }}>
                <button
                  onClick={this.toggleDetails}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: 0,
                    width: '100%',
                    justifyContent: 'space-between',
                    outline: 'none'
                  }}
                >
                  <span>Technical Diagnostics</span>
                  {this.state.showDetails ? <FaChevronUp /> : <FaChevronDown />}
                </button>

                {this.state.showDetails && (
                  <div style={{
                    marginTop: '0.75rem',
                    background: 'rgba(11, 12, 14, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    padding: '1rem',
                    maxHeight: '180px',
                    overflowY: 'auto',
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    color: '#D9896A',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-all'
                  }}>
                    <strong style={{ color: '#ff5c5c', display: 'block', marginBottom: '0.25rem' }}>
                      {this.state.error.toString()}
                    </strong>
                    {this.state.errorInfo && this.state.errorInfo.componentStack}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
