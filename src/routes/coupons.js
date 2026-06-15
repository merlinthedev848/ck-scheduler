const express = require('express');
const router = express.Router();
const CouponController = require('../controllers/CouponController');
const { requireAdmin } = require('../middleware/auth');

// Public validation endpoint for the checkout form
router.post('/validate', express.json(), CouponController.validate);

// Admin routes
router.use(requireAdmin);
router.get('/', CouponController.index);
router.get('/create', CouponController.create);
router.post('/', CouponController.store);
router.get('/:id/edit', CouponController.edit);
router.put('/:id', CouponController.update);
router.delete('/:id', CouponController.delete);

module.exports = router;
