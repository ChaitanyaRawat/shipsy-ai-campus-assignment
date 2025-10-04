import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { expensesAPI } from '../services/api'
import LoadingSpinner from '../components/LoadingSpinner'
import ExpenseFilters from '../components/ExpenseFilters'
import ExpenseTable from '../components/ExpenseTable'
import Pagination from '../components/Pagination'

const Dashboard = () => {
  const [expenses, setExpenses] = useState([])
  const [pagination, setPagination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState({
    page: 1,
    limit: 5,
    category: '',
    dateFrom: '',
    dateTo: '',
    sortBy: 'date',
    order: 'desc',
    q: ''
  })

  const fetchExpenses = async () => {
    try {
      setLoading(true)
      setError('')
      
      const queryParams = {}
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          queryParams[key] = filters[key]
        }
      })

      const response = await expensesAPI.getExpenses(queryParams)
      setExpenses(response.expenses)
      setPagination(response.pagination)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch expenses')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [filters])

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }))
  }

  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleDeleteExpense = async (id) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) {
      return
    }

    try {
      await expensesAPI.deleteExpense(id)
      fetchExpenses() // Refresh the list
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete expense')
    }
  }

  const calculateTotalAmount = (expenses) => {
    return expenses.reduce((sum, expense) => sum + expense.totalAmount, 0).toFixed(2)
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Expense Dashboard</h1>
        <Link to="/expenses/new" className="btn btn-primary">
          + Add New Expense
        </Link>
      </div>

      {expenses.length > 0 && (
        <div className="dashboard-summary">
          <div className="summary-card">
            <h3>Total Expenses</h3>
            <p className="summary-amount">${calculateTotalAmount(expenses)}</p>
          </div>
          <div className="summary-card">
            <h3>This Page</h3>
            <p className="summary-count">{expenses.length} expenses</p>
          </div>
        </div>
      )}

      <ExpenseFilters 
        filters={filters} 
        onFilterChange={handleFilterChange} 
      />

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      {loading ? (
        <LoadingSpinner text="Loading expenses..." />
      ) : expenses.length === 0 ? (
        <div className="empty-state">
          <h3>No expenses found</h3>
          <p>Start by adding your first expense</p>
          <Link to="/expenses/new" className="btn btn-primary">
            Add First Expense
          </Link>
        </div>
      ) : (
        <>
          <ExpenseTable 
            expenses={expenses} 
            onDelete={handleDeleteExpense}
          />
          
          {pagination && (
            <Pagination 
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  )
}

export default Dashboard
