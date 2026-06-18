import React, { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import './Navbar.css'

/**
 * Navbar – Sticky navigation bar.
 * Shows auth-aware links and a responsive mobile hamburger menu.
 */
const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()
  const [scrolled,    setScrolled]    = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMobile = () => setMobileOpen(false)

  const handleLogout = () => {
    onLogout()
    closeMobile()
    navigate('/')
  }

  const avatarLetter = user?.name ? user.name.charAt(0).toUpperCase() : 'U'

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container navbar-inner">

        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={closeMobile} id="brand-logo">
          <div className="brand-icon">🎓</div>
          <div className="brand-name">Campus<span>Connect</span></div>
        </Link>

        {/* Desktop Links */}
        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
              🏠 Home
            </NavLink>
          </li>
          {user && (
            <>
              <li>
                <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  📊 Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/tasks" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
                  📋 Tasks
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Desktop Actions */}
        <div className="navbar-actions hide-mobile">
          {user ? (
            <div className="user-menu">
              <div className="user-avatar" title={user.name}>{avatarLetter}</div>
              <span className="user-name">{user.name.split(' ')[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout} id="nav-logout-btn">
                Logout
              </button>
            </div>
          ) : (
            <>
              <Link to="/login"    className="btn btn-ghost btn-sm"   id="nav-login-btn">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="nav-register-btn">Get Started</Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className={`navbar-toggle ${mobileOpen ? 'open' : ''}`}
          onClick={() => setMobileOpen(v => !v)}
          aria-label="Toggle navigation"
          id="mobile-menu-toggle"
        >
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMobile}>
            🏠 Home
          </NavLink>
          {user && (
            <>
              <NavLink to="/dashboard" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMobile}>
                📊 Dashboard
              </NavLink>
              <NavLink to="/tasks" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`} onClick={closeMobile}>
                📋 Tasks
              </NavLink>
            </>
          )}
          <div className="navbar-actions">
            {user ? (
              <button className="btn btn-danger" onClick={handleLogout} id="mobile-logout-btn">
                Logout ({user.name})
              </button>
            ) : (
              <>
                <Link to="/login"    className="btn btn-ghost"   onClick={closeMobile} id="mobile-login-btn">Login</Link>
                <Link to="/register" className="btn btn-primary" onClick={closeMobile} id="mobile-register-btn">Get Started</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
