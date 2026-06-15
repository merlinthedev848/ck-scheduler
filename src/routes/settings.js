const express = require('express');
const router = express.Router();
const SettingsController = require('../controllers/SettingsController');
const { requireAdmin } = require('../middleware/auth');

router.get('/general',         requireAdmin, SettingsController.general);
router.post('/general',        requireAdmin, SettingsController.saveGeneral);
router.get('/business',        requireAdmin, SettingsController.business);
router.post('/business',       requireAdmin, SettingsController.saveBusiness);
router.get('/booking',         requireAdmin, SettingsController.booking);
router.post('/booking',        requireAdmin, SettingsController.saveBooking);
router.get('/payments',        requireAdmin, SettingsController.payments);
router.post('/payments',       requireAdmin, SettingsController.savePayments);
router.get('/api',             requireAdmin, SettingsController.api);
router.post('/api/regenerate', requireAdmin, SettingsController.regenerateApiToken);

module.exports = router;
