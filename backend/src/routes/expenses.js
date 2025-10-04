const express = require('express');
const { PrismaClient } = require('@prisma/client');
const Joi = require('joi');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();
const db = new PrismaClient();

// All routes need auth
router.use(authenticateToken);

// Validation for expense data
const expenseValidation = Joi.object({
  description: Joi.string().trim().min(1).max(500).required(),
  category: Joi.string().valid('FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'OTHER').required(),
  isRecurring: Joi.boolean().default(false),
  amount: Joi.number().positive().precision(2).required(),
  taxPercent: Joi.number().min(0).max(100).precision(2).default(0),
  date: Joi.date().iso().required()
});

const queryValidation = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(50).default(5),
  category: Joi.string().valid('FOOD', 'TRANSPORT', 'UTILITIES', 'ENTERTAINMENT', 'OTHER'),
  dateFrom: Joi.date().iso(),
  dateTo: Joi.date().iso(),
  sortBy: Joi.string().valid('date', 'amount', 'totalAmount', 'createdAt').default('date'),
  order: Joi.string().valid('asc', 'desc').default('desc'),
  q: Joi.string().trim().max(100)
});

// Calculate total with tax
const calcTotal = (amount, taxPercent) => {
  return parseFloat((amount + (amount * taxPercent / 100)).toFixed(2));
};

// Create new expense
router.post('/', async (req, res, next) => {
  try {
    const validation = expenseValidation.validate(req.body);
    if (validation.error) {
      validation.error.isJoi = true;
      return next(validation.error);
    }

    const { description, category, isRecurring, amount, taxPercent, date } = validation.value;
    const totalAmount = calcTotal(amount, taxPercent);

    const newExpense = await db.expense.create({
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
      message: 'Expense created',
      expense: newExpense
    });
  } catch (err) {
    next(err);
  }
});

// Get expenses with filters
router.get('/', async (req, res, next) => {
  try {
    const validation = queryValidation.validate(req.query);
    if (validation.error) {
      validation.error.isJoi = true;
      return next(validation.error);
    }

    const { page, limit, category, dateFrom, dateTo, sortBy, order, q } = validation.value;
    const skip = (page - 1) * limit;

    // Build filter conditions
    const filters = {
      userId: req.user.id
    };

    if (category) {
      filters.category = category;
    }

    if (dateFrom || dateTo) {
      filters.date = {};
      if (dateFrom) filters.date.gte = new Date(dateFrom);
      if (dateTo) filters.date.lte = new Date(dateTo);
    }

    if (q) {
      filters.description = {
        contains: q,
        mode: 'insensitive'
      };
    }

    // Get expenses and count
    const [expenses, totalCount] = await Promise.all([
      db.expense.findMany({
        where: filters,
        orderBy: { [sortBy]: order },
        skip,
        take: limit
      }),
      db.expense.count({ where: filters })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      expenses,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    next(err);
  }
});

// Get single expense
router.get('/:id', async (req, res, next) => {
  try {
    const expense = await db.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!expense) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    res.json({ expense });
  } catch (err) {
    next(err);
  }
});

// Update expense
router.put('/:id', async (req, res, next) => {
  try {
    const validation = expenseValidation.validate(req.body);
    if (validation.error) {
      validation.error.isJoi = true;
      return next(validation.error);
    }

    const { description, category, isRecurring, amount, taxPercent, date } = validation.value;
    const totalAmount = calcTotal(amount, taxPercent);

    // Check ownership
    const existing = await db.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    const updated = await db.expense.update({
      where: { id: req.params.id },
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
      message: 'Expense updated',
      expense: updated
    });
  } catch (err) {
    next(err);
  }
});

// Delete expense
router.delete('/:id', async (req, res, next) => {
  try {
    // Check ownership first
    const existing = await db.expense.findFirst({
      where: {
        id: req.params.id,
        userId: req.user.id
      }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Expense not found' });
    }

    await db.expense.delete({
      where: { id: req.params.id }
    });

    res.json({ message: 'Expense deleted' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
