const express = require('express');
const router = express.Router();
const CustomersController = require('../controllers/CustomersController');
const { requireAuth } = require('../middleware/auth');

router.get('/',       requireAuth, CustomersController.index);
router.get('/:id',    requireAuth, CustomersController.show);
router.post('/',      requireAuth, CustomersController.create);
router.put('/:id',    requireAuth, CustomersController.update);
router.delete('/:id', requireAuth, CustomersController.destroy);

module.exports = router;
