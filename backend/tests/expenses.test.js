const request = require('supertest')
const { app } = require('../src/server')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

describe('Expenses', () => {
  let accessToken
  let userId

  beforeEach(async () => {
    // Clean up database
    await prisma.refreshToken.deleteMany()
    await prisma.expense.deleteMany()
    await prisma.user.deleteMany()

    // Create test user and get token
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        email: 'test@example.com',
        username: 'testuser',
        password: 'TestPass123'
      })
    
    accessToken = response.body.tokens.accessToken
    userId = response.body.user.id
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/expenses', () => {
    const validExpenseData = {
      description: 'Test expense',
      category: 'FOOD',
      isRecurring: false,
      amount: 25.50,
      taxPercent: 8.25,
      date: '2023-12-01'
    }

    it('should create expense successfully', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(validExpenseData)
        .expect(201)

      expect(response.body.message).toBe('Expense created successfully')
      expect(response.body.expense.description).toBe(validExpenseData.description)
      expect(response.body.expense.category).toBe(validExpenseData.category)
      expect(response.body.expense.amount).toBe(validExpenseData.amount)
      expect(response.body.expense.taxPercent).toBe(validExpenseData.taxPercent)
      expect(response.body.expense.totalAmount).toBe(27.60) // 25.50 + (25.50 * 0.0825)
      expect(response.body.expense.userId).toBe(userId)
    })

    it('should calculate total amount correctly for edge cases', async () => {
      // Test with 0% tax
      const zeroTaxExpense = {
        ...validExpenseData,
        amount: 100,
        taxPercent: 0
      }

      const response1 = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(zeroTaxExpense)
        .expect(201)

      expect(response1.body.expense.totalAmount).toBe(100)

      // Test with 100% tax
      const fullTaxExpense = {
        ...validExpenseData,
        amount: 50,
        taxPercent: 100
      }

      const response2 = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(fullTaxExpense)
        .expect(201)

      expect(response2.body.expense.totalAmount).toBe(100) // 50 + (50 * 1.0)
    })

    it('should not create expense without authentication', async () => {
      const response = await request(app)
        .post('/api/expenses')
        .send(validExpenseData)
        .expect(401)

      expect(response.body.error).toBe('Access token required')
    })

    it('should not create expense with invalid data', async () => {
      const invalidExpense = {
        description: '', // Empty description
        category: 'INVALID_CATEGORY',
        amount: -10, // Negative amount
        taxPercent: 150 // Invalid tax percent
      }

      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(invalidExpense)
        .expect(400)

      expect(response.body.error).toBe('Validation error')
    })
  })

  describe('GET /api/expenses', () => {
    beforeEach(async () => {
      // Create test expenses
      const expenses = [
        {
          description: 'Grocery shopping',
          category: 'FOOD',
          amount: 50,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        },
        {
          description: 'Bus ticket',
          category: 'TRANSPORT',
          amount: 5,
          taxPercent: 0,
          date: '2023-12-02',
          isRecurring: true
        },
        {
          description: 'Electric bill',
          category: 'UTILITIES',
          amount: 100,
          taxPercent: 10,
          date: '2023-12-03',
          isRecurring: true
        }
      ]

      for (const expense of expenses) {
        await request(app)
          .post('/api/expenses')
          .set('Authorization', `Bearer ${accessToken}`)
          .send(expense)
      }
    })

    it('should get expenses with default pagination', async () => {
      const response = await request(app)
        .get('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses).toHaveLength(3)
      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(5)
      expect(response.body.pagination.total).toBe(3)
      expect(response.body.pagination.totalPages).toBe(1)
    })

    it('should paginate expenses correctly', async () => {
      const response = await request(app)
        .get('/api/expenses?page=1&limit=2')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses).toHaveLength(2)
      expect(response.body.pagination.page).toBe(1)
      expect(response.body.pagination.limit).toBe(2)
      expect(response.body.pagination.total).toBe(3)
      expect(response.body.pagination.totalPages).toBe(2)
      expect(response.body.pagination.hasNext).toBe(true)
      expect(response.body.pagination.hasPrev).toBe(false)
    })

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/expenses?category=FOOD')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses).toHaveLength(1)
      expect(response.body.expenses[0].category).toBe('FOOD')
    })

    it('should filter by date range', async () => {
      const response = await request(app)
        .get('/api/expenses?dateFrom=2023-12-02&dateTo=2023-12-03')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses).toHaveLength(2)
    })

    it('should search by description', async () => {
      const response = await request(app)
        .get('/api/expenses?q=grocery')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses).toHaveLength(1)
      expect(response.body.expenses[0].description).toContain('Grocery')
    })

    it('should sort expenses', async () => {
      const response = await request(app)
        .get('/api/expenses?sortBy=amount&order=asc')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.expenses[0].amount).toBe(5)
      expect(response.body.expenses[2].amount).toBe(100)
    })

    it('should validate pagination boundaries', async () => {
      // Test invalid page
      const response1 = await request(app)
        .get('/api/expenses?page=0')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)

      expect(response1.body.error).toBe('Validation error')

      // Test invalid limit
      const response2 = await request(app)
        .get('/api/expenses?limit=100')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(400)

      expect(response2.body.error).toBe('Validation error')
    })
  })

  describe('PUT /api/expenses/:id', () => {
    let expenseId

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Test expense',
          category: 'FOOD',
          amount: 25,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        })
      
      expenseId = response.body.expense.id
    })

    it('should update expense successfully', async () => {
      const updateData = {
        description: 'Updated expense',
        category: 'TRANSPORT',
        amount: 30,
        taxPercent: 5,
        date: '2023-12-02',
        isRecurring: true
      }

      const response = await request(app)
        .put(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updateData)
        .expect(200)

      expect(response.body.expense.description).toBe(updateData.description)
      expect(response.body.expense.category).toBe(updateData.category)
      expect(response.body.expense.totalAmount).toBe(31.5) // 30 + (30 * 0.05)
    })

    it('should not update non-existent expense', async () => {
      const response = await request(app)
        .put('/api/expenses/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Updated',
          category: 'FOOD',
          amount: 25,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        })
        .expect(404)

      expect(response.body.error).toBe('Expense not found')
    })
  })

  describe('DELETE /api/expenses/:id', () => {
    let expenseId

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Test expense',
          category: 'FOOD',
          amount: 25,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        })
      
      expenseId = response.body.expense.id
    })

    it('should delete expense successfully', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.message).toBe('Expense deleted successfully')

      // Verify expense is deleted
      await request(app)
        .get(`/api/expenses/${expenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)
    })

    it('should not delete non-existent expense', async () => {
      const response = await request(app)
        .delete('/api/expenses/non-existent-id')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(response.body.error).toBe('Expense not found')
    })
  })

  describe('Security', () => {
    let user2AccessToken
    let user2ExpenseId

    beforeEach(async () => {
      // Create second user
      const user2Response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user2@example.com',
          username: 'testuser2',
          password: 'TestPass123'
        })
      
      user2AccessToken = user2Response.body.tokens.accessToken

      // Create expense for user2
      const expenseResponse = await request(app)
        .post('/api/expenses')
        .set('Authorization', `Bearer ${user2AccessToken}`)
        .send({
          description: 'User2 expense',
          category: 'FOOD',
          amount: 25,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        })
      
      user2ExpenseId = expenseResponse.body.expense.id
    })

    it('should not allow user to access other user expenses', async () => {
      // User1 trying to access User2's expense
      const response = await request(app)
        .get(`/api/expenses/${user2ExpenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(response.body.error).toBe('Expense not found')
    })

    it('should not allow user to update other user expenses', async () => {
      const response = await request(app)
        .put(`/api/expenses/${user2ExpenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          description: 'Hacked expense',
          category: 'FOOD',
          amount: 25,
          taxPercent: 0,
          date: '2023-12-01',
          isRecurring: false
        })
        .expect(404)

      expect(response.body.error).toBe('Expense not found')
    })

    it('should not allow user to delete other user expenses', async () => {
      const response = await request(app)
        .delete(`/api/expenses/${user2ExpenseId}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(404)

      expect(response.body.error).toBe('Expense not found')
    })
  })
})
