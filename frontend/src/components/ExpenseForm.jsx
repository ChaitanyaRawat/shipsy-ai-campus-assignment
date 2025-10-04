import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import LoadingSpinner from './LoadingSpinner'

const ExpenseForm = ({ 
  initialData = {}, 
  onSubmit, 
  loading = false, 
  submitButtonText = 'Save Expense' 
}) => {
  const [formData, setFormData] = useState({
    description: '',
    category: 'OTHER',
    isRecurring: false,
    amount: '',
    taxPercent: '0',
    date: new Date().toISOString().split('T')[0],
    ...initialData
  })
  const [errors, setErrors] = useState({})
  const [totalAmount, setTotalAmount] = useState(0)

  const categories = [
    { value: 'FOOD', label: 'Food', icon: '🍽️' },
    { value: 'TRANSPORT', label: 'Transport', icon: '🚗' },
    { value: 'UTILITIES', label: 'Utilities', icon: '💡' },
    { value: 'ENTERTAINMENT', label: 'Entertainment', icon: '🎬' },
    { value: 'OTHER', label: 'Other', icon: '📋' }
  ]

  // Calculate total amount whenever amount or tax changes
  useEffect(() => {
    const amount = parseFloat(formData.amount) || 0
    const tax = parseFloat(formData.taxPercent) || 0
    const total = amount + (amount * tax / 100)
    setTotalAmount(total.toFixed(2))
  }, [formData.amount, formData.taxPercent])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Amount must be greater than 0'
    }

    const taxPercent = parseFloat(formData.taxPercent)
    if (isNaN(taxPercent) || taxPercent < 0 || taxPercent > 100) {
      newErrors.taxPercent = 'Tax percent must be between 0 and 100'
    }

    if (!formData.date) {
      newErrors.date = 'Date is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) return

    const expenseData = {
      ...formData,
      amount: parseFloat(formData.amount),
      taxPercent: parseFloat(formData.taxPercent)
    }

    await onSubmit(expenseData)
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="expense-form-container">
      <form onSubmit={handleSubmit} className="expense-form">
        <div className="form-row">
          <div className="form-group full-width">
            <label htmlFor="description">Description *</label>
            <input
              type="text"
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className={errors.description ? 'error' : ''}
              placeholder="Enter expense description"
              maxLength={500}
            />
            {errors.description && (
              <span className="error-text">{errors.description}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={errors.category ? 'error' : ''}
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span className="error-text">{errors.category}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={errors.date ? 'error' : ''}
            />
            {errors.date && (
              <span className="error-text">{errors.date}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">Amount ($) *</label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={errors.amount ? 'error' : ''}
              placeholder="0.00"
              step="0.01"
              min="0"
            />
            {errors.amount && (
              <span className="error-text">{errors.amount}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="taxPercent">Tax Percent (%)</label>
            <input
              type="number"
              id="taxPercent"
              name="taxPercent"
              value={formData.taxPercent}
              onChange={handleChange}
              className={errors.taxPercent ? 'error' : ''}
              placeholder="0"
              step="0.01"
              min="0"
              max="100"
            />
            {errors.taxPercent && (
              <span className="error-text">{errors.taxPercent}</span>
            )}
          </div>
        </div>

        <div className="form-row">
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isRecurring"
                checked={formData.isRecurring}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              This is a recurring expense
            </label>
          </div>
        </div>

        {formData.amount && (
          <div className="total-preview">
            <div className="total-breakdown">
              <p>Amount: ${parseFloat(formData.amount || 0).toFixed(2)}</p>
              <p>Tax ({formData.taxPercent}%): ${((parseFloat(formData.amount || 0) * parseFloat(formData.taxPercent || 0)) / 100).toFixed(2)}</p>
              <p className="total-amount">Total: ${totalAmount}</p>
            </div>
          </div>
        )}

        <div className="form-actions">
          <Link to="/dashboard" className="btn btn-secondary">
            Cancel
          </Link>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? <LoadingSpinner size="small" text="" /> : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  )
}

export default ExpenseForm
