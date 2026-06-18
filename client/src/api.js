import axios from 'axios'

/**
 * Centralised Axios instance — all requests go to the Express server.
 *
 * In development: Vite proxy forwards /api/* to http://localhost:5000
 * In production:  VITE_API_URL env var points to the deployed backend
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── JWT Interceptor — attach token to every request automatically ──────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campusconnect_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// ── Auth ──────────────────────────────────────────────────────────────────────
export const registerUser = (data) => api.post('/auth/register', data)
export const loginUser    = (data) => api.post('/auth/login', data)

// ── Users (CRUD) ──────────────────────────────────────────────────────────────
export const getUsers    = ()           => api.get('/users')
export const getUserById = (id)         => api.get(`/users/${id}`)
export const updateUser  = (id, data)   => api.put(`/users/${id}`, data)
export const deleteUser  = (id)         => api.delete(`/users/${id}`)

// ── Tasks (CRUD) ──────────────────────────────────────────────────────────────
export const getTasks    = (userId)     => api.get('/tasks', { params: userId ? { userId } : {} })
export const getTaskById = (id)         => api.get(`/tasks/${id}`)
export const createTask  = (data)       => api.post('/tasks', data)
export const updateTask  = (id, data)   => api.put(`/tasks/${id}`, data)
export const deleteTask  = (id)         => api.delete(`/tasks/${id}`)

// ── Announcements ─────────────────────────────────────────────────────────────
export const getAnnouncements = () => api.get('/announcements')

export default api
