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
      const { name, category_id, duration, price, description, requires_payment, custom_questions } = req.body;
      
      let parsedQuestions = null;
      if (custom_questions) {
         parsedQuestions = JSON.stringify(custom_questions.split(',').map(q => q.trim()).filter(q => q));
      }

      await ServiceModel.create({
        name,
        category_id: category_id || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        description,
        requires_payment: requires_payment ? true : false,
        custom_questions: parsedQuestions
      });
      req.flash('success', 'Service created successfully.');
      res.redirect('/services');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/services');
    }
  }

  static async update(req, res) {
    try {
      const { name, category_id, duration, price, description, requires_payment, custom_questions } = req.body;
      
      let parsedQuestions = null;
      if (custom_questions) {
         parsedQuestions = JSON.stringify(custom_questions.split(',').map(q => q.trim()).filter(q => q));
      }

      await ServiceModel.update(req.params.id, {
        name,
        category_id: category_id || null,
        duration: parseInt(duration),
        price: parseFloat(price),
        description,
        requires_payment: requires_payment ? true : false,
        custom_questions: parsedQuestions
      });
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
