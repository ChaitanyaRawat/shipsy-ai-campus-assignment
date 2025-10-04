# Personal Expense Tracker

A web application I built to help manage and track personal expenses with categories, tax calculations, and advanced filtering.

## Features

- User authentication and secure login
- Add, edit, and delete expenses
- Categorize expenses (Food, Transport, Utilities, etc.)
- Automatic tax calculation
- Filter and search expenses
- Responsive design for mobile and desktop

## Tech Stack

**Backend:**
- Node.js with Express
- Prisma ORM with SQLite database
- JWT authentication
- Input validation with Joi

**Frontend:**
- React 18 with modern hooks
- Vite for fast development
- Axios for API calls
- Responsive CSS

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm

### Installation

1. Clone or download the project
2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Set up the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. Create environment files:
```bash
# Backend .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-jwt-secret-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"
PORT=3001

# Frontend .env
VITE_API_URL=http://localhost:3001/api
```

### Running the Application

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend (in a new terminal):
```bash
cd frontend
npm run dev
```

Open http://localhost:5173 in your browser.

## Usage

1. Create an account or log in
2. Add your expenses with descriptions, amounts, and categories
3. Use filters to find specific expenses
4. Edit or delete expenses as needed
5. View summaries and totals on the dashboard

## Project Structure

```
├── backend/          # Node.js API server
├── frontend/         # React web application
├── docs/            # Documentation files
└── README.md        # This file
```

## Security Features

- Passwords are hashed with bcrypt
- JWT tokens for secure authentication
- Input validation and sanitization
- CORS protection
- Rate limiting

## License

MIT License
