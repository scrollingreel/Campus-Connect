import React, { useState, useEffect } from 'react'
import { getTasks, createTask, updateTask, deleteTask, getUsers } from '../api'
import { generateTaskSummary } from '../utils/dataProcessor'
import Button from '../components/Button'
import './Tasks.css'

const STATUS_LABELS = { pending: '🕐 Pending', 'in-progress': '⚡ In Progress', completed: '✅ Completed' }
const FILTERS       = ['All', 'pending', 'in-progress', 'completed']
const BADGE_MAP     = { pending: 'warning', 'in-progress': 'primary', completed: 'success' }

/**
 * Tasks – Full CRUD task management page.
 * Creates, reads, updates, and deletes tasks via the Express/MongoDB API.
 */
const Tasks = ({ user }) => {
  // ── List state ──
  const [tasks,      setTasks]      = useState([])
  const [users,      setUsers]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [fetchError, setFetchError] = useState('')

  // ── Filter states (TODO 14) ──
  const [filter,       setFilter]       = useState('All')      // Status filter
  const [userFilter,   setUserFilter]   = useState('All')      // Assigned User filter
  const [dateFilter,   setDateFilter]   = useState('All')      // Creation date filter

  // ── Create-form state ──
  const [form,       setForm]       = useState({ title: '', description: '', status: 'pending' })
  const [formError,  setFormError]  = useState('')
  const [creating,   setCreating]   = useState(false)
  const [createMsg,  setCreateMsg]  = useState('')

  // ── Fetch tasks on mount ──
  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = () => {
    setLoading(true)
    getTasks()
      .then(({ data }) => {
        setTasks(data.tasks || [])
        getUsers()
          .then((uRes) => setUsers(uRes.data.users || []))
          .catch((err) => console.error('Failed to load users for filter dropdown', err))
      })
      .catch(() => setFetchError('Could not load tasks. Make sure the server is running.'))
      .finally(() => setLoading(false))
  }

  // ── Filtering logic (TODO 14) ──
  const filtered = tasks.filter(t => {
    // 1. Status Filter
    const matchesStatus = filter === 'All' || t.status === filter

    // 2. Assigned User Filter
    let matchesUser = true
    if (userFilter !== 'All') {
      const assignedId = t.assignedUser?._id || t.assignedUser
      matchesUser = assignedId === userFilter
    }

    // 3. Creation Date Filter
    let matchesDate = true
    if (dateFilter !== 'All') {
      const createdAt = new Date(t.createdAt)
      const now = new Date()
      const diffTime = Math.abs(now - createdAt)
      const diffDays = diffTime / (1000 * 60 * 60 * 24)

      if (dateFilter === 'today') {
        matchesDate = diffDays <= 1
      } else if (dateFilter === 'week') {
        matchesDate = diffDays <= 7
      }
    }

    return matchesStatus && matchesUser && matchesDate
  })

  // ── Task summary using utility (TODO 15) ──
  const counts = generateTaskSummary(tasks)

  // ── Create ──
  const handleCreate = async (e) => {
    e.preventDefault()
    if (!form.title.trim()) { setFormError('Task title is required.'); return }

    setCreating(true)
    setFormError('')
    setCreateMsg('')

    try {
      const { data } = await createTask({
        title:        form.title.trim(),
        description:  form.description.trim(),
        status:       form.status,
        assignedUser: user?.id || null,
      })
      setTasks(prev => [data.task, ...prev])
      setForm({ title: '', description: '', status: 'pending' })
      setCreateMsg('✅ Task created successfully!')
      setTimeout(() => setCreateMsg(''), 3000)
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Failed to create task.')
    } finally {
      setCreating(false)
    }
  }

  // ── Update status inline ──
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const { data } = await updateTask(taskId, { status: newStatus })
      setTasks(prev => prev.map(t => t._id === taskId ? data.task : t))
    } catch {
      alert('Failed to update task status.')
    }
  }

  // ── Delete ──
  const handleDelete = async (taskId) => {
    if (!window.confirm('Delete this task?')) return
    try {
      await deleteTask(taskId)
      setTasks(prev => prev.filter(t => t._id !== taskId))
    } catch {
      alert('Failed to delete task.')
    }
  }

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <section className="tasks-page">
      <div className="container">

        {/* ── Page Header ── */}
        <div className="tasks-header">
          <div>
            <h1>📋 My Tasks</h1>
            <p>Manage your assignments and activities</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchTasks} id="tasks-refresh-btn">
            🔄 Refresh
          </Button>
        </div>

        {/* ── Summary Stats ── */}
        <div className="tasks-stats">
          {[
            { label: 'Total',       value: counts.total,      color: 'var(--primary)',    bg: 'rgba(108,99,255,.15)'  },
            { label: 'Pending',     value: counts.pending,    color: '#f59e0b',           bg: 'rgba(245,158,11,.12)'  },
            { label: 'In Progress', value: counts.inProgress, color: 'var(--accent-blue)',bg: 'rgba(56,189,248,.12)'  },
            { label: 'Completed',   value: counts.completed,  color: 'var(--accent)',     bg: 'rgba(67,233,123,.12)'  },
          ].map((s, i) => (
            <div key={i} className="task-stat-card" style={{ borderTop: `3px solid ${s.color}` }}>
              <div className="task-stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="task-stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="tasks-grid">

          {/* ── Task List (left/main) ── */}
          <div className="task-list-section">
            <h2>🗂️ All Tasks</h2>

            {/* Filter bar */}
            <div className="task-filter-bar" style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {FILTERS.map(f => (
                  <button
                    key={f}
                    className={`task-filter-btn${filter === f ? ' active' : ''}`}
                    onClick={() => setFilter(f)}
                    id={`task-filter-${f}`}
                  >
                    {f === 'All' ? 'All' : STATUS_LABELS[f]}
                  </button>
                ))}
              </div>

              {/* Assigned User Filter (TODO 14) */}
              <div className="filter-select-wrapper" style={{ marginLeft: 'auto', display: 'flex', gap: '10px' }}>
                <select
                  value={userFilter}
                  onChange={e => setUserFilter(e.target.value)}
                  className="status-select"
                  id="task-filter-user"
                  aria-label="Filter by assigned user"
                  style={{ minWidth: '150px' }}
                >
                  <option value="All">👥 All Users</option>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>
                      👤 {u.name}
                    </option>
                  ))}
                </select>

                {/* Creation Date Filter (TODO 14) */}
                <select
                  value={dateFilter}
                  onChange={e => setDateFilter(e.target.value)}
                  className="status-select"
                  id="task-filter-date"
                  aria-label="Filter by creation date"
                  style={{ minWidth: '130px' }}
                >
                  <option value="All">📅 All Time</option>
                  <option value="today">Today</option>
                  <option value="week">Past 7 Days</option>
                </select>
              </div>
            </div>

            {/* Error */}
            {fetchError && <div className="alert alert-error" role="alert">❌ {fetchError}</div>}

            {/* Loading */}
            {loading ? (
              <div className="tasks-loading">
                <div className="spinner spinner-lg" />
                <p>Loading tasks…</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="tasks-empty">
                <div className="empty-icon">📭</div>
                <p>{filter === 'All' ? 'No tasks yet. Create your first task!' : `No ${filter} tasks.`}</p>
              </div>
            ) : (
              <ul className="task-list">
                {filtered.map(task => (
                  <li key={task._id} id={`task-${task._id}`} className="task-card">
                    <div className="task-card-header">
                      <span className={`task-card-title${task.status === 'completed' ? ' completed' : ''}`}>
                        {task.title}
                      </span>
                      <span className={`badge badge-${BADGE_MAP[task.status] || 'primary'}`}>
                        {STATUS_LABELS[task.status]}
                      </span>
                    </div>

                    {task.description && (
                      <p className="task-card-desc">{task.description}</p>
                    )}

                    <div className="task-card-footer">
                      <div className="task-card-meta">
                        📅 {formatDate(task.createdAt)}
                        {task.assignedUser && ` · 👤 ${task.assignedUser.name}`}
                      </div>

                      <div className="task-card-actions">
                        {/* Inline status update */}
                        <select
                          className="status-select"
                          value={task.status}
                          onChange={e => handleStatusChange(task._id, e.target.value)}
                          id={`task-status-${task._id}`}
                          aria-label="Update status"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="completed">Completed</option>
                        </select>

                        <button
                          className="btn-icon danger"
                          onClick={() => handleDelete(task._id)}
                          id={`task-delete-${task._id}`}
                          aria-label="Delete task"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* ── Create Task Form (right/sidebar) ── */}
          <div className="task-form-card" id="create-task-form">
            <h2>➕ New Task</h2>

            {createMsg  && <div className="alert alert-success" role="status">{createMsg}</div>}
            {formError  && <div className="alert alert-error"   role="alert">❌ {formError}</div>}

            <form onSubmit={handleCreate} noValidate>
              <div className="form-group">
                <label htmlFor="task-title">Title *</label>
                <input
                  id="task-title"
                  type="text"
                  placeholder="e.g. Submit assignment report"
                  value={form.title}
                  onChange={e => { setForm(p => ({ ...p, title: e.target.value })); setFormError('') }}
                  maxLength={150}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-description">Description</label>
                <textarea
                  id="task-description"
                  placeholder="Optional details about the task…"
                  value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  rows={3}
                  maxLength={1000}
                />
              </div>

              <div className="form-group">
                <label htmlFor="task-status">Initial Status</label>
                <select
                  id="task-status"
                  value={form.status}
                  onChange={e => setForm(p => ({ ...p, status: e.target.value }))}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <Button
                type="submit"
                variant="primary"
                fullWidth
                loading={creating}
                id="create-task-btn"
              >
                {creating ? 'Creating…' : 'Create Task'}
              </Button>
            </form>
          </div>

        </div>
      </div>
    </section>
  )
}

export default Tasks
