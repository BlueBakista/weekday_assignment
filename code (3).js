// src/app.js
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const { errorHandler, notFoundHandler } = require('./middlewares/errorMiddleware');
const mainRouter = require('./routes'); // This will point to src/routes/index.js

const app = express();

// Middlewares
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security-related HTTP headers
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')); // HTTP request logger
}
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// API Routes
app.use('/api/v1', mainRouter); // Prefix all routes with /api/v1

// Health check route
app.get('/health', (req, res) => res.status(200).json({ status: 'UP' }));

// Error Handling Middlewares (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;