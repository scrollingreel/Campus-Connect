import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import InputField from '../components/InputField'
import Button     from '../components/Button'
import { registerUser } from '../api'
import './Auth.css'

/* ── Password strength calculator ── */
const calcStrength = (pw) => {
  if (!pw) return { score: 0, label: '', cls: '' }
  let score = 0
  if (pw.length >= 8)           score++
  if (/[A-Z]/.test(pw))         score++
  if (/[0-9]/.test(pw))         score++
  if (/[^A-Za-z0-9]/.test(pw))  score++
  const map = ['', 'weak', 'fair', 'good', 'strong']
  const lbl = ['', 'Weak',  'Fair', 'Good', 'Strong']
  return { score, label: lbl[score], cls: map[score] }
}

/**
 * Register Page – Full registration form with real-time validation,
 * password strength meter, confirmation match, and API-based
 * user persistence via Axios → Express backend.
 */
const Register = ({ onLogin }) => {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirm: '' })
  const [errors,   setErrors]   = useState({})
  const [apiError, setApiError] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [success,  setSuccess]  = useState(false)

  const strength = calcStrength(formData.password)

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
    const { name, email, password, confirm } = formData

    if (!name.trim())              errs.name     = 'Full name is required.'
    else if (name.trim().length < 2) errs.name   = 'Name must be at least 2 characters.'

    if (!email.trim())             errs.email    = 'Email is required.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
                                   errs.email    = 'Enter a valid email address.'

    if (!password)                 errs.password = 'Password is required.'
    else if (password.length < 8)  errs.password = 'Password must be at least 8 characters.'
    else if (!/[A-Z]/.test(password)) errs.password = 'Include at least one uppercase letter.'
    else if (!/[0-9]/.test(password)) errs.password = 'Include at least one number.'

    if (!confirm)                  errs.confirm  = 'Please confirm your password.'
    else if (confirm !== password) errs.confirm  = 'Passwords do not match.'

    return errs
  }

  // ── Submit Handler — calls POST /api/auth/register via Axios ──
  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    setLoading(true)
    setApiError('')

    try {
      const { data } = await registerUser({
        name:     formData.name.trim(),
        email:    formData.email.trim(),
        password: formData.password,
      })

      if (data.success) {
        setSuccess(true)
        setTimeout(() => {
          onLogin(data.user, data.token)
          navigate('/dashboard')
        }, 800)
      }
    } catch (err) {
      const msg = err?.response?.data?.message || 'Registration failed. Please try again.'
      setApiError(msg)
    } finally {
      setLoading(false)
    }
  }


  return (
    <section className="auth-page">
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
          <h2 className="auth-headline">Join Your University's Digital Community</h2>
          <p className="auth-subline">
            Create your free account and unlock access to everything your campus has to offer.
          </p>
          <div className="auth-perks">
            {[
              'Personalised academic dashboard',
              'Real-time event & announcement feed',
              'Easy course registration & tracking',
              'Secure and private — always',
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
            <h1>Create Account</h1>
            <p>Already registered? <Link to="/login">Sign in here</Link></p>
          </div>

          {apiError && <div className="alert alert-error"   role="alert">❌ {apiError}</div>}
          {success  && <div className="alert alert-success" role="status">🎉 Account created! Redirecting to dashboard…</div>}

          <form className="auth-form" onSubmit={handleSubmit} noValidate id="register-form">
            <InputField
              id="name"
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Alex Johnson"
              icon="👤"
              error={errors.name}
              required
              autoComplete="name"
            />
            <InputField
              id="email"
              label="University Email"
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
              placeholder="Min. 8 chars, 1 uppercase, 1 number"
              icon="🔒"
              error={errors.password}
              required
              autoComplete="new-password"
            />

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="password-strength" id="password-strength-meter">
                <div className="strength-bars">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`strength-bar ${i <= strength.score ? strength.cls : ''}`} />
                  ))}
                </div>
                <span className={`strength-label strength-${strength.cls}`}>{strength.label}</span>
              </div>
            )}

            <InputField
              id="confirm"
              label="Confirm Password"
              type="password"
              value={formData.confirm}
              onChange={handleChange}
              placeholder="Re-enter your password"
              icon="🔑"
              error={errors.confirm}
              hint={formData.confirm && formData.confirm === formData.password ? '✅ Passwords match!' : ''}
              required
              autoComplete="new-password"
            />

            <Button type="submit" variant="primary" fullWidth loading={loading} id="register-submit-btn">
              {loading ? 'Creating Account…' : 'Create Account'}
            </Button>
          </form>

          <p className="terms-text">
            By registering you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </section>
  )
}

export default Register
