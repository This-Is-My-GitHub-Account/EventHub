const express = require('express');
const { validate } = require('../middleware/validation.middleware');
const { userSchema } = require('../utils/validators');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

/**
 * @api {post} /api/auth/register Register a new user
 * @apiName RegisterUser
 * @apiGroup Auth
 *
 * @apiParam (Request body) {String} email User's email address.
 * @apiParam (Request body) {String} password User's password.
 * @apiParam (Request body) {String} [name] Optional full name.
 *
 * @apiSuccess {String} id The unique ID of the created user.
 * @apiSuccess {String} email The registered email address.
 *
 * @apiError (Error 400) ValidationError The request data did not pass validation.
 */
router.post('/register', validate(userSchema), register);

/**
 * @api {post} /api/auth/login Log in a user
 * @apiName LoginUser
 * @apiGroup Auth
 *
 * @apiParam (Request body) {String} email User's email address.
 * @apiParam (Request body) {String} password User's password.
 *
 * @apiSuccess {String} token The authentication token.
 * @apiSuccess {String} id The unique ID of the logged-in user.
 *
 * @apiError (Error 401) Unauthorized Incorrect email or password.
 */
router.post('/login', login);


/**
 * @api {get} /api/users/by-email Fetch user by email address
 * @apiName GetUserByEmail
 * @apiGroup User
 *
 * @apiParam (Query) {String} email User email address.
 *
 * @apiSuccess {Object} user Contains the user ID and email.
 *
 * @apiError (Error 400) BadRequest Email query parameter is required.
 * @apiError (Error 404) NotFound No user found with the given email.
 */
router.get('/by-email', getUserIdByEmail);
module.exports = router;
