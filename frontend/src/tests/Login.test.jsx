import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../contexts/AuthContext'
import Login from '../pages/Login'

// Mock the auth API
jest.mock('../services/api', () => ({
  authAPI: {
    login: jest.fn()
  }
}))

const MockedLogin = () => (
  <BrowserRouter>
    <AuthProvider>
      <Login />
    </AuthProvider>
  </BrowserRouter>
)

describe('Login Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<MockedLogin />)
    
    expect(screen.getByText('Welcome Back')).toBeInTheDocument()
    expect(screen.getByLabelText(/email or username/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<MockedLogin />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email or username is required')).toBeInTheDocument()
      expect(screen.getByText('Password is required')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    const { authAPI } = require('../services/api')
    authAPI.login.mockResolvedValueOnce({
      user: { id: '1', email: 'test@example.com', username: 'testuser' },
      tokens: { accessToken: 'token', refreshToken: 'refresh' }
    })

    render(<MockedLogin />)
    
    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(authAPI.login).toHaveBeenCalledWith('test@example.com', 'password123')
    })
  })

  it('displays error message on login failure', async () => {
    const { authAPI } = require('../services/api')
    authAPI.login.mockRejectedValueOnce({
      response: { data: { error: 'Invalid credentials' } }
    })

    render(<MockedLogin />)
    
    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'test@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrongpassword' }
    })
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument()
    })
  })

  it('clears field errors when user starts typing', async () => {
    render(<MockedLogin />)
    
    // Trigger validation errors
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    
    await waitFor(() => {
      expect(screen.getByText('Email or username is required')).toBeInTheDocument()
    })

    // Start typing in email field
    fireEvent.change(screen.getByLabelText(/email or username/i), {
      target: { value: 'test' }
    })

    await waitFor(() => {
      expect(screen.queryByText('Email or username is required')).not.toBeInTheDocument()
    })
  })
})
