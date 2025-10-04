import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refreshToken')
        if (refreshToken) {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken
          })
          
          const { accessToken, refreshToken: newRefreshToken } = response.data.tokens
          localStorage.setItem('accessToken', accessToken)
          localStorage.setItem('refreshToken', newRefreshToken)
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
          return api(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: async (emailOrUsername, password) => {
    const response = await api.post('/auth/login', { emailOrUsername, password })
    return response.data
  },

  register: async (email, username, password) => {
    const response = await api.post('/auth/register', { email, username, password })
    return response.data
  },

  logout: async (refreshToken) => {
    const response = await api.post('/auth/logout', { refreshToken })
    return response.data
  },

  refreshToken: async (refreshToken) => {
    const response = await api.post('/auth/refresh', { refreshToken })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  }
}

// Expenses API
export const expensesAPI = {
  getExpenses: async (params = {}) => {
    const response = await api.get('/expenses', { params })
    return response.data
  },

  getExpense: async (id) => {
    const response = await api.get(`/expenses/${id}`)
    return response.data
  },

  createExpense: async (expenseData) => {
    const response = await api.post('/expenses', expenseData)
    return response.data
  },

  updateExpense: async (id, expenseData) => {
    const response = await api.put(`/expenses/${id}`, expenseData)
    return response.data
  },

  deleteExpense: async (id) => {
    const response = await api.delete(`/expenses/${id}`)
    return response.data
  }
}

export default api
