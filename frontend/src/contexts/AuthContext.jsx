import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('accessToken')
      const refreshToken = localStorage.getItem('refreshToken')

      if (token && refreshToken) {
        try {
          // Try to get current user with existing token
          const userData = await authAPI.getCurrentUser()
          setUser(userData.user)
        } catch (error) {
          // If access token is expired, try to refresh
          try {
            const response = await authAPI.refreshToken(refreshToken)
            localStorage.setItem('accessToken', response.tokens.accessToken)
            localStorage.setItem('refreshToken', response.tokens.refreshToken)
            setUser(response.user)
          } catch (refreshError) {
            // Refresh failed, clear tokens
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
          }
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (emailOrUsername, password) => {
    try {
      const response = await authAPI.login(emailOrUsername, password)
      localStorage.setItem('accessToken', response.tokens.accessToken)
      localStorage.setItem('refreshToken', response.tokens.refreshToken)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Login failed' 
      }
    }
  }

  const register = async (email, username, password) => {
    try {
      const response = await authAPI.register(email, username, password)
      localStorage.setItem('accessToken', response.tokens.accessToken)
      localStorage.setItem('refreshToken', response.tokens.refreshToken)
      setUser(response.user)
      return { success: true }
    } catch (error) {
      return { 
        success: false, 
        error: error.response?.data?.error || 'Registration failed' 
      }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await authAPI.logout(refreshToken)
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
