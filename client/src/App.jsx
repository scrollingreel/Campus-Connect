import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import Layout  from './components/Layout'
import Navbar  from './components/Navbar'
import Footer  from './components/Footer'
import Home      from './pages/Home'
import Login     from './pages/Login'
import Register  from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tasks     from './pages/Tasks'

const AppRoutes = () => {
  const { user, login, logout } = useAuth()

  const withLayout = (Page, extraProps = {}) => (
    <Layout
      navbar={<Navbar user={user} onLogout={logout} />}
      footer={<Footer />}
    >
      <Page user={user} onLogin={login} {...extraProps} />
    </Layout>
  )

  return (
    <Routes>
      <Route path="/"         element={withLayout(Home)} />
      <Route path="/login"    element={user ? <Navigate to="/dashboard" replace /> : withLayout(Login, { onLogin: login })} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : withLayout(Register, { onLogin: login })} />
      <Route path="/dashboard" element={user ? withLayout(Dashboard) : <Navigate to="/login" replace />} />
      <Route path="/tasks"     element={user ? withLayout(Tasks)     : <Navigate to="/login" replace />} />
      <Route path="*"          element={<Navigate to="/" replace />} />
    </Routes>
  )
}

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </AuthProvider>
)

export default App
