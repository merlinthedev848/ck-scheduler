const ServiceModel = require('../models/Service');
const ServiceCategoryModel = require('../models/ServiceCategory');
const UserModel = require('../models/User');
const CustomerModel = require('../models/Customer');
const AppointmentModel = require('../models/Appointment');
const PaymentModel = require('../models/Payment');
const AvailabilityService = require('../services/AvailabilityService');
const StripeService = require('../services/StripeService');
const EmailService = require('../services/EmailService');
const WebhookService = require('../services/WebhookService');
const SmsService = require('../services/SmsService');
const SettingModel = require('../models/Setting');
const PayPalService = require('../services/PayPalService');
const dayjs = require('dayjs');

class BookingController {
  static async index(req, res) {
    try {
      const categories = await ServiceCategoryModel.getAll();
      const services = await ServiceModel.getAll();
      const settings = await SettingModel.getAll();
      res.render('booking/index', {
        title: `Book an Appointment — ${settings.company_name || 'CK Scheduler'}`,
        categories, services, settings, layout: false
      });
    } catch (e) {
      res.status(500).render('errors/500', { title: 'Error', message: e.message });
    }
  }

  static async getProviders(req, res) {
    try {
      const providers = await ServiceModel.getProvidersForService(req.params.serviceId);
      res.json(providers);
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  static async getAvailableDates(req, res) {
    try {
      const { providerId, serviceId, year, month } = req.params;
      const service = await ServiceModel.findById(serviceId);
      const dates = await AvailabilityService.getAvailableDates(
        parseInt(providerId),
        service.duration,
        parseInt(year),
        parseInt(month)
      );
      res.json({ dates });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  static async getSlots(req, res) {
    try {
      const { providerId, date } = req.params;
      const { serviceId } = req.query;
      const service = await ServiceModel.findById(serviceId);
      const slots = await AvailabilityService.getAvailableSlots(
        parseInt(providerId),
        service.duration,
        date
      );
      res.json({ slots });
    } catch (e) { res.status(500).json({ error: e.message }); }
  }

  static async book(req, res) {
    try {
      const { service_id, provider_id, date, time, first_name, last_name, email, phone, notes, gateway = 'stripe' } = req.body;

      const service  = await ServiceModel.findById(service_id);
      const provider = await UserModel.findById(provider_id);
      if (!service || !provider) return res.status(400).json({ error: 'Invalid service or provider.' });

      const startDt = dayjs(`${date} ${time}`, 'YYYY-MM-DD HH:mm').toDate();
      const endDt   = dayjs(startDt).add(service.duration, 'minute').toDate();

      // Check conflict
      const conflict = await AppointmentModel.checkConflict(provider_id, startDt, endDt);
      if (conflict) return res.status(409).json({ error: 'That time slot is no longer available.' });

      // Find or create customer
      const customer = await CustomerModel.findOrCreate({ first_name, last_name, email, phone: phone || null });

      // Create appointment (pending)
      const appointment = await AppointmentModel.create({
        start_datetime: startDt,
        end_datetime:   endDt,
        service_id:     parseInt(service_id),
        provider_id:    parseInt(provider_id),
        customer_id:    customer.id,
        status:         service.requires_payment ? 'pending' : 'confirmed',
        notes:          notes || null
      });

      // If service requires payment
      if (service.requires_payment && parseFloat(service.price) > 0) {
        const settings = await SettingModel.getAll();

        if (gateway === 'paypal' && settings.paypal_enabled === '1') {
          const order = await PayPalService.createOrder({
            appointment,
            service,
            appUrl: process.env.APP_URL || 'http://localhost:3000'
          });

          await PaymentModel.create({
            appointment_id: appointment.id,
            paypal_order_id: order.id,
            amount: service.price,
            currency: service.currency || 'GBP',
            status: 'pending',
            gateway: 'paypal'
          });

          const approveLink = order.links.find(link => link.rel === 'approve');
          return res.json({ redirect: approveLink.href });
        }

        if (gateway === 'stripe' && settings.stripe_enabled === '1') {
          const session = await StripeService.createCheckoutSession({
            appointment,
            service,
            customer,
            appUrl: process.env.APP_URL || 'http://localhost:3000'
          });
          
          await PaymentModel.create({
            appointment_id:   appointment.id,
            stripe_session_id: session.id,
            amount:            service.price,
            currency:          service.currency || 'GBP',
            status:            'pending',
            gateway:           'stripe'
          });
          return res.json({ redirect: session.url });
        }
        
        return res.status(400).json({ error: 'Selected payment gateway is not enabled.' });
      }

      // Free service — confirm immediately
      const fullAppt = await AppointmentModel.findById(appointment.id);
      await EmailService.sendConfirmation(fullAppt, process.env.APP_URL || 'http://localhost:3000');
      await SmsService.sendConfirmation(fullAppt);
      await WebhookService.dispatch('appointment_booked', fullAppt);
      return res.json({ redirect: `/booking/confirm/${appointment.hash}` });

    } catch (e) {
      console.error('[Booking]', e);
      res.status(500).json({ error: 'Booking failed. Please try again.' });
    }
  }

  static async confirm(req, res) {
    try {
      const appt = await AppointmentModel.findByHash(req.params.hash);
      if (!appt) return res.status(404).render('errors/404', { title: 'Not Found' });
      const settings = await SettingModel.getAll();
      res.render('booking/confirmation', { title: 'Appointment Confirmed', appt, settings, layout: false });
    } catch (e) { res.status(500).render('errors/500', { title: 'Error', message: e.message }); }
  }

  static async showCancel(req, res) {
    try {
      const appt = await AppointmentModel.findByHash(req.params.hash);
      if (!appt) return res.status(404).render('errors/404', { title: 'Not Found' });
      if (appt.status === 'cancelled') {
        return res.render('booking/cancellation', { title: 'Already Cancelled', appt, alreadyCancelled: true, settings: {}, layout: false });
      }
      const settings = await SettingModel.getAll();
      res.render('booking/cancellation', { title: 'Cancel Appointment', appt, alreadyCancelled: false, settings, layout: false });
    } catch (e) { res.status(500).render('errors/500', { title: 'Error', message: e.message }); }
  }

  static async processCancel(req, res) {
    try {
      const appt = await AppointmentModel.findByHash(req.params.hash);
      if (!appt || appt.status === 'cancelled') return res.redirect(`/booking/cancel/${req.params.hash}`);
      await AppointmentModel.updateStatus(appt.id, 'cancelled');
      const updatedAppt = await AppointmentModel.findById(appt.id);
      await EmailService.sendCancellation(updatedAppt);
      await SmsService.sendCancellation(updatedAppt);
      await WebhookService.dispatch('appointment_cancelled', updatedAppt);
      req.flash('success', 'Your appointment has been cancelled.');
      res.redirect(`/booking/cancel/${req.params.hash}`);
    } catch (e) { res.status(500).render('errors/500', { title: 'Error', message: e.message }); }
  }
}

module.exports = BookingController;
