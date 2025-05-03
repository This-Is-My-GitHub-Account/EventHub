import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  registerForEvent,
  getUserRegistrations,
  getTeamsByEvent,
  checkUserEventRegistration
} from '../controllers/registration.controller.js';
import { validate } from '../middleware/validation.middleware.js';
import { teamSchema } from '../utils/validators.js';

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
router.post('/', validate(teamSchema), registerForEvent);

/**
 * @api {get} /api/event-registration Get registrations for the current user
 * @apiName GetUserRegistrations
 * @apiGroup EventRegistration
 *
 * @apiSuccess {Object[]} events An array of event objects that the user is registered for.
 */
router.get('/', getUserRegistrations);

/**
 * @api {get} /api/event-registration/:eventId Get all teams registered for an event
 * @apiName GetTeamsByEvent
 * @apiGroup EventRegistration
 *
 * @apiParam {UUID} eventId ID of the event.
 *
 * @apiSuccess {Object[]} teams An array of team objects registered for the event.
 */
router.get('/:eventId', getTeamsByEvent);
/**
 * @api {get} /api/event-registration/check-user/:userId/:eventId Check if a user is already registered for an event
 * @apiName CheckUserEventRegistration
 * @apiGroup EventRegistration
 *
 * @apiParam {UUID} userId ID of the user to check.
 * @apiParam {UUID} eventId ID of the event to check.
 *
 * @apiSuccess {Object} result Object with isRegistered boolean indicating if user is already registered.
 */
router.get('/check-user/:userId/:eventId', checkUserEventRegistration);

export default router;
