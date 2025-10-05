require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { PrismaClient } = require('@prisma/client');

const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const prisma = new PrismaClient();

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// Basic security setup
app.use(helmet());
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    process.env.FRONTEND_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting - prevent spam (configured for Vercel)
const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(requestLimit);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route for health check
app.get('/', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Expense Tracker API',
    timestamp: new Date().toISOString() 
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Catch all for 404s
app.use('*', (req, res) => {
  console.log('404 for:', req.originalUrl);
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

// For local development only
if (process.env.NODE_ENV !== 'production') {
  const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
  });

  // Handle shutdown gracefully
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    prisma.$disconnect()
      .then(() => {
        server.close(() => {
          console.log('Process terminated');
        });
      })
      .catch((error) => {
        console.error('Error during shutdown:', error);
        process.exit(1);
      });
  });
}

// Export for Vercel
module.exports = app;
