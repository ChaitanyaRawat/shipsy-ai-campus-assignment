import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { expensesAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'

const ExpenseDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await expensesAPI.getExpense(id)
        setExpense(response.expense)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch expense')
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await expensesAPI.deleteExpense(id)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense')
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount) => {
    return `$${parseFloat(amount).toFixed(2)}`
  }

  const getCategoryIcon = (category) => {
    const icons = {
      FOOD: '🍽️',
      TRANSPORT: '🚗',
      UTILITIES: '💡',
      ENTERTAINMENT: '🎬',
      OTHER: '📋'
    }
    return icons[category] || '📋'
  }

  const getCategoryColor = (category) => {
    const colors = {
      FOOD: '#e74c3c',
      TRANSPORT: '#3498db',
      UTILITIES: '#f39c12',
      ENTERTAINMENT: '#9b59b6',
      OTHER: '#95a5a6'
    }
    return colors[category] || '#95a5a6'
  }

  if (loading) {
    return <LoadingSpinner text="Loading expense details..." />
  }

  if (error || !expense) {
    return (
      <div className="error-container">
        <h2>Error Loading Expense</h2>
        <p>{error || 'Expense not found'}</p>
        <Link to="/dashboard" className="btn btn-primary">
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="expense-detail">
      <div className="detail-header">
        <div className="header-content">
          <Link to="/dashboard" className="back-link">
            ← Back to Dashboard
          </Link>
          <h1>Expense Details</h1>
        </div>
        
        <div className="header-actions">
          <Link 
            to={`/expenses/${expense.id}/edit`} 
            className="btn btn-secondary"
          >
            Edit Expense
          </Link>
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Delete Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <div className="detail-content">
        <div className="detail-card">
          <div className="detail-section">
            <h2>Basic Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Description</label>
                <p className="description-text">{expense.description}</p>
              </div>
              
              <div className="detail-item">
                <label>Category</label>
                <div className="category-display">
                  <span 
                    className="category-badge large"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  >
                    {getCategoryIcon(expense.category)} {expense.category}
                  </span>
                </div>
              </div>
              
              <div className="detail-item">
                <label>Date</label>
                <p className="date-text">{formatDate(expense.date)}</p>
              </div>
              
              <div className="detail-item">
                <label>Recurring</label>
                <div className="recurring-display">
                  {expense.isRecurring ? (
                    <span className="recurring-badge large">🔄 Recurring Expense</span>
                  ) : (
                    <span className="one-time-badge large">➡️ One-time Expense</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Financial Breakdown</h2>
            <div className="financial-grid">
              <div className="financial-item">
                <label>Base Amount</label>
                <p className="amount-text">{formatCurrency(expense.amount)}</p>
              </div>
              
              <div className="financial-item">
                <label>Tax Rate</label>
                <p className="tax-text">{expense.taxPercent}%</p>
              </div>
              
              <div className="financial-item">
                <label>Tax Amount</label>
                <p className="tax-amount-text">
                  {formatCurrency((expense.amount * expense.taxPercent) / 100)}
                </p>
              </div>
              
              <div className="financial-item total-item">
                <label>Total Amount</label>
                <p className="total-text">{formatCurrency(expense.totalAmount)}</p>
              </div>
            </div>
          </div>

          <div className="detail-section">
            <h2>Record Information</h2>
            <div className="detail-grid">
              <div className="detail-item">
                <label>Created</label>
                <p className="timestamp-text">
                  {new Date(expense.createdAt).toLocaleString()}
                </p>
              </div>
              
              <div className="detail-item">
                <label>Last Modified</label>
                <p className="timestamp-text">
                  {new Date(expense.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpenseDetail
