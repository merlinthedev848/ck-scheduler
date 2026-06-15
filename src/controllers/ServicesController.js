const ServiceModel = require('../models/Service');
const ServiceCategoryModel = require('../models/ServiceCategory');

class ServicesController {
  static async index(req, res) {
    try {
      const services = await ServiceModel.getAll();
      const categories = await ServiceCategoryModel.getAll();
      res.render('services/index', { title: 'Services — CK Scheduler', services, categories });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async create(req, res) {
    try {
      await ServiceModel.create(req.body);
      req.flash('success', 'Service created.');
      res.redirect('/services');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/services');
    }
  }

  static async update(req, res) {
    try {
      await ServiceModel.update(req.params.id, req.body);
      req.flash('success', 'Service updated.');
      res.redirect('/services');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/services');
    }
  }

  static async destroy(req, res) {
    try {
      await ServiceModel.delete(req.params.id);
      req.flash('success', 'Service deleted.');
      res.redirect('/services');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/services');
    }
  }
}

module.exports = ServicesController;
