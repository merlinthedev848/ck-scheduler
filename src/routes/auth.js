const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/AuthController');
const { redirectIfAuthenticated } = require('../middleware/auth');

router.get('/login',            redirectIfAuthenticated, AuthController.showLogin);
router.post('/login',           redirectIfAuthenticated, AuthController.login);
router.get('/logout',           AuthController.logout);
router.get('/recovery',         redirectIfAuthenticated, AuthController.showRecovery);
router.post('/recovery',        redirectIfAuthenticated, AuthController.sendRecovery);
router.get('/recovery/:token',  redirectIfAuthenticated, AuthController.showReset);
router.post('/recovery/:token', redirectIfAuthenticated, AuthController.resetPassword);

module.exports = router;
