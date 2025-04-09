const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { eventSchema } = require('../utils/validators');
const {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(validate(eventSchema), createEvent);

router.route('/:id')
  .get(getEventById)
  .put(validate(eventSchema), updateEvent)
  .delete(deleteEvent);

module.exports = router;