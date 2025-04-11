const asyncHandler = require('express-async-handler');
const registrationService = require('../services/registration.service');

const registerForEvent = asyncHandler(async (req, res) => {
  const { event_id, team_name, member_ids } = req.body;
  const leader_id = req.user.id;

  const team = await registrationService.registerTeamForEvent({ event_id, team_name, leader_id, member_ids });
  res.status(201).json(team);
});

const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const registrations = await registrationService.getUserRegistrations(userId);
  res.status(200).json(registrations);
});

module.exports = {
  registerForEvent,
  getUserRegistrations
};