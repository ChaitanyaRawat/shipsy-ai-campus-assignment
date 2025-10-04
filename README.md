# Expense Tracker - AI Campus Assignment

A full-stack expense tracking application built with Node.js, Express, Prisma, React, and Vite.

## Features

- 🔐 User authentication with JWT
- 💰 Complete expense CRUD operations
- 📊 Expense categorization and recurring expenses
- 🧮 Automatic tax calculation
- 📱 Responsive React UI
- 🔍 Advanced filtering, sorting, and pagination
- 📝 Comprehensive API documentation
- 🧪 Full test coverage
- 🚀 Production-ready deployment

## Tech Stack

### Backend
- Node.js + Express
- Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- JWT authentication with bcrypt
- Jest + Supertest for testing

### Frontend
- React 18 with Vite
- React Router for navigation
- React Testing Library
- Responsive CSS

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd shipsy-project
```

2. Install backend dependencies
```bash
cd backend
npm install
```

3. Install frontend dependencies
```bash
cd ../frontend
npm install
```

4. Setup database
```bash
cd ../backend
npx prisma migrate dev
npx prisma generate
```

5. Start development servers

Backend:
```bash
cd backend
npm run dev
```

Frontend (in new terminal):
```bash
cd frontend
npm run dev
```

## Environment Variables

Create `.env` files in both backend and frontend directories:

### Backend (.env)
