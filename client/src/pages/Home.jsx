import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/Button'
import './Home.css'

const FEATURES = [
  { id:'feat-1', icon:'📝', title:'Easy Registration',    desc:'Create your student account in minutes and get instant access to all campus resources.',   color:'rgba(108,99,255,.15)' },
  { id:'feat-2', icon:'📊', title:'Smart Dashboard',      desc:'View courses, grades, attendance, and personalized recommendations in one place.',          color:'rgba(255,101,132,.15)' },
  { id:'feat-3', icon:'📢', title:'Live Announcements',   desc:'Stay updated with real-time university notices, events, and important circulars.',           color:'rgba(67,233,123,.15)' },
  { id:'feat-4', icon:'📚', title:'Course Management',    desc:'Browse, register, and track your enrolled courses effortlessly each semester.',              color:'rgba(56,249,215,.15)' },
  { id:'feat-5', icon:'🎉', title:'Campus Events',        desc:'Discover and participate in cultural fests, hackathons, sports competitions, and more.',      color:'rgba(255,193,7,.15)' },
  { id:'feat-6', icon:'🤝', title:'Student Support',      desc:'Connect with advisors, access counseling, and get academic help whenever you need it.',       color:'rgba(108,99,255,.15)' },
]

const STEPS = [
  { id:'step-1', icon:'📋', title:'Register',   desc:'Create your student account with your university email.' },
  { id:'step-2', icon:'🔑', title:'Log In',     desc:'Securely sign in using your credentials.' },
  { id:'step-3', icon:'🎓', title:'Explore',    desc:'Access courses, events, and campus resources.' },
  { id:'step-4', icon:'🚀', title:'Succeed',    desc:'Stay organised and achieve your academic goals.' },
]

/**
 * Home – Landing page with hero, features, steps, and CTA sections.
 */
const Home = ({ user }) => (
  <>
    {/* ─── Hero ─── */}
    <section className="hero">
      <div className="hero-bg-orbs">
        <div className="orb orb-1"/><div className="orb orb-2"/><div className="orb orb-3"/>
      </div>
      <div className="container hero-content animate-fade-in">
        {/* Text */}
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-dot"/>
            Now Open — Fall 2025 Enrollment
          </div>
          <h1 className="hero-title">
            Your Digital<br/>
            <span className="highlight">Campus Hub</span><br/>
            Awaits You
          </h1>
          <p className="hero-description">
            CampusConnect brings everything you need — courses, announcements,
            events, and resources — into one seamless platform built for modern
            university students.
          </p>
          <div className="hero-cta">
            {user ? (
              <Link to="/dashboard">
                <Button variant="primary" size="lg" icon="📊" id="hero-dashboard-btn">Go to Dashboard</Button>
              </Link>
            ) : (
              <>
                <Link to="/register"><Button variant="primary" size="lg" icon="🚀" id="hero-register-btn">Get Started Free</Button></Link>
                <Link to="/login">  <Button variant="secondary" size="lg"         id="hero-login-btn"   >Sign In</Button></Link>
              </>
            )}
          </div>
          <div className="hero-stats">
            {[['12K+','Students'],['300+','Courses'],['50+','Departments'],['98%','Satisfaction']].map(([n,l])=>(
              <div key={l} className="stat-item">
                <span className="stat-number">{n}</span>
                <span className="stat-label">{l}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mockup Visual */}
        <div className="hero-visual">
          <div className="hero-card-mockup">
            <div className="mockup-header">
              <div className="mockup-avatar">👨‍🎓</div>
              <div>
                <div className="mockup-name">Alex Johnson</div>
                <div className="mockup-role">CS Engineering · Semester 6</div>
              </div>
            </div>
            <div className="mockup-stats">
              {[
                { val:'8.7', lbl:'Current CGPA',     color:'var(--primary)' },
                { val:'92%', lbl:'Attendance',        color:'var(--accent)'  },
                { val:'6',   lbl:'Enrolled Courses',  color:'var(--secondary)' },
                { val:'3',   lbl:'Upcoming Events',   color:'var(--accent-blue)' },
              ].map(s=>(
                <div key={s.lbl} className="mockup-stat">
                  <div className="mockup-stat-val" style={{color:s.color}}>{s.val}</div>
                  <div className="mockup-stat-lbl">{s.lbl}</div>
                </div>
              ))}
            </div>
            <div className="mockup-bar-row">
              {[
                { label:'Data Structures',   w:'85%' },
                { label:'Machine Learning',  w:'72%' },
                { label:'Web Technologies', w:'91%' },
              ].map(b=>(
                <div key={b.label} className="mockup-bar">
                  <div className="mockup-bar-label"><span>{b.label}</span><span>{b.w}</span></div>
                  <div className="mockup-bar-track"><div className="mockup-bar-fill" style={{width:b.w}}/></div>
                </div>
              ))}
            </div>
          </div>
          <div className="floating-badge floating-badge-1">✅ Assignment Submitted</div>
          <div className="floating-badge floating-badge-2">📢 3 New Announcements</div>
        </div>
      </div>
    </section>

    {/* ─── Features ─── */}
    <section className="features">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Everything You Need, <span className="gradient-text">All in One Place</span></h2>
          <p className="section-subtitle" style={{margin:'12px auto 0',textAlign:'center'}}>
            A comprehensive suite of tools designed to make your university experience seamless.
          </p>
        </div>
        <div className="features-grid">
          {FEATURES.map(f=>(
            <div key={f.id} id={f.id} className="feature-card">
              <div className="feature-icon-wrap" style={{background:f.color}}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── How It Works ─── */}
    <section className="how-it-works">
      <div className="container">
        <div className="features-header">
          <h2 className="section-title">Get Started in <span className="gradient-text">4 Simple Steps</span></h2>
          <p className="section-subtitle" style={{margin:'12px auto 0',textAlign:'center'}}>Joining CampusConnect is quick and effortless.</p>
        </div>
        <div className="steps-grid">
          {STEPS.map(s=>(
            <div key={s.id} id={s.id} className="step-item">
              <div className="step-number">{s.icon}</div>
              <h4>{s.title}</h4>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ─── CTA ─── */}
    <section className="home-cta">
      <div className="container">
        <div className="home-cta-inner">
          <h2>Ready to Transform Your <span className="gradient-text">Campus Experience?</span></h2>
          <p>Join thousands of students already using CampusConnect to stay organised, informed, and connected.</p>
          <div className="home-cta-buttons">
            {user ? (
              <Link to="/dashboard"><Button variant="primary" size="lg" icon="📊" id="cta-dashboard-btn">Open Dashboard</Button></Link>
            ) : (
              <>
                <Link to="/register"><Button variant="primary" size="lg" icon="🚀" id="cta-register-btn">Create Free Account</Button></Link>
                <Link to="/login">  <Button variant="ghost"   size="lg"             id="cta-login-btn"   >Already have an account?</Button></Link>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  </>
)

export default Home
