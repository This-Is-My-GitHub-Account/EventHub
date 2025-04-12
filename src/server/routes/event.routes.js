const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const { validate } = require('../middleware/validation.middleware');
const { eventSchema } = require('../utils/validators');
const {
  createEvent,
  getEvents,
  getEventById,
  getEventsForCurrentUser,
  updateEvent,
  deleteEvent,
  getEventParticipationCount
} = require('../controllers/event.controller');

const router = express.Router();

router.use(protect);

/**
 * @api {get} /api/events Get all events
 * @apiName GetEvents
 * @apiGroup Event
 *
 * @apiSuccess {Object[]} events List of all events.
 */
router.route('/')
  .get(getEvents);

/**
 * @api {post} /api/events Create a new event
 * @apiName CreateEvent
 * @apiGroup Event
 *
 * @apiParam (Request body) {String} title Event title.
 * @apiParam (Request body) {String} description Event description.
 * @apiParam (Request body) {Date} date Event date.
 *
 * @apiSuccess {Object} event The created event object.
 *
 * @apiError (Error 400) ValidationError Provided event data did not pass validation.
 */
router.route('/')
  .post(validate(eventSchema), createEvent);
  /**
   * @api {get} /api/events/my Get all events created by the current user
   * @apiName GetEventsForCurrentUser
   * @apiGroup Event
   *
   * @apiSuccess {Object[]} events List of all user-created events.
   */
router.route("/myEvents")
  .get(getEventsForCurrentUser);
/**
 * @api {get} /api/events/:id Get event by ID
 * @apiName GetEventById
 * @apiGroup Event
 *
 * @apiParam {String} id Event's unique ID.
 *
 * @apiSuccess {Object} event The event data.
 */
router.route('/:id')
  .get(getEventById);

/**
 * @api {put} /api/events/:id Update event
 * @apiName UpdateEvent
 * @apiGroup Event
 *
 * @apiParam {String} id Event's unique ID.
 * @apiParam (Request body) {String} [title] Event title.
 * @apiParam (Request body) {String} [description] Event description.
 * @apiParam (Request body) {Date} [date] Event date.
 *
 * @apiSuccess {Object} event The updated event data.
 *
 * @apiError (Error 400) ValidationError The provided data is invalid.
 */
router.route('/:id')
  .put(validate(eventSchema), updateEvent);

/**
 * @api {delete} /api/events/:id Delete event
 * @apiName DeleteEvent
 * @apiGroup Event
 *
 * @apiParam {String} id Event's unique ID.
 *
 * @apiSuccess {String} message Confirmation message.
 */
router.route('/:id')
  .delete(deleteEvent);

  /**
 * @api {get} /api/events/:id/participation-count Get event participation count
 * @apiName GetEventParticipationCount
 * @apiGroup Event
 *
 * @apiParam (URL Parameter) {UUID} id The ID of the event.
 *
 * @apiSuccess {Number} count The number of registrations (rows in team_members) for the event.
 *
 * @apiError (Error 400) BadRequest Event ID is missing or invalid.
 * @apiError (Error 404) NotFound No participation data found.
 */
router.get('/:id/participation-count', getEventParticipationCount);

module.exports = router;
