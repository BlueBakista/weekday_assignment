// src/utils/asyncHandler.js
// This is a simple wrapper to avoid try-catch blocks in every async controller
const asyncHandler = fn => (req, res, next) =>
  Promise
    .resolve(fn(req, res, next))
    .catch(next);

module.exports = asyncHandler;