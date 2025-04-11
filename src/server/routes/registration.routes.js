const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  registerForEvent,
  getUserRegistrations
} = require('../controllers/registration.controller');

const router = express.Router();

router.use(protect);

/**
* @api {post} /api/event-registration Register for an event
* @apiName RegisterForEvent
* @apiGroup EventRegistration*
* @apiParam (Request body) {UUID} event_id ID of the event.
* @apiParam (Request body) {String} team_name Name of the team.
* @apiParam (Request body) {UUID[]} member_ids Array of user IDs including leader and members.*
* @apiSuccess {Object} team The created team object with member entries.*
* @apiError (Error 400) ValidationError Missing or invalid data.
*/
router.post('/', registerForEvent);

/**
 * @api {get} /api/event-registration Get registrations for the current user
 * @apiName GetUserRegistrations
 * @apiGroup EventRegistration
 *
 * @apiSuccess {Object[]} events An array of event objects that the user is registered for.
 */
router.get('/', getUserRegistrations);


module.exports = router;
