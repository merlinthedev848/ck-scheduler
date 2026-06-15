const express = require('express');
const router = express.Router();
const PaymentController = require('../controllers/PaymentController');
const { requireAdmin } = require('../middleware/auth');

// Stripe webhook — raw body required (set in server.js)
router.post('/webhook',         PaymentController.webhook);
router.get('/success',          PaymentController.success);
router.get('/cancel',           PaymentController.cancel);
router.post('/create-session',  PaymentController.createSession);
router.get('/history',          requireAdmin, PaymentController.history);
router.post('/refund/:id',      requireAdmin, PaymentController.refund);

module.exports = router;
