const WebhookModel = require('../models/Webhook');

class WebhookController {
  static async index(req, res) {
    try {
      const webhooks = await WebhookModel.getAll();
      res.render('settings/webhooks/index', { title: 'Webhooks', webhooks, path: '/settings/webhooks' });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/api');
    }
  }

  static async create(req, res) {
    res.render('settings/webhooks/form', { title: 'Create Webhook', webhook: {}, path: '/settings/webhooks' });
  }

  static async store(req, res) {
    try {
      let { name, url, secret_key, actions, is_active } = req.body;
      if (!Array.isArray(actions)) actions = actions ? [actions] : [];
      
      await WebhookModel.create({
        name,
        url,
        secret_key: secret_key || null,
        actions: JSON.stringify(actions),
        is_active: is_active === '1'
      });
      req.flash('success', 'Webhook created.');
      res.redirect('/settings/webhooks');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/webhooks/create');
    }
  }

  static async edit(req, res) {
    try {
      const webhook = await WebhookModel.findById(req.params.id);
      if (!webhook) return res.status(404).render('errors/404');
      if (typeof webhook.actions === 'string') webhook.actions = JSON.parse(webhook.actions);
      
      res.render('settings/webhooks/form', { title: 'Edit Webhook', webhook, path: '/settings/webhooks' });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/webhooks');
    }
  }

  static async update(req, res) {
    try {
      let { name, url, secret_key, actions, is_active } = req.body;
      if (!Array.isArray(actions)) actions = actions ? [actions] : [];

      await WebhookModel.update(req.params.id, {
        name,
        url,
        secret_key: secret_key || null,
        actions: JSON.stringify(actions),
        is_active: is_active === '1'
      });
      req.flash('success', 'Webhook updated.');
      res.redirect('/settings/webhooks');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/settings/webhooks/${req.params.id}/edit`);
    }
  }

  static async delete(req, res) {
    try {
      await WebhookModel.delete(req.params.id);
      req.flash('success', 'Webhook deleted.');
      res.redirect('/settings/webhooks');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/settings/webhooks');
    }
  }
}

module.exports = WebhookController;
