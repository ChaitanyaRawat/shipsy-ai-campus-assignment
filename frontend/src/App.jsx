import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import CreateExpense from './pages/CreateExpense'
import EditExpense from './pages/EditExpense'
import ExpenseDetail from './pages/ExpenseDetail'
import Layout from './components/Layout'
import LoadingSpinner from './components/LoadingSpinner'
import './App.css'

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          {!user ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="expenses/new" element={<CreateExpense />} />
              <Route path="expenses/:id" element={<ExpenseDetail />} />
              <Route path="expenses/:id/edit" element={<EditExpense />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Route>
          )}
        </Routes>
      </div>
    </Router>
  )
}

export default App
