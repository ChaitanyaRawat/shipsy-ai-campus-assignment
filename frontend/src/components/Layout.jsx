import React from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Layout = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="nav-container">
          <Link to="/dashboard" className="nav-logo">
            💰 Expense Tracker
          </Link>
          
          <div className="nav-menu">
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/expenses/new" className="nav-link">Add Expense</Link>
            
            <div className="nav-user">
              <span className="user-name">Hi, {user?.username}</span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <p>&copy; 2023 Expense Tracker. Built for AI Campus Assignment.</p>
      </footer>
    </div>
  )
}

export default Layout
