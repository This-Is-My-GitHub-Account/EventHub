const express = require('express');
const { validate } = require('../middleware/validation.middleware');
const { userSchema } = require('../utils/validators');
const { register, login } = require('../controllers/auth.controller');

const router = express.Router();

router.post('/register', validate(userSchema), register);
router.post('/login', login);

module.exports = router;