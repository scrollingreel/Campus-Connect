import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Button  from '../components/Button'
import { getAnnouncements, getTasks, getUsers, updateUser } from '../api'
import { generateTaskSummary } from '../utils/dataProcessor'
import './Dashboard.css'

const STAT_CARDS = [
  { id:'stat-cgpa',       icon:'📈', label:'Current CGPA',      value:'8.7',  color:'rgba(108,99,255,.2)',   textColor:'var(--primary)'    },
  { id:'stat-attendance', icon:'✅', label:'Attendance',         value:'92%',  color:'rgba(67,233,123,.15)',  textColor:'var(--accent)'     },
  { id:'stat-courses',    icon:'📚', label:'Enrolled Courses',   value:'6',    color:'rgba(255,101,132,.15)', textColor:'var(--secondary)'  },
  { id:'stat-events',     icon:'🎉', label:'Upcoming Events',    value:'3',    color:'rgba(56,249,215,.15)',  textColor:'var(--accent-blue)'},
]

const SCHEDULE = [
  { time:'09:00', subject:'Data Structures',    room:'Lab 3-B' },
  { time:'11:00', subject:'Machine Learning',   room:'Hall 6'  },
  { time:'14:00', subject:'Web Technologies',   room:'Lab 2-A' },
  { time:'16:00', subject:'Database Systems',   room:'Room 12' },
]

const QUICK_LINKS = [
  { icon:'📋', label:'Course Registration',   href:'#' },
  { icon:'📝', label:'Assignment Submission',  href:'#' },
  { icon:'📊', label:'Academic Calendar',      href:'#' },
  { icon:'📖', label:'E-Library',             href:'#' },
  { icon:'🎫', label:'Event Registration',     href:'#' },
  { icon:'💬', label:'Contact Advisor',        href:'#' },
]

const PRIORITY_BADGE = { high:'danger', medium:'warning', low:'success' }

/**
 * Dashboard – Protected page shown after login.
 * Fetches announcements, tasks, and all registered users from the Express/MongoDB API.
 * Supports inline profile editing (name/email/password).
 */
const Dashboard = ({ user, onLogin }) => {
  const [announcements, setAnnouncements] = useState([])
  const [tasks,         setTasks]         = useState([])
  const [students,      setStudents]      = useState([])
  const [loading,       setLoading]       = useState(true)
  const [fetchError,    setFetchError]    = useState('')
  const [filter,        setFilter]        = useState('All')
  const [studentSearch, setStudentSearch] = useState('')

  // ── Profile edit state ──
  const [editMode,    setEditMode]    = useState(false)
  const [editForm,    setEditForm]    = useState({ name: '', email: '', password: '' })
  const [editLoading, setEditLoading] = useState(false)
  const [editMsg,     setEditMsg]     = useState({ text: '', type: '' })

  // ── Fetch all data in parallel on mount ──
  useEffect(() => {
    Promise.all([
      getAnnouncements(),
      getTasks(),
      getUsers(),
    ])
      .then(([annRes, taskRes, userRes]) => {
        setAnnouncements(annRes.data.announcements || [])
        setTasks(taskRes.data.tasks || [])
        setStudents(userRes.data.users || [])
      })
      .catch(() => setFetchError('Could not load data. Make sure the server is running.'))
      .finally(() => setLoading(false))
  }, [])

  // ── Filter Logic ──
  const categories = ['All', ...new Set(announcements.map(a => a.category))]
  const filtered   = filter === 'All' ? announcements : announcements.filter(a => a.category === filter)

  // ── Student Search Logic (TODO 13) ──
  const filteredStudents = students.filter(s =>
    s.name?.toLowerCase().includes(studentSearch.toLowerCase()) ||
    s.email?.toLowerCase().includes(studentSearch.toLowerCase())
  )

  // ── Task summary using utility (TODO 15) ──
  const { pending: pendingTasks, inProgress: inProgressTasks, completed: completedTasks } = generateTaskSummary(tasks)

  // ── Open profile edit ──
  const openEdit = () => {
    setEditForm({ name: user?.name || '', email: user?.email || '', password: '' })
    setEditMsg({ text: '', type: '' })
    setEditMode(true)
  }

  // ── Save profile update → PUT /api/users/:id ──
  const handleProfileSave = async (e) => {
    e.preventDefault()
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setEditMsg({ text: 'Name and email are required.', type: 'error' })
      return
    }
    setEditLoading(true)
    setEditMsg({ text: '', type: '' })
    try {
      const payload = { name: editForm.name.trim(), email: editForm.email.trim() }
      if (editForm.password) payload.password = editForm.password

      const { data } = await updateUser(user.id, payload)
      if (data.success) {
        // Update stored user info and token
        onLogin({ ...user, name: data.user.name, email: data.user.email })
        setEditMsg({ text: '✅ Profile updated successfully!', type: 'success' })
        setTimeout(() => setEditMode(false), 1200)
      }
    } catch (err) {
      setEditMsg({ text: err?.response?.data?.message || 'Update failed.', type: 'error' })
    } finally {
      setEditLoading(false)
    }
  }

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' }) : '—'

  return (
    <section className="dashboard">
      <div className="container">

        {/* ─── Welcome Banner ─── */}
        <div className="dash-welcome">
          <div className="dash-welcome-text">
            <h1>{greeting()}, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
            <p>Here's what's happening on campus today.</p>
          </div>
          <div className="dash-welcome-actions">
            <Link to="/tasks">
              <Button variant="primary" size="sm" icon="📝" id="dash-manage-tasks">Manage Tasks</Button>
            </Link>
            <Button variant="ghost" size="sm" icon="📊" id="dash-view-grades">View Grades</Button>
          </div>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="dash-stats">
          {STAT_CARDS.map(s => (
            <div key={s.id} id={s.id} className="stat-card">
              <div className="stat-card-icon" style={{ background: s.color }}>{s.icon}</div>
              <div className="stat-card-info">
                <div className="stat-card-value" style={{ color: s.textColor }}>{s.value}</div>
                <div className="stat-card-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {fetchError && <div className="alert alert-error" role="alert" style={{ marginBottom:'1rem' }}>⚠️ {fetchError}</div>}

        {/* ─── Main Grid ─── */}
        <div className="dash-grid">

          {/* ── Left Column: Announcements + Registered Students ── */}
          <div>

            {/* Announcements */}
            <div className="dash-section-header">
              <h2>📢 Announcements</h2>
              <div className="filter-tabs">
                {categories.map(cat => (
                  <button
                    key={cat}
                    className={`filter-tab${filter === cat ? ' active' : ''}`}
                    onClick={() => setFilter(cat)}
                    id={`filter-${cat.toLowerCase().replace(/\s+/g,'-')}`}
                  >{cat}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div className="dash-loading"><div className="spinner spinner-lg" /><p>Loading…</p></div>
            ) : filtered.length === 0 ? (
              <div className="alert alert-warning">No announcements for this category.</div>
            ) : (
              <ul className="announcement-list">
                {filtered.map(ann => (
                  <li key={ann.id} id={`announcement-${ann.id}`} className="announcement-card">
                    <div className="ann-header">
                      <span className="ann-title">{ann.title}</span>
                      <span className={`badge badge-${PRIORITY_BADGE[ann.priority] || 'primary'}`}>{ann.priority}</span>
                    </div>
                    <p className="ann-body">{ann.content}</p>
                    <div className="ann-footer">
                      <div className="ann-meta">
                        <span>{ann.category}</span><span className="ann-dot" /><span>📅 {ann.date}</span>
                      </div>
                      <Button variant="ghost" size="sm" id={`ann-read-${ann.id}`}>Read More</Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* ── Registered Students (TODO 13) ── */}
            <div style={{ marginTop:'2rem' }}>
              <div className="dash-section-header" style={{ marginBottom:'1rem' }}>
                <h2>👥 Registered Students</h2>
                <span className="badge badge-primary" id="students-count">
                  {studentSearch ? `${filteredStudents.length} found` : `${students.length} total`}
                </span>
              </div>

              {/* Student Search Bar (TODO 13) */}
              <div style={{ marginBottom: '1.2rem' }}>
                <input
                  id="student-search"
                  type="text"
                  placeholder="🔍 Search students by name or email..."
                  value={studentSearch}
                  onChange={e => setStudentSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    border: '1.5px solid var(--border)',
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    fontSize: '0.9rem',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s'
                  }}
                />
              </div>

              {loading ? (
                <div className="dash-loading"><div className="spinner" /></div>
              ) : filteredStudents.length === 0 ? (
                <div className="alert alert-warning" id="no-students-message">
                  {studentSearch ? 'No matching students found.' : 'No registered students yet.'}
                </div>
              ) : (
                <div id="students-list" style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
                  {filteredStudents.map((s, i) => (
                    <div
                      key={s._id}
                      id={`student-${s._id}`}
                      className="sidebar-card"
                      style={{ display:'flex', alignItems:'center', gap:'14px', padding:'12px 16px' }}
                    >
                      <div style={{ width:'38px', height:'38px', borderRadius:'50%', background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:700, color:'#fff', fontSize:'1rem', flexShrink:0 }}>
                        {s.name?.charAt(0).toUpperCase()}
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ fontWeight:700, fontSize:'.92rem' }}>{s.name}</div>
                        <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>{s.email}</div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:'.72rem', color:'var(--text-muted)' }}>Joined</div>
                        <div style={{ fontSize:'.78rem', color:'var(--text-secondary)' }}>{formatDate(s.registrationDate)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* ── Sidebar ── */}
          <div className="dash-sidebar">

            {/* Task Summary */}
            <div className="sidebar-card" id="task-summary">
              <h3>📋 My Tasks</h3>
              {loading ? (
                <div style={{ textAlign:'center', padding:'1rem' }}><div className="spinner" /></div>
              ) : (
                <>
                  <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'14px' }}>
                    {[
                      { label:'Pending',     count: pendingTasks,    badge:'warning' },
                      { label:'In Progress', count: inProgressTasks, badge:'primary' },
                      { label:'Completed',   count: completedTasks,  badge:'success' },
                    ].map(s => (
                      <div key={s.label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'.88rem' }}>
                        <span style={{ color:'var(--text-secondary)' }}>{s.label}</span>
                        <span className={`badge badge-${s.badge}`}>{s.count}</span>
                      </div>
                    ))}
                  </div>
                  <Link to="/tasks">
                    <Button variant="primary" size="sm" fullWidth id="dash-go-tasks">View All Tasks →</Button>
                  </Link>
                </>
              )}
            </div>

            {/* Today's Schedule */}
            <div className="sidebar-card" id="today-schedule">
              <h3>🗓️ Today's Schedule</h3>
              <ul className="schedule-list">
                {SCHEDULE.map((s, i) => (
                  <li key={i} className="schedule-item">
                    <span className="schedule-time">{s.time}</span>
                    <span className="schedule-dot" />
                    <div className="schedule-info">
                      <div className="schedule-subject">{s.subject}</div>
                      <div className="schedule-room">{s.room}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="sidebar-card" id="quick-links">
              <h3>⚡ Quick Links</h3>
              <nav className="quick-links" aria-label="Quick navigation links">
                {QUICK_LINKS.map((l, i) => (
                  <a key={i} href={l.href} className="quick-link-item" id={`quick-link-${i}`}>
                    <span>{l.icon}</span><span>{l.label}</span>
                    <span style={{ marginLeft:'auto', color:'var(--text-muted)' }}>›</span>
                  </a>
                ))}
              </nav>
            </div>

            {/* Profile Card with Edit (TODO 16) */}
            <div className="sidebar-card" id="profile-card">
              <h3>👤 My Profile</h3>

              {!editMode ? (
                /* ── View Mode ── */
                <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'14px' }}>
                    <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:'var(--grad-primary)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:700, color:'#fff', flexShrink:0 }}>
                      {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:700 }}>{user?.name}</div>
                      <div style={{ fontSize:'.82rem', color:'var(--text-secondary)' }}>{user?.email}</div>
                      {user?.registrationDate && (
                        <div style={{ fontSize:'.75rem', color:'var(--text-muted)', marginTop:'2px' }}>
                          Joined {formatDate(user.registrationDate)}
                        </div>
                      )}
                    </div>
                  </div>
                  <hr className="divider" style={{ margin:'4px 0' }} />
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'.85rem', color:'var(--text-secondary)' }}>Account Status</span>
                    <span className="badge badge-success">Active</span>
                  </div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <span style={{ fontSize:'.85rem', color:'var(--text-secondary)' }}>Tasks Completed</span>
                    <span className="badge badge-primary">{completedTasks}</span>
                  </div>
                  <Button variant="primary" size="sm" fullWidth onClick={openEdit} id="profile-edit-btn">
                    ✏️ Edit Profile
                  </Button>
                </div>
              ) : (
                /* ── Edit Mode (TODO 16) ── */
                <form onSubmit={handleProfileSave} noValidate id="profile-edit-form">
                  {editMsg.text && (
                    <div className={`alert alert-${editMsg.type === 'success' ? 'success' : 'error'}`} style={{ marginBottom:'12px' }}>
                      {editMsg.text}
                    </div>
                  )}

                  <div style={{ display:'flex', flexDirection:'column', gap:'10px', marginBottom:'14px' }}>
                    <div>
                      <label style={{ fontSize:'.8rem', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'4px' }}>Full Name</label>
                      <input
                        id="edit-name"
                        type="text"
                        value={editForm.name}
                        onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
                        style={{ width:'100%', background:'var(--bg-secondary)', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'8px 10px', color:'var(--text-primary)', fontSize:'.88rem', outline:'none', boxSizing:'border-box' }}
                        placeholder="Your full name"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize:'.8rem', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'4px' }}>Email</label>
                      <input
                        id="edit-email"
                        type="email"
                        value={editForm.email}
                        onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))}
                        style={{ width:'100%', background:'var(--bg-secondary)', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'8px 10px', color:'var(--text-primary)', fontSize:'.88rem', outline:'none', boxSizing:'border-box' }}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label style={{ fontSize:'.8rem', fontWeight:600, color:'var(--text-secondary)', display:'block', marginBottom:'4px' }}>New Password <span style={{ fontWeight:400 }}>(leave blank to keep current)</span></label>
                      <input
                        id="edit-password"
                        type="password"
                        value={editForm.password}
                        onChange={e => setEditForm(p => ({ ...p, password: e.target.value }))}
                        style={{ width:'100%', background:'var(--bg-secondary)', border:'1.5px solid var(--border)', borderRadius:'8px', padding:'8px 10px', color:'var(--text-primary)', fontSize:'.88rem', outline:'none', boxSizing:'border-box' }}
                        placeholder="Min. 8 characters"
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div style={{ display:'flex', gap:'8px' }}>
                    <Button type="submit" variant="primary" size="sm" fullWidth loading={editLoading} id="profile-save-btn">
                      {editLoading ? 'Saving…' : 'Save Changes'}
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setEditMode(false)} id="profile-cancel-btn">
                      Cancel
                    </Button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Dashboard
