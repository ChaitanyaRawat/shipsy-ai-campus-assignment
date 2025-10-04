const errorHandler = (err, req, res, next) => {
  console.error('Error occurred:', err);

  // Prisma duplicate error
  if (err.code === 'P2002') {
    return res.status(400).json({
      error: 'Duplicate entry',
      details: 'This record already exists'
    });
  }

  // Prisma record not found
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Not found'
    });
  }

  // Joi validation errors
  if (err.isJoi) {
    return res.status(400).json({
      error: 'Validation failed',
      details: err.details.map(d => d.message)
    });
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      error: 'Token expired'
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Something went wrong'
  });
};

module.exports = { errorHandler };
