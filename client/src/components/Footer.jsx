import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

/**
 * Footer – Site-wide footer with navigation, social icons, and copyright.
 */
const Footer = () => {
  const year = new Date().getFullYear()
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon">🎓</div>
              <div className="footer-logo-text">Campus<span>Connect</span></div>
            </div>
            <p className="footer-tagline">
              Empowering university students with a seamless digital campus experience.
              Stay connected, stay informed.
            </p>
            <div className="footer-social">
              {['🐦','💼','📸','⚙️'].map((icon, i) => (
                <a key={i} href="#" className="social-btn" aria-label={`social-${i}`}>{icon}</a>
              ))}
            </div>
          </div>

          {/* Platform */}
          <div className="footer-section">
            <h4>Platform</h4>
            <div className="footer-links">
              <Link to="/">Home</Link>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
              <Link to="/dashboard">Dashboard</Link>
            </div>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <div className="footer-links">
              <a href="#">Academic Calendar</a>
              <a href="#">Course Catalog</a>
              <a href="#">Library</a>
              <a href="#">Student Support</a>
            </div>
          </div>

          {/* University */}
          <div className="footer-section">
            <h4>University</h4>
            <div className="footer-links">
              <a href="#">About Us</a>
              <a href="#">Admissions</a>
              <a href="#">Faculty</a>
              <a href="#">Contact</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {year} CampusConnect. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
