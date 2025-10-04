import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { expensesAPI } from '../services/api'
import ExpenseForm from '../components/ExpenseForm'

const CreateExpense = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (expenseData) => {
    try {
      setLoading(true)
      setError('')
      
      await expensesAPI.createExpense(expenseData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create expense')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-expense">
      <div className="page-header">
        <h1>Add New Expense</h1>
        <p>Track your spending by adding a new expense</p>
      </div>

      {error && (
        <div className="error-banner">
          {error}
        </div>
      )}

      <ExpenseForm 
        onSubmit={handleSubmit}
        loading={loading}
        submitButtonText="Create Expense"
      />
    </div>
  )
}

export default CreateExpense
