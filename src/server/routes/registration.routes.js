const express = require('express');
const { protect } = require('../middleware/auth.middleware');
const {
  registerForEvent,
  getEventRegistrations
} = require('../controllers/registration.controller');

const router = express.Router();

router.use(protect);

router.post('/:id/register', registerForEvent);
router.get('/:id/registrations', getEventRegistrations);

module.exports = router;