const express = require('express');
const { validate } = require('../middleware/validation.middleware');
const { userSchema } = require('../utils/validators');
const { register, login, getUserIdByEmail, getProfile, updateProfile } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

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

/**
 * @api {get} /api/profile Get user profile
 * @apiName GetUserProfile
 * @apiGroup Profile
 *
 * @apiHeader {String} Authorization Bearer token for authentication.
 *
 * @apiSuccess {Object} user The complete user profile object.
 *
 * @apiError (Error 401) Unauthorized User is not authenticated.
 * @apiError (Error 404) NotFound The profile was not found.
 */
router.get('/profile', protect, getProfile);

/**
 * @api {put} /api/profile Update user profile
 * @apiName UpdateUserProfile
 * @apiGroup Profile
 *
 * @apiParam (Request body) {String} name Full name of the user.
 * @apiParam (Request body) {String} email Email address of the user.
 * @apiParam (Request body) {String} [phoneNumber] Phone number of the user.
 * @apiParam (Request body) {Date} [date_of_birth] User's date of birth.
 * @apiParam (Request body) {String} [gender] User's gender.
 * @apiParam (Request body) {String} [stream] Department or stream of the user.
 * @apiParam (Request body) {String} [passing_out_year] User's passing out year.
 * @apiParam (Request body) {String} [address] Address of the user.
 * @apiParam (Request body) {String} [bio] Bio of the user.
 *
 * @apiSuccess {Object} user The updated user object.
 *
 * @apiError (Error 400) ValidationError Some required fields are missing or invalid.
 * @apiError (Error 401) Unauthorized User is not authenticated.
 * @apiError (Error 404) NotFound The user was not found.
 */
router.put('/profile', protect, updateProfile);

module.exports = router;