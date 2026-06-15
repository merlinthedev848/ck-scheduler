const express = require('express');
const router = express.Router();
const ServicesController = require('../controllers/ServicesController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/',       requireAuth,  ServicesController.index);
router.post('/',      requireAdmin, ServicesController.create);
router.put('/:id',    requireAdmin, ServicesController.update);
router.delete('/:id', requireAdmin, ServicesController.destroy);

module.exports = router;
