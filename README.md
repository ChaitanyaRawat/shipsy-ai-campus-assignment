# Personal Expense Tracker

A comprehensive web application I developed to manage and track personal expenses with advanced features like categorization, tax calculations, and intelligent filtering.

🚀 **Live Demo:** https://expense-tracker-front-alpha.vercel.app

## About This Project

I built this expense tracker from the ground up to demonstrate modern full-stack development skills. The application showcases my abilities in React, Node.js, PostgreSQL, and cloud deployment technologies.

## Features I Implemented

- **Secure User Authentication** - JWT-based login system with password hashing
- **Smart Expense Management** - Add, edit, delete with automatic tax calculations  
- **Advanced Categorization** - Organize expenses across multiple categories
- **Intelligent Filtering** - Search, filter by date ranges and categories
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Real-time Calculations** - Live total updates as you input data
- **Cloud Database** - PostgreSQL hosted on Neon for reliability

## Technology Stack I Used

**Frontend Development:**
- React 18 with modern hooks and functional components
- Vite for optimized development and build process
- Custom responsive CSS (no framework dependencies)
- Axios for API communication with automatic token refresh

**Backend Development:**  
- Node.js with Express.js framework
- Prisma ORM for type-safe database operations
- JWT authentication with refresh tokens
- Comprehensive input validation with Joi
- Security middleware (CORS, Helmet, Rate Limiting)

**Database & Infrastructure:**
- PostgreSQL database hosted on Neon
- Vercel for frontend and backend deployment
- Environment-based configuration management
- SSL/TLS encryption for all connections

## Getting Started

### Prerequisites
- Node.js 18 or higher
- npm package manager

### Installation

1. Clone the repository
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

4. Set up environment variables:
```bash
# Backend .env
DATABASE_URL="your-postgresql-url"
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-refresh-secret"

# Frontend .env  
VITE_API_URL=http://localhost:3001/api
```

5. Initialize the database:
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

### Running Locally

Start the backend server:
```bash
cd backend
npm run dev
```

Start the frontend application:
```bash
cd frontend
npm run dev
```

Visit http://localhost:5173 to use the application.

## Key Features Breakdown

### Authentication System
- Secure user registration with strong password requirements
- Login with email or username support
- JWT access tokens with automatic refresh
- Protected routes and session management

### Expense Management
- Create expenses with description, amount, category, and date
- Automatic tax calculation with configurable rates
- Mark expenses as recurring for better tracking
- Edit and delete existing expenses with confirmation

### Advanced Filtering
- Search expenses by description
- Filter by category (Food, Transport, Utilities, Entertainment, Other)
- Date range filtering for specific time periods
- Sort by amount, date, or total amount
- Pagination for efficient data loading

### User Experience
- Responsive design that works on all devices
- Real-time form validation with helpful error messages
- Loading states and smooth transitions
- Intuitive navigation and clean interface

## Development Approach

I followed modern development best practices throughout this project:

- **Component-based architecture** for maintainable React code
- **RESTful API design** with proper HTTP status codes
- **Security-first approach** with input validation and authentication
- **Responsive design** using CSS Grid and Flexbox
- **Error handling** at both frontend and backend levels
- **Environment configuration** for different deployment stages

## Deployment Process

I deployed this application using modern cloud infrastructure:

- **Frontend**: Vercel static site hosting with CDN
- **Backend**: Vercel serverless functions  
- **Database**: Neon PostgreSQL with connection pooling
- **Security**: SSL/TLS encryption and secure headers

## Project Structure

```
expense-tracker/
├── backend/              # Node.js API server
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Authentication & validation
│   │   └── server.js     # Express application
│   ├── prisma/          # Database schema & migrations
│   └── tests/           # API test suite
├── frontend/            # React application  
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Application pages
│   │   ├── contexts/    # State management
│   │   └── services/    # API communication
└── docs/               # Documentation
```

## Skills Demonstrated

This project showcases my abilities in:
- Full-stack JavaScript development
- Modern React patterns and hooks
- RESTful API design and implementation  
- Database design and management
- User authentication and security
- Responsive web design
- Cloud deployment and DevOps
- Testing and documentation

## Future Enhancements

Planned improvements include:
- Data visualization with charts and graphs
- Export functionality for expense reports
- Mobile app development with React Native
- Advanced analytics and spending insights
- Multi-currency support

## Contact

**Developer:** Chaitanya Rawat  
**Live Application:** https://expense-tracker-front-alpha.vercel.app  


---

*This project demonstrates practical full-stack development skills and modern web technologies suitable for production applications.*
