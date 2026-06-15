const SettingModel = require('../models/Setting');
const UserModel = require('../models/User');

class SettingsController {
  static async general(req, res) {
    try {
      const settings = await SettingModel.getAll();
      res.render('settings/general', { title: 'General Settings', settings });
    } catch (e) { res.status(500).render('errors/500', { message: e.message }); }
  }

  static async saveGeneral(req, res) {
    try {
      const { company_name, company_email, company_link } = req.body;
      await SettingModel.setMany({ company_name, company_email, company_link });
      req.flash('success', 'General settings saved.');
      res.redirect('/settings/general');
    } catch (e) { req.flash('error', e.message); res.redirect('/settings/general'); }
  }

  static async business(req, res) {
    try {
      const settings = await SettingModel.getAll();
      res.render('settings/business', { title: 'Business Logic Settings', settings });
    } catch (e) { res.status(500).render('errors/500', { message: e.message }); }
  }

  static async saveBusiness(req, res) {
    try {
      const { working_hours_start, working_hours_end, display_any_provider } = req.body;
      await SettingModel.setMany({ working_hours_start, working_hours_end, display_any_provider: display_any_provider ? '1' : '0' });
      req.flash('success', 'Business settings saved.');
      res.redirect('/settings/business');
    } catch (e) { req.flash('error', e.message); res.redirect('/settings/business'); }
  }

  static async booking(req, res) {
    try {
      const settings = await SettingModel.getAll();
      res.render('settings/booking', { title: 'Booking Page Settings', settings });
    } catch (e) { res.status(500).render('errors/500', { message: e.message }); }
  }

  static async saveBooking(req, res) {
    try {
      const { primary_color, hide_prices, require_phone } = req.body;
      await SettingModel.setMany({ primary_color, hide_prices: hide_prices ? '1' : '0', require_phone: require_phone ? '1' : '0' });
      req.flash('success', 'Booking page settings saved.');
      res.redirect('/settings/booking');
    } catch (e) { req.flash('error', e.message); res.redirect('/settings/booking'); }
  }

  static async payments(req, res) {
    try {
      const settings = await SettingModel.getAll();
      res.render('settings/payments', { title: 'Payment Integration', settings });
    } catch (e) { res.status(500).render('errors/500', { message: e.message }); }
  }

  static async savePayments(req, res) {
    try {
      const keys = ['stripe_enabled', 'stripe_pub_key', 'stripe_secret_key', 'stripe_webhook_secret', 'paypal_enabled', 'paypal_client_id', 'paypal_client_secret', 'paypal_mode'];
      for (const k of keys) {
        let val = req.body[k] || '';
        if (k.endsWith('_enabled') && val !== '1') val = '0';
        await SettingModel.set(k, val);
      }
      req.flash('success', 'Payment settings saved.');
      res.redirect('/settings/payments');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/payments');
    }
  }

  static async notifications(req, res) {
    try {
      const settings = await SettingModel.getAll();
      res.render('settings/notifications', { title: 'Notification Settings', settings, path: '/settings/notifications' });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async saveNotifications(req, res) {
    try {
      const keys = [
        'sms_enabled', 'twilio_account_sid', 'twilio_auth_token', 'twilio_from_number',
        'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_secure',
        'email_template_confirmation', 'email_template_cancellation', 'email_template_admin_notice'
      ];
      for (const k of keys) {
        let val = req.body[k] || '';
        if ((k === 'sms_enabled' || k === 'smtp_secure') && val !== '1') val = '0';
        await SettingModel.set(k, val);
      }
      req.flash('success', 'Notification settings saved.');
      res.redirect('/settings/notifications');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/notifications');
    }
  }

  static async api(req, res) {
    try {
      res.render('settings/api', { title: 'API Access', user: req.session.user });
    } catch (e) { res.status(500).render('errors/500', { message: e.message }); }
  }

  static async regenerateApiToken(req, res) {
    try {
      const token = await UserModel.regenerateApiToken(req.session.user.id);
      req.session.user.api_token = token;
      req.flash('success', 'API Token regenerated.');
      res.redirect('/settings/api');
    } catch (e) { req.flash('error', e.message); res.redirect('/settings/api'); }
  }
}

module.exports = SettingsController;
