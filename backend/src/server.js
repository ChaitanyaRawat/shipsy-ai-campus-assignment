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
const db = new PrismaClient();

// Basic security setup
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting - prevent spam
const requestLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use(requestLimit);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// My routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

// Catch all for 404s
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 3001;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle shutdown gracefully
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  db.$disconnect()
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

module.exports = { app, db };
