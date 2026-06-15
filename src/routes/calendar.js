const express = require('express');
const router = express.Router();
const CalendarController = require('../controllers/CalendarController');
const { requireAuth } = require('../middleware/auth');

router.get('/',        requireAuth, CalendarController.index);
router.get('/events',  requireAuth, CalendarController.events);

module.exports = router;
