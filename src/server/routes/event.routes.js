const express = require('express');
const multer = require('multer');
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


// set up multer to store files in memory so we can get a Buffer
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // optional: limit to 5MB
});

// middleware to parse the JSON string field `eventData`
function parseEventData(req, res, next) {
  if (req.body.eventData) {
    try {
      // JSON.parse the field into req.body
      const parsed = JSON.parse(req.body.eventData);
      req.body = parsed;
    } catch (err) {
      return res.status(400).json({ message: 'Invalid JSON in eventData field' });
    }
  }
  next();
}
router.use(protect);
/**
 * @api {get} /api/events Get all events
 * @apiName GetEvents
 * @apiGroup Event
 *
 * @apiSuccess {Object[]} events List of all events.
 */
router.route('/')
  .get(getEvents)

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
  .post(
    upload.single('file'),    // 1) parse multipart/form-data, populate req.file + req.body.eventData
    parseEventData,           // 2) JSON.parse(req.body.eventData) → req.body
    validate(eventSchema),    // 3) validate req.body against Joi schema
    createEvent               // 4) finally, your controller
  );
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
