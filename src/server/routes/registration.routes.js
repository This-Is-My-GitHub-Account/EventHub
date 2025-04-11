const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  registerForEvent,
  getEventRegistrations
} = require('../controllers/registration.controller');

const router = express.Router();

router.use(protect);

/**
 * @api {post} /api/registrations/:id/register Register for an event
 * @apiName RegisterForEvent
 * @apiGroup Registration
 *
 * @apiParam {String} id Event's unique ID.
 * @apiParam (Request body) {Object} registrationData Data needed for registration.
 *
 * @apiSuccess {String} message Success message.
 *
 * @apiError (Error 400) Error Registration failed.
 */
router.post('/register/:id', registerForEvent);

/**
 * @api {get} /api/registrations/:id/registrations Get event registrations
 * @apiName GetEventRegistrations
 * @apiGroup Registration
 *
 * @apiParam {String} id Event's unique ID.
 *
 * @apiSuccess {Object[]} registrations List of registrations for the event.
 *
 * @apiError (Error 404) NotFound No registrations found for the event.
 */
router.get('/registrations/:id', getEventRegistrations);

module.exports = router;
