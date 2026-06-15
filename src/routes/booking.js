const express = require('express');
const router = express.Router();
const BookingController = require('../controllers/BookingController');

router.get('/',                          BookingController.index);
router.get('/providers/:serviceId',      BookingController.getProviders);
router.get('/slots/:providerId/:date',   BookingController.getSlots);
router.get('/available-dates/:providerId/:serviceId/:year/:month', BookingController.getAvailableDates);
router.post('/book',                     BookingController.book);
router.get('/confirm/:hash',             BookingController.confirm);
router.get('/cancel/:hash',              BookingController.showCancel);
router.post('/cancel/:hash',             BookingController.processCancel);

module.exports = router;
