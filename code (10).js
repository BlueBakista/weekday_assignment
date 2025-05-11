// src/models/VisaApplication.js
const mongoose = require('mongoose');

const visaApplicationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  destinationCountry: {
    type: String,
    required: [true, 'Destination country is required'],
    trim: true,
  },
  visaType: {
    type: String,
    required: [true, 'Visa type is required (e.g., Tourist, Business)'],
    trim: true,
  },
  applicationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['Submitted', 'Processing', 'Approved', 'Rejected', 'Requires Action'],
    default: 'Submitted',
  },
  documents: [{
    name: String,
    url: String, // Could be a link to cloud storage
  }],
  notes: {
    type: String,
    trim: true,
  },
  // More fields: travelDates, passportNumber (encrypted), etc.
}, { timestamps: true });

const VisaApplication = mongoose.model('VisaApplication', visaApplicationSchema);
module.exports = VisaApplication;