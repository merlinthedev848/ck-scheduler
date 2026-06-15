const UserModel = require('../models/User');
const EmailService = require('../services/EmailService');
const crypto = require('crypto');

class AuthController {
  static showLogin(req, res) {
    res.render('auth/login', { title: 'Login — CK Scheduler', layout: false });
  }

  static async login(req, res) {
    const { email, password } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (!user || !user.is_active) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      const valid = await UserModel.verifyPassword(user, password);
      if (!valid) {
        req.flash('error', 'Invalid email or password.');
        return res.redirect('/login');
      }
      req.session.user = UserModel.safe(user);
      res.redirect('/calendar');
    } catch (e) {
      req.flash('error', 'Login failed. Please try again.');
      res.redirect('/login');
    }
  }

  static logout(req, res) {
    req.session.destroy(() => res.redirect('/login'));
  }

  static showRecovery(req, res) {
    res.render('auth/recovery', { title: 'Password Recovery — CK Scheduler', layout: false, step: 'request' });
  }

  static async sendRecovery(req, res) {
    const { email } = req.body;
    try {
      const user = await UserModel.findByEmail(email);
      if (user) {
        const token = crypto.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour
        await UserModel.update(user.id, { reset_token: token, reset_token_expires: expires });
        const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/recovery/${token}`;
        await EmailService.sendPasswordReset(email, resetUrl);
      }
      // Always show success (prevents email enumeration)
      req.flash('success', 'If that email exists, a reset link has been sent.');
      res.redirect('/recovery');
    } catch (e) {
      req.flash('error', 'Failed to send recovery email.');
      res.redirect('/recovery');
    }
  }

  static async showReset(req, res) {
    const user = await UserModel.findByToken(req.params.token);
    if (!user || new Date(user.reset_token_expires) < new Date()) {
      req.flash('error', 'This reset link is invalid or has expired.');
      return res.redirect('/recovery');
    }
    res.render('auth/recovery', { title: 'Reset Password — CK Scheduler', layout: false, step: 'reset', token: req.params.token });
  }

  static async resetPassword(req, res) {
    const { password, password_confirm } = req.body;
    if (password !== password_confirm) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect(`/recovery/${req.params.token}`);
    }
    try {
      const user = await UserModel.findByToken(req.params.token);
      if (!user || new Date(user.reset_token_expires) < new Date()) {
        req.flash('error', 'Reset link expired.');
        return res.redirect('/recovery');
      }
      await UserModel.update(user.id, { password, reset_token: null, reset_token_expires: null });
      req.flash('success', 'Password updated. Please log in.');
      res.redirect('/login');
    } catch (e) {
      req.flash('error', 'Failed to reset password.');
      res.redirect(`/recovery/${req.params.token}`);
    }
  }
}

module.exports = AuthController;
