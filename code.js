// src/routes/index.js
const express = require('express');
const authRoutes = require('./authRoutes');
const visaRoutes = require('./visaRoutes');
// Import other route files here as you create them

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/visas', visaRoutes);
// router.use('/travel-info', travelInfoRoutes); // Example for future

module.exports = router;