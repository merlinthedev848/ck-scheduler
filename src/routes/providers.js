const express = require('express');
const router = express.Router();
const ProvidersController = require('../controllers/ProvidersController');
const { requireAuth, requireAdmin } = require('../middleware/auth');

router.get('/',                requireAuth,  ProvidersController.index);
router.post('/',               requireAdmin, ProvidersController.create);
router.put('/:id',             requireAdmin, ProvidersController.update);
router.delete('/:id',          requireAdmin, ProvidersController.destroy);
router.get('/:id/working-plan',requireAuth,  ProvidersController.getWorkingPlan);
router.put('/:id/working-plan',requireAuth,  ProvidersController.saveWorkingPlan);

module.exports = router;
