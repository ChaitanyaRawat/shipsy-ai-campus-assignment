import React, { useState } from 'react'

const ExpenseFilters = ({ filters, onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const categories = [
    { value: '', label: 'All Categories' },
    { value: 'FOOD', label: 'Food' },
    { value: 'TRANSPORT', label: 'Transport' },
    { value: 'UTILITIES', label: 'Utilities' },
    { value: 'ENTERTAINMENT', label: 'Entertainment' },
    { value: 'OTHER', label: 'Other' }
  ]

  const sortOptions = [
    { value: 'date', label: 'Date' },
    { value: 'amount', label: 'Amount' },
    { value: 'totalAmount', label: 'Total Amount' },
    { value: 'createdAt', label: 'Created' }
  ]

  const handleInputChange = (field, value) => {
    onFilterChange({ [field]: value })
  }

  const clearFilters = () => {
    onFilterChange({
      category: '',
      dateFrom: '',
      dateTo: '',
      sortBy: 'date',
      order: 'desc',
      q: '',
      limit: 5
    })
  }

  return (
    <div className="expense-filters">
      <div className="filters-header">
        <button 
          className="filters-toggle"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          🔍 Filters {isExpanded ? '▼' : '▶'}
        </button>
        
        <div className="filters-quick">
          <input
            type="text"
            placeholder="Search expenses..."
            value={filters.q}
            onChange={(e) => handleInputChange('q', e.target.value)}
            className="search-input"
          />
          
          <select
            value={filters.limit}
            onChange={(e) => handleInputChange('limit', parseInt(e.target.value))}
            className="limit-select"
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={50}>50 per page</option>
          </select>
        </div>
      </div>

      {isExpanded && (
        <div className="filters-expanded">
          <div className="filters-row">
            <div className="filter-group">
              <label>Category</label>
              <select
                value={filters.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Date From</label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => handleInputChange('dateFrom', e.target.value)}
              />
            </div>

            <div className="filter-group">
              <label>Date To</label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => handleInputChange('dateTo', e.target.value)}
              />
            </div>
          </div>

          <div className="filters-row">
            <div className="filter-group">
              <label>Sort By</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleInputChange('sortBy', e.target.value)}
              >
                {sortOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>Order</label>
              <select
                value={filters.order}
                onChange={(e) => handleInputChange('order', e.target.value)}
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>

            <div className="filter-group">
              <label>&nbsp;</label>
              <button 
                onClick={clearFilters}
                className="btn btn-secondary"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ExpenseFilters
