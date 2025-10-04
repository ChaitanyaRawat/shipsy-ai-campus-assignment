import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ExpenseForm from '../components/ExpenseForm'

const MockedExpenseForm = (props) => (
  <BrowserRouter>
    <ExpenseForm {...props} />
  </BrowserRouter>
)

describe('ExpenseForm Component', () => {
  const mockOnSubmit = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with all fields', () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/category/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/amount/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/tax percent/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/recurring expense/i)).toBeInTheDocument()
  })

  it('calculates total amount correctly', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    const taxInput = screen.getByLabelText(/tax percent/i)

    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(taxInput, { target: { value: '10' } })

    await waitFor(() => {
      expect(screen.getByText('Total: $110.00')).toBeInTheDocument()
    })
  })

  it('validates required fields', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /save expense/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Description is required')).toBeInTheDocument()
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    })
  })

  it('validates amount is positive', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: '-10' } })
    fireEvent.click(screen.getByRole('button', { name: /save expense/i }))

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument()
    })
  })

  it('validates tax percent range', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/tax percent/i), { target: { value: '150' } })
    fireEvent.click(screen.getByRole('button', { name: /save expense/i }))

    await waitFor(() => {
      expect(screen.getByText('Tax percent must be between 0 and 100')).toBeInTheDocument()
    })
  })

  it('submits form with valid data', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/description/i), {
      target: { value: 'Test expense' }
    })
    fireEvent.change(screen.getByLabelText(/amount/i), {
      target: { value: '25.50' }
    })
    fireEvent.change(screen.getByLabelText(/tax percent/i), {
      target: { value: '8.25' }
    })
    fireEvent.change(screen.getByLabelText(/date/i), {
      target: { value: '2023-12-01' }
    })
    
    fireEvent.click(screen.getByRole('button', { name: /save expense/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        description: 'Test expense',
        category: 'OTHER',
        isRecurring: false,
        amount: 25.50,
        taxPercent: 8.25,
        date: '2023-12-01'
      })
    })
  })

  it('populates form with initial data', () => {
    const initialData = {
      description: 'Initial expense',
      category: 'FOOD',
      amount: '50.00',
      taxPercent: '10',
      date: '2023-12-01',
      isRecurring: true
    }

    render(<MockedExpenseForm onSubmit={mockOnSubmit} initialData={initialData} />)
    
    expect(screen.getByDisplayValue('Initial expense')).toBeInTheDocument()
    expect(screen.getByDisplayValue('FOOD')).toBeInTheDocument()
    expect(screen.getByDisplayValue('50.00')).toBeInTheDocument()
    expect(screen.getByDisplayValue('10')).toBeInTheDocument()
    expect(screen.getByDisplayValue('2023-12-01')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('shows loading state during submission', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} loading={true} />)
    
    const submitButton = screen.getByRole('button')
    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button')).toHaveTextContent('')
  })

  it('calculates edge case totals correctly', async () => {
    render(<MockedExpenseForm onSubmit={mockOnSubmit} />)
    
    const amountInput = screen.getByLabelText(/amount/i)
    const taxInput = screen.getByLabelText(/tax percent/i)

    // Test with 0% tax
    fireEvent.change(amountInput, { target: { value: '100' } })
    fireEvent.change(taxInput, { target: { value: '0' } })

    await waitFor(() => {
      expect(screen.getByText('Total: $100.00')).toBeInTheDocument()
    })

    // Test with 100% tax
    fireEvent.change(taxInput, { target: { value: '100' } })

    await waitFor(() => {
      expect(screen.getByText('Total: $200.00')).toBeInTheDocument()
    })
  })
})
