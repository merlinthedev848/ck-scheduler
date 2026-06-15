const AppointmentModel = require('../models/Appointment');
const ServiceModel = require('../models/Service');
const UserModel = require('../models/User');

class CalendarController {
  static async index(req, res) {
    try {
      const services = await ServiceModel.getAll();
      let providers = [];
      if (req.session.user.role === 'provider') {
        providers = [await UserModel.findById(req.session.user.id)];
      } else {
        providers = await UserModel.findByRole('provider');
      }
      res.render('calendar/index', { title: 'Calendar — CK Scheduler', services, providers });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/');
    }
  }

  static async events(req, res) {
    try {
      const { start, end, providerId } = req.query;
      const appts = await AppointmentModel.getForCalendar({
        start: new Date(start),
        end:   new Date(end),
        providerId: req.session.user.role === 'provider' ? req.session.user.id : (providerId || null)
      });
      const events = appts.map(a => ({
        id: a.id,
        title: `${a.customer_first_name} ${a.customer_last_name} - ${a.service_name}`,
        start: a.start_datetime,
        end: a.end_datetime,
        color: a.service_color || '#3788d8',
        extendedProps: {
          customer: `${a.customer_first_name} ${a.customer_last_name}`,
          service: a.service_name,
          provider: `${a.provider_first_name} ${a.provider_last_name}`,
          status: a.status,
          hash: a.hash
        }
      }));
      res.json(events);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
}

module.exports = CalendarController;
