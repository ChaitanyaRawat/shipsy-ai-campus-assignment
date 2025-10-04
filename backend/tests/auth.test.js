const request = require('supertest')
const { app } = require('../src/server')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

describe('Authentication', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await prisma.refreshToken.deleteMany()
    await prisma.expense.deleteMany()
    await prisma.user.deleteMany()
  })

  afterAll(async () => {
    await prisma.$disconnect()
  })

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'TestPass123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      expect(response.body.message).toBe('User registered successfully')
      expect(response.body.user.email).toBe(userData.email)
      expect(response.body.user.username).toBe(userData.username)
      expect(response.body.user.password).toBeUndefined()
      expect(response.body.tokens.accessToken).toBeDefined()
      expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('should not register user with invalid email', async () => {
      const userData = {
        email: 'invalid-email',
        username: 'testuser',
        password: 'TestPass123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.error).toBe('Validation error')
    })

    it('should not register user with weak password', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser',
        password: 'weak'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400)

      expect(response.body.error).toBe('Validation error')
    })

    it('should not register user with duplicate email', async () => {
      const userData = {
        email: 'test@example.com',
        username: 'testuser1',
        password: 'TestPass123'
      }

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201)

      // Second registration with same email
      const duplicateData = {
        email: 'test@example.com',
        username: 'testuser2',
        password: 'TestPass123'
      }

      const response = await request(app)
        .post('/api/auth/register')
        .send(duplicateData)
        .expect(400)

      expect(response.body.error).toBe('User already exists')
    })
  })

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'TestPass123'
        })
    })

    it('should login with email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'TestPass123'
        })
        .expect(200)

      expect(response.body.message).toBe('Login successful')
      expect(response.body.user.email).toBe('test@example.com')
      expect(response.body.tokens.accessToken).toBeDefined()
      expect(response.body.tokens.refreshToken).toBeDefined()
    })

    it('should login with username', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'testuser',
          password: 'TestPass123'
        })
        .expect(200)

      expect(response.body.message).toBe('Login successful')
      expect(response.body.user.username).toBe('testuser')
    })

    it('should not login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'test@example.com',
          password: 'WrongPass123'
        })
        .expect(401)

      expect(response.body.error).toBe('Invalid credentials')
    })

    it('should not login with non-existent user', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          emailOrUsername: 'nonexistent@example.com',
          password: 'TestPass123'
        })
        .expect(401)

      expect(response.body.error).toBe('Invalid credentials')
    })
  })

  describe('GET /api/auth/me', () => {
    let accessToken

    beforeEach(async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          username: 'testuser',
          password: 'TestPass123'
        })
      
      accessToken = response.body.tokens.accessToken
    })

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200)

      expect(response.body.user.email).toBe('test@example.com')
      expect(response.body.user.username).toBe('testuser')
    })

    it('should not get user without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401)

      expect(response.body.error).toBe('Access token required')
    })

    it('should not get user with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401)

      expect(response.body.error).toBe('Invalid access token')
    })
  })
})
