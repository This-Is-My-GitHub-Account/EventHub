import asyncHandler from 'express-async-handler';
import * as registrationService from '../services/registration.service.js';

export const registerForEvent = asyncHandler(async (req, res) => {
  const { event_id, team_name, member_ids } = req.body;
  const leader_id = req.user.id;

  const team = await registrationService.registerTeamForEvent({ event_id, team_name, leader_id, member_ids });
  res.status(201).json(team);
});

export const getUserRegistrations = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const registrations = await registrationService.getUserRegistrations(userId);
  res.status(200).json(registrations);
});

export const getTeamsByEvent = asyncHandler(async (req, res) => {
  const { eventId } = req.params;
  const teams = await registrationService.getTeamsByEvent(eventId);
  res.status(200).json(teams);
});