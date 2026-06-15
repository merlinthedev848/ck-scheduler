const Stripe = require('stripe');
const SettingModel = require('../models/Setting');

class StripeService {
  static async getClient() {
    const secretKey = process.env.STRIPE_SECRET_KEY || await SettingModel.get('stripe_secret_key');
    if (!secretKey) throw new Error('Stripe secret key not configured.');
    return new Stripe(secretKey, { apiVersion: '2023-10-16' });
  }

  /**
   * Create a Stripe Checkout Session for an appointment.
   */
  static async createCheckoutSession({ appointment, service, customer, appUrl }) {
    const stripe = await this.getClient();
    const currency = (service.currency || 'GBP').toLowerCase();
    const amountPence = Math.round(parseFloat(service.price) * 100);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency,
          product_data: {
            name: service.name,
            description: `Appointment on ${new Date(appointment.start_datetime).toLocaleDateString('en-GB', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}`
          },
          unit_amount: amountPence
        },
        quantity: 1
      }],
      customer_email: customer.email,
      metadata: {
        appointment_id: String(appointment.id),
        appointment_hash: appointment.hash
      },
      success_url: `${appUrl}/payments/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${appUrl}/payments/cancel?appointment_hash=${appointment.hash}`,
      expires_at:  Math.floor(Date.now() / 1000) + (30 * 60) // 30 min
    });

    return session;
  }

  /**
   * Verify and construct a webhook event.
   */
  static async constructWebhookEvent(rawBody, signature) {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || await SettingModel.get('stripe_webhook_secret');
    const stripe = await this.getClient();
    return stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  }

  /**
   * Issue a refund for a payment intent.
   */
  static async refund(paymentIntentId) {
    const stripe = await this.getClient();
    return stripe.refunds.create({ payment_intent: paymentIntentId });
  }
}

module.exports = StripeService;
