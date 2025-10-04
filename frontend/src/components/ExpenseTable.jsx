import React from 'react'
import { Link } from 'react-router-dom'

const ExpenseTable = ({ expenses, onDelete }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
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

  return (
    <div className="expense-table-container">
      <div className="table-responsive">
        <table className="expense-table">
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Tax</th>
              <th>Total</th>
              <th>Date</th>
              <th>Recurring</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map(expense => (
              <tr key={expense.id}>
                <td className="description-cell">
                  <Link 
                    to={`/expenses/${expense.id}`}
                    className="expense-link"
                  >
                    {expense.description}
                  </Link>
                </td>
                <td className="category-cell">
                  <span 
                    className="category-badge"
                    style={{ backgroundColor: getCategoryColor(expense.category) }}
                  >
                    {getCategoryIcon(expense.category)} {expense.category}
                  </span>
                </td>
                <td className="amount-cell">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="tax-cell">
                  {expense.taxPercent}%
                </td>
                <td className="total-cell">
                  <strong>{formatCurrency(expense.totalAmount)}</strong>
                </td>
                <td className="date-cell">
                  {formatDate(expense.date)}
                </td>
                <td className="recurring-cell">
                  {expense.isRecurring ? (
                    <span className="recurring-badge">🔄 Yes</span>
                  ) : (
                    <span className="one-time-badge">➡️ No</span>
                  )}
                </td>
                <td className="actions-cell">
                  <div className="action-buttons">
                    <Link 
                      to={`/expenses/${expense.id}/edit`}
                      className="btn btn-sm btn-secondary"
                    >
                      Edit
                    </Link>
                    <button 
                      onClick={() => onDelete(expense.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ExpenseTable
