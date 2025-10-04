const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Apply authentication to all routes
router.use(authenticateToken);

// Validation schemas
const expenseSchema = Joi.object({
  description: Joi.string().trim().min(1).max(500).required(),
  category: Joi.string().valid('FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'OTHER').required(),
  isRecurring: Joi.boolean().default(false),
  amount: Joi.number().positive().precision(2).required(),
  taxPercent: Joi.number().min(0).max(100).precision(2).default(0),
  date: Joi.date().iso().required()
});

const querySchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(5),
  category: Joi.string().valid('FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'OTHER'),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso(),
  sortBy: Joi.string().valid('date', 'amount', 'totalAmount', 'createdAt').default('date'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  q: Joi.string().trim().max(100)
});

// Helper function to calculate total amount
const calculateTotalAmount = (amount, taxPercent) => {
  return parseFloat((amount + (amount * taxPercent / 100)).toFixed(2));
};

// Create expense
router.post('/', async (req, res, next) => {
  try {
    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { description, category, isRecurring, amount, taxPercent, date } = value;
    const totalAmount = calculateTotalAmount(amount, taxPercent);

    const expense = await prisma.expense.create({
      data: {
        description,
        category,
        isRecurring,
        amount,
        taxPercent,
        totalAmount,
        date: new Date(date),
        userId: req.user.id
      }
    });

    res.status(201).json({
      message: 'Expense created successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
});

// Get expenses with filtering, sorting, and pagination
router.get('/', async (req, res, next) => {
  try {
    const { error, value } = querySchema.validate(req.query);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { page, limit, category, dateFrom, dateTo, sortBy, order, q } = value;
    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      userId: req.user.id
    };

    if (category) {
      where.category = category;
    }

    if (dateFrom || dateTo) {
      where.date = {};
      if (dateFrom) where.date.gte = new Date(dateFrom);
      if (dateTo) where.date.lte = new Date(dateTo);
    }

    if (q) {
      where.description = {
        contains: q,
        mode: 'insensitive'
      };
    }

    // Get expenses with pagination
    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        orderBy: { [sortBy]: order },
        skip,
        take: limit
      }),
      prisma.expense.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.json({
      expenses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (error) {
    next(error);
  }
});

// Get single expense
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    const expense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense });
  } catch (error) {
    next(error);
  }
});

// Update expense
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { error, value } = expenseSchema.validate(req.body);
    if (error) {
      error.isJoi = true;
      return next(error);
    }

    const { description, category, isRecurring, amount, taxPercent, date } = value;
    const totalAmount = calculateTotalAmount(amount, taxPercent);

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const expense = await prisma.expense.update({
      where: { id },
      data: {
        description,
        category,
        isRecurring,
        amount,
        taxPercent,
        totalAmount,
        date: new Date(date)
      }
    });

    res.json({
      message: 'Expense updated successfully',
      expense
    });
  } catch (error) {
    next(error);
  }
});

// Delete expense
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Check if expense exists and belongs to user
    const existingExpense = await prisma.expense.findFirst({
      where: {
        id,
        userId: req.user.id
      }
    });

    if (!existingExpense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await prisma.expense.delete({
      where: { id }
    });

    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
