import React, { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('campusconnect_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })

  const login = (userData, token) => {
    setUser(userData)
    localStorage.setItem('campusconnect_user', JSON.stringify(userData))
    if (token) localStorage.setItem('campusconnect_token', token)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('campusconnect_user')
    localStorage.removeItem('campusconnect_token')
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export default AuthContext
