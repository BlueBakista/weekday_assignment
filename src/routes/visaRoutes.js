// src/routes/visaRoutes.js
const express = require('express');
const {
  createVisaApplication,
  getUserVisaApplications,
  getVisaApplicationById,
  updateVisaApplication,
  deleteVisaApplication,
  getAllVisaApplicationsAdmin,
  updateVisaApplicationStatusAdmin
} = require('../controllers/visaController');
const { protect, authorize } = require('../middlewares/authMiddleware');

const router = express.Router();

// User routes
router.route('/')
  .post(protect, createVisaApplication)
  .get(protect, getUserVisaApplications);

router.route('/:id')
  .get(protect, getVisaApplicationById)
  .put(protect, updateVisaApplication)
  .delete(protect, deleteVisaApplication);

// Admin routes
router.get('/admin/all', protect, authorize('admin'), getAllVisaApplicationsAdmin);
router.put('/admin/:id/status', protect, authorize('admin'), updateVisaApplicationStatusAdmin);


module.exports = router;