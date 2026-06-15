const UserModel = require('../models/User');
const ServiceModel = require('../models/Service');
const { WorkingPlanModel } = require('../models/WorkingPlan');

class ProvidersController {
  static async index(req, res) {
    try {
      const providers = await UserModel.findByRole('provider');
      const allServices = await ServiceModel.getAll();
      for (let p of providers) {
        p.services = await UserModel.getProviderServices(p.id);
      }
      res.render('providers/index', { title: 'Providers — CK Scheduler', providers, allServices });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async create(req, res) {
    try {
      const { services, ...data } = req.body;
      data.role = 'provider';
      const provider = await UserModel.create(data);
      if (services) await UserModel.setProviderServices(provider.id, [].concat(services));
      await WorkingPlanModel.createDefault(provider.id);
      req.flash('success', 'Provider created.');
      res.redirect('/providers');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/providers');
    }
  }

  static async update(req, res) {
    try {
      const { services, ...data } = req.body;
      if (!data.password) delete data.password;
      await UserModel.update(req.params.id, data);
      await UserModel.setProviderServices(req.params.id, services ? [].concat(services) : []);
      req.flash('success', 'Provider updated.');
      res.redirect('/providers');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/providers');
    }
  }

  static async destroy(req, res) {
    try {
      await UserModel.delete(req.params.id);
      req.flash('success', 'Provider deleted.');
      res.redirect('/providers');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/providers');
    }
  }

  static async getWorkingPlan(req, res) {
    try {
      const plan = await WorkingPlanModel.getByProvider(req.params.id);
      res.json(plan);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  static async saveWorkingPlan(req, res) {
    try {
      await WorkingPlanModel.upsert(req.params.id, req.body.plan);
      res.json({ message: 'Working plan saved.' });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }
}

module.exports = ProvidersController;
