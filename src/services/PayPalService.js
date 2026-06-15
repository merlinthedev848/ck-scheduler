const checkoutNodeJssdk = require('@paypal/checkout-server-sdk');
const SettingModel = require('../models/Setting');

class PayPalService {
  static async getClient() {
    const clientId = process.env.PAYPAL_CLIENT_ID || await SettingModel.get('paypal_client_id');
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET || await SettingModel.get('paypal_client_secret');
    const mode = process.env.PAYPAL_MODE || await SettingModel.get('paypal_mode') || 'sandbox';

    if (!clientId || !clientSecret) throw new Error('PayPal credentials not configured.');

    let environment;
    if (mode === 'live') {
      environment = new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
    } else {
      environment = new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
    }
    
    return new checkoutNodeJssdk.core.PayPalHttpClient(environment);
  }

  /**
   * Create a PayPal Order
   */
  static async createOrder({ appointment, service, appUrl }) {
    const client = await this.getClient();
    const currency = (service.currency || 'GBP').toUpperCase();

    const request = new checkoutNodeJssdk.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: appointment.hash,
        description: `Appointment: ${service.name}`,
        amount: {
          currency_code: currency,
          value: parseFloat(service.price).toFixed(2)
        }
      }],
      application_context: {
        return_url: `${appUrl}/payments/paypal/capture?appointment_hash=${appointment.hash}`,
        cancel_url: `${appUrl}/payments/cancel?appointment_hash=${appointment.hash}`,
        brand_name: process.env.APP_NAME || await SettingModel.get('company_name') || 'CK Scheduler',
        user_action: 'PAY_NOW'
      }
    });

    const response = await client.execute(request);
    return response.result;
  }

  /**
   * Capture a PayPal Order
   */
  static async captureOrder(orderId) {
    const client = await this.getClient();
    const request = new checkoutNodeJssdk.orders.OrdersCaptureRequest(orderId);
    request.requestBody({});
    const response = await client.execute(request);
    return response.result;
  }
}

module.exports = PayPalService;
