const asyncHandler = require('express-async-handler');
const eventService = require('../services/event.service');

const createEvent = asyncHandler(async (req, res) => {
  const event = await eventService.createEvent(req.body, req.user.id);
  res.status(201).json(event);
});

const getEvents = asyncHandler(async (req, res) => {
  const filters = {
    type: req.query.type,
    department: req.query.department,
    category: req.query.category
  };
  const events = await eventService.getEvents(filters);
  res.json(events);
});

const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.json(event);
});

const getEventsForCurrentUser = asyncHandler(async (req, res) => {
  const events = await eventService.getCurrentUserEvents(req.user.id);
  res.json(events); 
});
const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
  res.json(event);
});

const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user.id);
  res.json({ message: 'Event deleted' });
});

module.exports = {
  createEvent,
  getEvents,
  getEventById,
  getEventsForCurrentUser,
  updateEvent,
  deleteEvent
};