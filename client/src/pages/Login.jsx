import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button     from '../components/Button'
import { loginUser } from '../api'
import './Auth.css'

/**
 * Login Page – Controlled login form with full validation,
 * error/success feedback, and loading state.
 * Authenticates against the Express API via Axios.
 */
const Login = ({ onLogin }) => {
  const navigate = useNavigate()

  // ── Form State ──
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  // ── Change Handler ──
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
    if (errors[id]) setErrors(prev => ({ ...prev, [id]: '' }))
    setApiError('')
  }

  // ── Validation ──
  const validate = () => {
    const errs = {}
    if (!formData.email.trim())
      errs.email = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()))
      errs.email = 'Enter a valid email address.'
    if (!formData.password)
      errs.password = 'Password is required.'
    return errs
  }

  // ── Submit Handler — calls POST /api/auth/login via Axios ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')

    try {
      const { data } = await loginUser({
        email:    formData.email.trim(),
        password: formData.password,
      })

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onLogin(data.user, data.token)
          navigate('/dashboard')
        }, 700)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="auth-page">
      {/* BG Orbs */}
      <div className="auth-bg-orbs">
        <div className="auth-orb auth-orb-1" /><div className="auth-orb auth-orb-2" />
      </div>

      <div className="auth-container animate-fade-in">
        {/* ── Info Panel ── */}
        <div className="auth-info">
          <div className="auth-brand">
            <div className="auth-brand-icon">🎓</div>
            <div className="auth-brand-name">Campus<span>Connect</span></div>
          </div>
          <h2 className="auth-headline">Welcome Back to Your Campus Hub</h2>
          <p className="auth-subline">
            Sign in to access your personalised dashboard, view announcements,
            and manage your academic life.
          </p>
          <div className="auth-perks">
            {[
              'Access your personalised dashboard',
              'View real-time announcements',
              'Track courses and assignments',
              'Connect with campus services',
            ].map(p => (
              <div key={p} className="auth-perk">
                <div className="perk-check">✓</div>
                <span>{p}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div className="auth-form-panel">
          <div className="auth-form-header">
            <h1>Sign In</h1>
            <p>New student? <Link to="/register">Create an account</Link></p>
          </div>

          {/* Feedback alerts */}
          {apiError && <div className="alert alert-error" role="alert">❌ {apiError}</div>}
          {success  && <div className="alert alert-success" role="status">✅ Login successful! Redirecting…</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate id="login-form">
            <InputField
              id="email"
              label="Email Address"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              icon="📧"
              error={errors.email}
              required
              autoComplete="email"
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              icon="🔒"
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <div style={{ textAlign: 'right', marginTop: '-12px', marginBottom: '20px' }}>
              <a href="#" style={{ fontSize: '.85rem', color: 'var(--primary)' }}>Forgot password?</a>
            </div>

            <Button type="submit" variant="primary" fullWidth loading={loading} id="login-submit-btn">
              {loading ? 'Signing in…' : 'Sign In'}
            </Button>
          </form>

          <p className="terms-text" style={{ marginTop: '20px' }}>
            By signing in you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Login
