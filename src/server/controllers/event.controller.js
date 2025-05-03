import asyncHandler from 'express-async-handler';
import * as eventService from '../services/event.service.js';
import uploadEventImage from "../utils/uploadImage.js";

export const createEvent = asyncHandler(async (req, res) => {
  let imageUrl = null;

  if (req.file) {
    // pass the entire req.file object
    imageUrl = await uploadEventImage(req.file);
  }

  req.body.image_url = imageUrl;
  const event = await eventService.createEvent(req.body, req.user.id);
  res.status(201).json(event);
});

export const getEvents = asyncHandler(async (req, res) => {
  const filters = {
    type: req.query.type,
    department: req.query.department,
    category: req.query.category
  };
  const events = await eventService.getEvents(filters);
  res.json(events);
});

export const getEventById = asyncHandler(async (req, res) => {
  const event = await eventService.getEventById(req.params.id);
  res.json(event);
});

export const getEventsForCurrentUser = asyncHandler(async (req, res) => {
  const events = await eventService.getCurrentUserEvents(req.user.id);
  res.json(events); 
});

export const updateEvent = asyncHandler(async (req, res) => {
  const event = await eventService.updateEvent(req.params.id, req.body, req.user.id);
  res.json(event);
});

export const deleteEvent = asyncHandler(async (req, res) => {
  await eventService.deleteEvent(req.params.id, req.user.id);
  res.json({ message: 'Event deleted' });
});

export const getEventParticipationCount = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    res.status(400);
    throw new Error("Event ID is required");
  }

  const count = await eventService.getEventParticipationCount(id);

  res.status(200).json({ count });
});