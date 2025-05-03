import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validation.middleware.js';
import { eventSchema } from '../utils/validators.js';
import {
  createEvent,
  getEvents,
  getEventById,
  getEventsForCurrentUser,
  updateEvent,
  deleteEvent,
  getEventParticipationCount
} from '../controllers/event.controller.js';

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

router.route('/')
  .get(getEvents)
  .post(
    upload.single('file'),    // 1) parse multipart/form-data, populate req.file + req.body.eventData
    parseEventData,           // 2) JSON.parse(req.body.eventData) → req.body
    validate(eventSchema),    // 3) validate req.body against Joi schema
    createEvent               // 4) finally, your controller
  );

router.route("/myEvents")
  .get(getEventsForCurrentUser);

router.route('/:id')
  .get(getEventById)
  .put(validate(eventSchema), updateEvent)
  .delete(deleteEvent);

router.get('/:id/participation-count', getEventParticipationCount);

export default router;
