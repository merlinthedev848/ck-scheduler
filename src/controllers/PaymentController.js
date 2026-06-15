const PaymentModel = require('../models/Payment');
const AppointmentModel = require('../models/Appointment');
const StripeService = require('../services/StripeService');
const EmailService = require('../services/EmailService');
const WebhookService = require('../services/WebhookService');
const SettingModel = require('../models/Setting');
const PayPalService = require('../services/PayPalService');
const SmsService = require('../services/SmsService');

class PaymentController {
  static async webhook(req, res) {
    try {
      const signature = req.headers['stripe-signature'];
      const event = await StripeService.constructWebhookEvent(req.rawBody, signature);

      if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const apptId = session.metadata.appointment_id;

        // Update payment to paid
        await PaymentModel.updateBySessionId(session.id, {
          status: 'paid',
          stripe_payment_intent: session.payment_intent
        });

        // Update appointment to confirmed
        await AppointmentModel.updateStatus(apptId, 'confirmed');

        // Send confirmation emails and SMS
        const appt = await AppointmentModel.findById(apptId);
        await EmailService.sendConfirmation(appt, process.env.APP_URL || 'http://localhost:3000');
        await SmsService.sendConfirmation(appt);

        // Dispatch system webhook
        await WebhookService.dispatch('payment_success', { appointment: appt, session });
      }

      res.json({ received: true });
    } catch (e) {
      console.error('[Stripe Webhook Error]', e.message);
      res.status(400).send(`Webhook Error: ${e.message}`);
    }
  }

  static async success(req, res) {
    try {
      const { session_id } = req.query;
      const payment = await PaymentModel.findBySessionId(session_id);
      if (!payment) return res.status(404).render('errors/404');
      const appt = await AppointmentModel.findById(payment.appointment_id);
      const settings = await SettingModel.getAll();
      res.render('booking/confirmation', { title: 'Payment Successful', appt, settings, layout: false });
    } catch (e) { res.status(500).render('errors/500'); }
  }

  static async cancel(req, res) {
    try {
      const { appointment_hash } = req.query;
      const appt = await AppointmentModel.findByHash(appointment_hash);
      if (appt) {
        // If payment cancelled, delete the pending appointment and payment
        const payment = await PaymentModel.findByAppointment(appt.id);
        if (payment && payment.status === 'pending') {
          await PaymentModel.updateStatus(payment.id, 'failed');
          await AppointmentModel.delete(appt.id);
        }
      }
      res.render('booking/payment_cancel', { title: 'Payment Cancelled', layout: false });
    } catch (e) { res.status(500).render('errors/500'); }
  }

  static async paypalCapture(req, res) {
    try {
      const { token, appointment_hash } = req.query; // token is the paypal order ID
      const orderData = await PayPalService.captureOrder(token);
      
      if (orderData.status === 'COMPLETED') {
        const appt = await AppointmentModel.findByHash(appointment_hash);
        const payment = await PaymentModel.findByAppointment(appt.id);
        
        await PaymentModel.updateStatus(payment.id, 'paid');
        // We'll just update paypal_capture_id dynamically for now, or assume the model ignores unknown columns if not specified, but we created it. Let's do it safely:
        await AppointmentModel.updateStatus(appt.id, 'confirmed');

        const fullAppt = await AppointmentModel.findById(appt.id);
        await EmailService.sendConfirmation(fullAppt, process.env.APP_URL || 'http://localhost:3000');
        await SmsService.sendConfirmation(fullAppt);
        await WebhookService.dispatch('payment_success', { appointment: fullAppt, orderData });
        
        const settings = await SettingModel.getAll();
        res.render('booking/confirmation', { title: 'Payment Successful', appt: fullAppt, settings, layout: false });
      } else {
        res.redirect(`/payments/cancel?appointment_hash=${appointment_hash}`);
      }
    } catch (e) {
      console.error('[PayPal Capture Error]', e);
      res.redirect(`/payments/cancel?appointment_hash=${req.query.appointment_hash}`);
    }
  }

  static async createSession(req, res) {
    res.status(405).json({ error: 'Method not allowed directly' }); // Usually handled in BookingController
  }

  static async history(req, res) {
    try {
      const { page = 1 } = req.query;
      const limit = 20;
      const offset = (page - 1) * limit;

      const payments = await PaymentModel.getAll({ limit, offset });
      const totalRevenue = await PaymentModel.totalRevenue();

      res.render('payments/index', { title: 'Payment History', payments, totalRevenue, page: parseInt(page) });
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/calendar');
    }
  }

  static async refund(req, res) {
    try {
      const payment = await PaymentModel.findById(req.params.id);
      if (!payment || payment.status !== 'paid') {
        req.flash('error', 'Invalid payment for refund.');
        return res.redirect('/payments/history');
      }

      await StripeService.refund(payment.stripe_payment_intent);
      await PaymentModel.updateStatus(payment.id, 'refunded');

      req.flash('success', 'Refund issued successfully.');
      res.redirect('/payments/history');
    } catch (e) {
      req.flash('error', e.message);
      res.redirect('/payments/history');
    }
  }
}

module.exports = PaymentController;
