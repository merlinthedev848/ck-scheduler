const CustomerModel = require('../models/Customer');

class CustomersController {
  static async index(req, res) {
    try {
      const { search, page = 1 } = req.query;
      const limit = 20;
      const offset = (page - 1) * limit;

      const customers = await CustomerModel.getAll({ search, limit, offset });
      const total = await CustomerModel.count(search);
      const totalPages = Math.ceil(total / limit);

      res.render('customers/index', {
        title: 'Customers — CK Scheduler',
        customers, search, page: parseInt(page), totalPages
      });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async show(req, res) {
    try {
      const customer = await CustomerModel.findById(req.params.id);
      if (!customer) return res.status(404).render('errors/404', { title: 'Not Found' });
      const appointments = await CustomerModel.getAppointments(customer.id);
      res.render('customers/show', { title: `${customer.first_name} ${customer.last_name}`, customer, appointments });
    } catch (e) { res.status(500).render('errors/500', { title: 'Error', message: e.message }); }
  }

  static async create(req, res) {
    try {
      await CustomerModel.create(req.body);
      req.flash('success', 'Customer created.');
      res.redirect('/customers');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/customers');
    }
  }

  static async update(req, res) {
    try {
      await CustomerModel.update(req.params.id, req.body);
      req.flash('success', 'Customer updated.');
      res.redirect(`/customers/${req.params.id}`);
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/customers/${req.params.id}`);
    }
  }

  static async destroy(req, res) {
    try {
      await CustomerModel.delete(req.params.id);
      req.flash('success', 'Customer deleted.');
      res.redirect('/customers');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/customers');
    }
  }
}

module.exports = CustomersController;
