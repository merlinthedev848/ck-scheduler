const express = require('express');
const router = express.Router();
const AppointmentsController = require('../controllers/AppointmentsController');
const { requireAuth } = require('../middleware/auth');

router.get('/',         requireAuth, AppointmentsController.index);
router.get('/:id',      requireAuth, AppointmentsController.show);
router.post('/',        requireAuth, AppointmentsController.create);
router.put('/:id',      requireAuth, AppointmentsController.update);
router.delete('/:id',   requireAuth, AppointmentsController.destroy);

module.exports = router;
