const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/WebhookController');
const { requireAdmin } = require('../middleware/auth');

router.use(requireAdmin);

router.get('/', WebhookController.index);
router.get('/create', WebhookController.create);
router.post('/', WebhookController.store);
router.get('/:id/edit', WebhookController.edit);
router.put('/:id', WebhookController.update);
router.delete('/:id', WebhookController.delete);

module.exports = router;
