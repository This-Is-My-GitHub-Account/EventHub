const asyncHandler = require('express-async-handler');
const registrationService = require('../services/registration.service');

const registerForEvent = asyncHandler(async (req, res) => {
  const registration = await registrationService.registerForEvent(
    req.params.id,
    req.user.id
  );
  res.status(201).json(registration);
});

const getEventRegistrations = asyncHandler(async (req, res) => {
  const registrations = await registrationService.getEventRegistrations(
    req.params.id,
    req.user.id
  );
  res.json(registrations);
});

module.exports = {
  registerForEvent,
  getEventRegistrations
};