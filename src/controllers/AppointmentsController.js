const AppointmentModel = require('../models/Appointment');

class AppointmentsController {
  static async index(req, res) {
    try {
      const { status, search, page = 1 } = req.query;
      const limit = 20;
      const offset = (page - 1) * limit;

      const appts = await AppointmentModel.getAll({ limit, offset, search, status });
      res.render('appointments/index', { title: 'Appointments — CK Scheduler', appts, search, status, page: parseInt(page) });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async show(req, res) {
    try {
      const appt = await AppointmentModel.findById(req.params.id);
      if (!appt) return res.status(404).render('errors/404', { title: 'Not Found' });
      res.render('appointments/show', { title: 'Appointment Details', appt });
    } catch (e) { res.status(500).render('errors/500', { title: 'Error', message: e.message }); }
  }

  static async create(req, res) {
    try {
      await AppointmentModel.create(req.body);
      req.flash('success', 'Appointment created.');
      res.redirect('/appointments');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/appointments');
    }
  }

  static async update(req, res) {
    try {
      await AppointmentModel.update(req.params.id, req.body);
      req.flash('success', 'Appointment updated.');
      res.redirect(`/appointments/${req.params.id}`);
    } catch (e) {
      req.flash('error', e.message);
      res.redirect(`/appointments/${req.params.id}`);
    }
  }

  static async destroy(req, res) {
    try {
      await AppointmentModel.delete(req.params.id);
      req.flash('success', 'Appointment deleted.');
      res.redirect('/appointments');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/appointments');
    }
  }
}

module.exports = AppointmentsController;
