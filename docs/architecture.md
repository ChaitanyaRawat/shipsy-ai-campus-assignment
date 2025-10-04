# System Architecture Documentation

## Overview

The Expense Tracker is a full-stack web application built with modern technologies following best practices for security, scalability, and maintainability.

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React)       │◄──►│   (Node.js)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • React 18      │    │ • Express.js    │    │ • Prisma ORM    │
│ • Vite          │    │ • JWT Auth      │    │ • Migrations    │
│ • React Router  │    │ • Validation    │    │ • Relationships │
│ • Axios         │    │ • Rate Limiting │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing and navigation
- **Axios**: HTTP client with interceptors for token management
- **CSS3**: Custom responsive styling without frameworks

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Prisma ORM**: Type-safe database client and migrations
- **JWT**: JSON Web Tokens for authentication
- **bcryptjs**: Password hashing and verification
- **Joi**: Input validation and sanitization

### Database
- **SQLite**: Development database
- **PostgreSQL**: Production database
- **Prisma**: Schema management and migrations

### Security & Middleware
- **Helmet**: Security headers
- **CORS**: Cross-origin resource sharing
- **Rate Limiting**: API request throttling
- **Input Validation**: Server-side validation with Joi

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐         ┌─────────────────┐
│      User       │         │   RefreshToken  │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────┤ id (PK)         │
│ email (UNIQUE)  │         │ token (UNIQUE)  │
│ username(UNIQUE)│         │ userId (FK)     │
│ password        │         │ expiresAt       │
│ createdAt       │         │ createdAt       │
│ updatedAt       │         └─────────────────┘
├─────────────────┤
│                 │
│ expenses[]      │◄┐
└─────────────────┘ │
                    │
            ┌───────┴─────────┐
            │    Expense      │
            ├─────────────────┤
            │ id (PK)         │
            │ description     │
            │ category (ENUM) │
            │ isRecurring     │
            │ amount          │
            │ taxPercent      │
            │ totalAmount     │
            │ date            │
            │ createdAt       │
            │ updatedAt       │
            │ userId (FK)     │
            └─────────────────┘
```

### Schema Details

#### User Table
- **Primary Key**: `id` (CUID)
- **Unique Constraints**: `email`, `username`
- **Password**: Hashed with bcrypt (12 rounds)
- **Relationships**: One-to-many with Expense and RefreshToken

#### Expense Table
- **Primary Key**: `id` (CUID)
- **Category Enum**: FOOD, TRANSPORT, UTILITIES, ENTERTAINMENT, OTHER
- **Calculated Field**: `totalAmount = amount + (amount * taxPercent / 100)`
- **Foreign Key**: `userId` references User.id
- **Constraints**: Amount > 0, taxPercent 0-100%

#### RefreshToken Table
- **Primary Key**: `id` (CUID)
- **Unique Constraint**: `token`
- **TTL**: 7 days expiry
- **Foreign Key**: `userId` references User.id with CASCADE delete

## API Architecture

### RESTful Design

```
/api/auth/
├── POST   /register     # User registration
├── POST   /login        # User authentication
├── POST   /refresh      # Token refresh
├── POST   /logout       # User logout
└── GET    /me           # Current user info

/api/expenses/
├── POST   /             # Create expense
├── GET    /             # List expenses (with filters)
├── GET    /:id          # Get single expense
├── PUT    /:id          # Update expense
└── DELETE /:id          # Delete expense

/api/
└── GET    /health       # Health check
```

### Authentication Flow

```
1. User Registration/Login
   ┌─────────┐    POST /auth/login    ┌─────────┐
   │ Client  │──────────────────────►│ Server  │
   └─────────┘                       └─────────┘
                                           │
                                           ▼
                                    Verify Password
                                           │
                                           ▼
                                    Generate Tokens
                                           │
   ┌─────────┐    Access + Refresh   ┌─────────┐
   │ Client  │◄──────────────────────│ Server  │
   └─────────┘                       └─────────┘

2. API Request with Token
   ┌─────────┐    Bearer Token       ┌─────────┐
   │ Client  │──────────────────────►│ Server  │
   └─────────┘                       └─────────┘
                                           │
                                           ▼
                                    Verify JWT
                                           │
                                           ▼
                                    Process Request

3. Token Refresh (Automatic)
   ┌─────────┐    401 Unauthorized   ┌─────────┐
   │ Client  │◄──────────────────────│ Server  │
   └─────────┘                       └─────────┘
       │
       ▼
   Auto-refresh with refresh token
       │
       ▼
   ┌─────────┐    Retry with new     ┌─────────┐
   │ Client  │──────────────────────►│ Server  │
   └─────────┘                       └─────────┘
```

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
├── Router
    ├── Layout
    │   ├── Navigation
    │   ├── Main Content
    │   │   ├── Dashboard
    │   │   │   ├── ExpenseFilters
    │   │   │   ├── ExpenseTable
    │   │   │   └── Pagination
    │   │   ├── CreateExpense
    │   │   │   └── ExpenseForm
    │   │   ├── EditExpense
    │   │   │   └── ExpenseForm
    │   │   └── ExpenseDetail
    │   └── Footer
    └── Auth Pages
        ├── Login
        └── Register
```

### State Management

- **Authentication State**: React Context with global user state
- **Form State**: Local component state with validation
- **API State**: Direct API calls with loading/error states
- **Route State**: React Router for navigation state

### Key Features Implementation

#### Automatic Token Refresh
```javascript
// Axios interceptor handles token refresh automatically
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      // Auto-refresh logic
    }
  }
)
```

#### Live Total Calculation
```javascript
// Real-time calculation in expense form
useEffect(() => {
  const amount = parseFloat(formData.amount) || 0
  const tax = parseFloat(formData.taxPercent) || 0
  const total = amount + (amount * tax / 100)
  setTotalAmount(total.toFixed(2))
}, [formData.amount, formData.taxPercent])
```

## Security Architecture

### Authentication Security
- **Password Hashing**: bcrypt with 12 rounds
- **JWT Security**: Short-lived access tokens (15 min)
- **Refresh Tokens**: Stored in database with expiry tracking
- **Token Rotation**: New refresh token on each refresh

### API Security
- **CORS**: Configured with specific origins
- **Helmet**: Security headers (CSP, XSS protection)
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schemas for all inputs
- **SQL Injection**: Prevented by Prisma ORM

### Authorization
- **User Isolation**: Each user can only access their own expenses
- **Route Protection**: All expense endpoints require authentication
- **Data Validation**: Server-side validation for all operations

## Performance Considerations

### Backend Optimizations
- **Database Indexing**: Automatic indexes on foreign keys
- **Pagination**: Efficient offset-based pagination
- **Query Optimization**: Prisma query optimization
- **Caching**: HTTP cache headers for static content

### Frontend Optimizations
- **Code Splitting**: Vite automatic code splitting
- **Lazy Loading**: React.lazy for route components
- **API Optimization**: Automatic request deduplication
- **Bundle Size**: Tree shaking and minification

## Deployment Architecture

### Development Environment
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   localhost:5173│◄──►│ localhost:3001  │
│                 │    │                 │
│ • Vite Dev      │    │ • Nodemon       │
│ • Hot Reload    │    │ • SQLite DB     │
└─────────────────┘    └─────────────────┘
```

### Production Environment
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel CDN    │    │   Railway       │    │  PostgreSQL     │
│   Static Site   │◄──►│   Node.js       │◄──►│   Database      │
│                 │    │                 │    │                 │
│ • Global CDN    │    │ • Auto-scaling  │    │ • Managed DB    │
│ • SSL/TLS       │    │ • SSL/TLS       │    │ • Backups       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Testing Strategy

### Backend Testing
- **Unit Tests**: Individual function testing
- **Integration Tests**: API endpoint testing
- **Security Tests**: Authentication and authorization
- **Edge Cases**: Boundary conditions and error scenarios

### Frontend Testing
- **Component Tests**: React Testing Library
- **Integration Tests**: User interaction flows
- **E2E Tests**: Complete user journeys (future enhancement)

## Monitoring and Observability

### Application Monitoring
- **Health Checks**: `/api/health` endpoint
- **Error Tracking**: Console logging with timestamps
- **Performance**: Response time monitoring
- **Uptime**: Deployment platform monitoring

### Security Monitoring
- **Failed Login Attempts**: Rate limiting protection
- **Invalid Tokens**: JWT verification logging
- **Unusual Patterns**: Request frequency monitoring

## Scalability Considerations

### Horizontal Scaling
- **Stateless Design**: JWT tokens eliminate session storage
- **Database Scaling**: PostgreSQL read replicas support
- **CDN**: Static asset distribution
- **Load Balancing**: Platform-level load balancing

### Vertical Scaling
- **Resource Optimization**: Efficient memory usage
- **Connection Pooling**: Database connection management
- **Caching**: HTTP caching strategies
- **Compression**: Gzip compression enabled

## Future Enhancements

### Technical Improvements
- **TypeScript**: Full type safety
- **GraphQL**: More efficient data fetching
- **Redis**: Session and caching layer
- **Microservices**: Service decomposition

### Feature Enhancements
- **Real-time Updates**: WebSocket integration
- **File Uploads**: Receipt image storage
- **Reporting**: Charts and analytics
- **Mobile App**: React Native implementation

This architecture provides a solid foundation for a production-ready expense tracking application with room for future growth and enhancement.
