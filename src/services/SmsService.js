const twilio = require('twilio');
const SettingModel = require('../models/Setting');
const dayjs = require('dayjs');

class SmsService {
  static async getClient() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID || await SettingModel.get('twilio_account_sid');
    const authToken = process.env.TWILIO_AUTH_TOKEN || await SettingModel.get('twilio_auth_token');
    
    if (!accountSid || !authToken) return null;
    return twilio(accountSid, authToken);
  }

  static async send({ to, body }) {
    try {
      const enabled = await SettingModel.get('sms_enabled');
      if (enabled !== '1') return;

      const client = await this.getClient();
      if (!client) return;

      const fromNumber = process.env.TWILIO_FROM_NUMBER || await SettingModel.get('twilio_from_number');
      if (!fromNumber) return;

      await client.messages.create({
        body,
        from: fromNumber,
        to
      });
      console.log(`[SMS] Sent to ${to}`);
    } catch (e) {
      console.error('[SMS] Failed to send:', e.message);
    }
  }

  static async sendConfirmation(appt) {
    if (!appt.customer_phone) return;
    const date = dayjs(appt.start_datetime).format('DD MMM YYYY');
    const time = dayjs(appt.start_datetime).format('HH:mm');
    const body = `Hi ${appt.customer_first_name}, your appointment for ${appt.service_name} on ${date} at ${time} is confirmed.`;
    await this.send({ to: appt.customer_phone, body });
  }

  static async sendCancellation(appt) {
    if (!appt.customer_phone) return;
    const date = dayjs(appt.start_datetime).format('DD MMM YYYY');
    const time = dayjs(appt.start_datetime).format('HH:mm');
    const body = `Hi ${appt.customer_first_name}, your appointment for ${appt.service_name} on ${date} at ${time} has been cancelled.`;
    await this.send({ to: appt.customer_phone, body });
  }
}

module.exports = SmsService;
