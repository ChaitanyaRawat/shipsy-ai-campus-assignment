import React from 'react'

const Pagination = ({ pagination, onPageChange }) => {
  const { page, totalPages, hasNext, hasPrev, total } = pagination

  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    let start = Math.max(1, page - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  if (totalPages <= 1) return null

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing page {page} of {totalPages} ({total} total expenses)
      </div>
      
      <div className="pagination">
        <button 
          onClick={() => onPageChange(1)}
          disabled={!hasPrev}
          className="pagination-btn"
        >
          ⏮️ First
        </button>
        
        <button 
          onClick={() => onPageChange(page - 1)}
          disabled={!hasPrev}
          className="pagination-btn"
        >
          ◀️ Prev
        </button>
        
        {getPageNumbers().map(pageNum => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`pagination-btn ${pageNum === page ? 'active' : ''}`}
          >
            {pageNum}
          </button>
        ))}
        
        <button 
          onClick={() => onPageChange(page + 1)}
          disabled={!hasNext}
          className="pagination-btn"
        >
          Next ▶️
        </button>
        
        <button 
          onClick={() => onPageChange(totalPages)}
          disabled={!hasNext}
          className="pagination-btn"
        >
          Last ⏭️
        </button>
      </div>
    </div>
  )
}

export default Pagination
