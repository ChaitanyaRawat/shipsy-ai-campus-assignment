import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { expensesAPI } from '../services/api'
import ExpenseForm from '../components/ExpenseForm'
import LoadingSpinner from '../components/LoadingSpinner'

const EditExpense = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [expense, setExpense] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchExpense = async () => {
      try {
        const response = await expensesAPI.getExpense(id)
        // Format date for input field
        const expenseData = {
          ...response.expense,
          date: new Date(response.expense.date).toISOString().split('T')[0]
        }
        setExpense(expenseData)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch expense')
      } finally {
        setLoading(false)
      }
    }

    fetchExpense()
  }, [id])

  const handleSubmit = async (expenseData) => {
    try {
      setSubmitting(true)
      setError('')
      
      await expensesAPI.updateExpense(id, expenseData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update expense')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <LoadingSpinner text="Loading expense..." />
  }

  if (error && !expense) {
    return (
      <div className="error-container">
        <h2>Error Loading Expense</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    )
  }

  return (
    <div className="edit-expense">
      <div className="page-header">
        <h1>Edit Expense</h1>
        <p>Update your expense details</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <ExpenseForm 
        initialData={expense}
        onSubmit={handleSubmit}
        loading={submitting}
        submitButtonText="Update Expense"
      />
    </div>
  )
}

export default EditExpense
