// src/controllers/visaController.js
const VisaApplication = require('../models/VisaApplication');
// const User = require('../models/User'); // Not directly used here but good for context
const asyncHandler = require('express-async-handler');

// @desc    Create a new visa application
// @route   POST /api/v1/visas
// @access  Private
const createVisaApplication = asyncHandler(async (req, res) => {
  const { destinationCountry, visaType, documents, notes } = req.body;

  if (!destinationCountry || !visaType) {
    res.status(400);
    throw new Error('Destination country and visa type are required');
  }

  const application = await VisaApplication.create({
    user: req.user.id, // from protect middleware
    destinationCountry,
    visaType,
    documents,
    notes,
  });

  res.status(201).json(application);
});

// @desc    Get all visa applications for the logged-in user
// @route   GET /api/v1/visas
// @access  Private
const getUserVisaApplications = asyncHandler(async (req, res) => {
  const applications = await VisaApplication.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.json(applications);
});

// @desc    Get a single visa application by ID
// @route   GET /api/v1/visas/:id
// @access  Private
const getVisaApplicationById = asyncHandler(async (req, res) => {
  const application = await VisaApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Visa application not found');
  }

  // Ensure the user owns this application (or is an admin)
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('User not authorized to view this application');
  }

  res.json(application);
});

// @desc    Update a visa application
// @route   PUT /api/v1/visas/:id
// @access  Private
const updateVisaApplication = asyncHandler(async (req, res) => {
  const { destinationCountry, visaType, status, documents, notes } = req.body;
  let application = await VisaApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Visa application not found');
  }

  // Ensure the user owns this application (or is an admin)
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('User not authorized to update this application');
  }

  application.destinationCountry = destinationCountry || application.destinationCountry;
  application.visaType = visaType || application.visaType;
  application.status = status || application.status;
  application.documents = documents || application.documents;
  application.notes = notes || application.notes;

  const updatedApplication = await application.save();
  res.json(updatedApplication);
});

// @desc    Delete a visa application
// @route   DELETE /api/v1/visas/:id
// @access  Private
const deleteVisaApplication = asyncHandler(async (req, res) => {
  const application = await VisaApplication.findById(req.params.id);

  if (!application) {
    res.status(404);
    throw new Error('Visa application not found');
  }

  // Ensure the user owns this application (or is an admin)
  if (application.user.toString() !== req.user.id && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('User not authorized to delete this application');
  }

  await application.deleteOne(); // Mongoose v6+
  res.json({ message: 'Visa application removed' });
});

// --- Admin specific routes ---

// @desc    Get all visa applications (Admin only)
// @route   GET /api/v1/visas/admin/all
// @access  Private/Admin
const getAllVisaApplicationsAdmin = asyncHandler(async (req, res) => {
    const applications = await VisaApplication.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(applications);
});

// @desc    Update visa application status (Admin only)
// @route   PUT /api/v1/visas/admin/:id/status
// @access  Private/Admin
const updateVisaApplicationStatusAdmin = asyncHandler(async (req, res) => {
    const { status } = req.body;
    const application = await VisaApplication.findById(req.params.id);

    if (!application) {
        res.status(404);
        throw new Error('Visa application not found');
    }

    application.status = status || application.status;
    const updatedApplication = await application.save();
    res.json(updatedApplication);
});


module.exports = {
  createVisaApplication,
  getUserVisaApplications,
  getVisaApplicationById,
  updateVisaApplication,
  deleteVisaApplication,
  getAllVisaApplicationsAdmin,
  updateVisaApplicationStatusAdmin,
};