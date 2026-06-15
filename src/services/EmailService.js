const nodemailer = require('nodemailer');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const SettingModel = require('../models/Setting');
dayjs.extend(utc);

class EmailService {
  static async getSettings() {
    const s = await SettingModel.getAll();
    return {
      host: s.smtp_host || '',
      port: parseInt(s.smtp_port) || 587,
      secure: s.smtp_secure === '1',
      user: s.smtp_user || '',
      pass: s.smtp_pass || '',
      fromName: s.company_name || 'CK Scheduler',
      fromEmail: s.company_email || s.smtp_user || '',
      tpl_conf: s.email_template_confirmation || '',
      tpl_canc: s.email_template_cancellation || '',
      tpl_admin: s.email_template_admin_notice || ''
    };
  }

  static async getTransporter() {
    const s = await this.getSettings();
    if (!s.user || !s.host) return null;
    return nodemailer.createTransport({
      host: s.host, port: s.port, secure: s.secure,
      auth: { user: s.user, pass: s.pass }
    });
  }

  static formatAppt(appt) {
    return {
      service:  appt.service_name,
      provider: `${appt.provider_first_name} ${appt.provider_last_name}`,
      customer: `${appt.customer_first_name} ${appt.customer_last_name}`,
      date:     dayjs(appt.start_datetime).format('dddd, D MMMM YYYY'),
      time:     dayjs(appt.start_datetime).format('HH:mm'),
      location: appt.location || 'Online / TBC',
      hash:     appt.hash,
      start_datetime: appt.start_datetime,
      end_datetime: appt.end_datetime
    };
  }

  static parseTemplate(html, t) {
    if (!html) return '';
    let parsed = html;
    parsed = parsed.replace(/\{\{customer_name\}\}/g, t.customer);
    parsed = parsed.replace(/\{\{service_name\}\}/g, t.service);
    parsed = parsed.replace(/\{\{date\}\}/g, t.date);
    parsed = parsed.replace(/\{\{time\}\}/g, t.time);
    parsed = parsed.replace(/\{\{location\}\}/g, t.location);
    parsed = parsed.replace(/\{\{provider_name\}\}/g, t.provider);
    return parsed;
  }

  static async sendConfirmation(appt, appUrl) {
    const t = this.formatAppt(appt);
    const cancelUrl = `${appUrl}/booking/cancel/${t.hash}`;
    const s = await this.getSettings();

    let html = this.parseTemplate(s.tpl_conf, t);
    
    // Fallback if template is empty
    if (!html) {
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:28px">Appointment Confirmed ✓</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <p style="color:#374151;font-size:16px">Hi ${t.customer},</p>
            <p style="color:#374151">Your appointment has been confirmed. Here are your details:</p>
            <table style="width:100%;border-collapse:collapse;margin:24px 0">
              <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280;width:40%">Service</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.service}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280">Date</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.date}</td></tr>
              <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280">Time</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.time}</td></tr>
            </table>
          </div>
        </div>`;
    }

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//CK Scheduler//EN
BEGIN:VEVENT
UID:${t.hash}@ckscheduler.local
DTSTAMP:${dayjs().format('YYYYMMDDTHHmmss\\Z')}
DTSTART:${dayjs(t.start_datetime).utc().format('YYYYMMDDTHHmmss\\Z')}
DTEND:${dayjs(t.end_datetime).utc().format('YYYYMMDDTHHmmss\\Z')}
SUMMARY:${t.service} with ${t.provider}
LOCATION:${t.location}
END:VEVENT
END:VCALENDAR`;

    await this.send({
      to:      appt.customer_email,
      subject: `Appointment Confirmed — ${t.service} on ${t.date}`,
      html,
      attachments: [{
        filename: 'invite.ics',
        content: icsContent,
        contentType: 'text/calendar'
      }]
    });

    // Notify provider
    let adminHtml = this.parseTemplate(s.tpl_admin, t);
    if (!adminHtml) adminHtml = html.replace('Your appointment has been confirmed', `A new appointment has been booked with you`);
    
    await this.send({
      to:      appt.provider_email,
      subject: `New Appointment: ${t.customer} — ${t.service} on ${t.date}`,
      html:    adminHtml
    });
  }

  static async sendCancellation(appt) {
    const t = this.formatAppt(appt);
    const s = await this.getSettings();
    let html = this.parseTemplate(s.tpl_canc, t);

    if (!html) {
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:32px;text-align:center;border-radius:12px 12px 0 0">
            <h1 style="color:#fff;margin:0;font-size:28px">Appointment Cancelled</h1>
          </div>
          <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
            <p style="color:#374151">Hi ${t.customer},</p>
            <p style="color:#374151">Your appointment for <strong>${t.service}</strong> on <strong>${t.date} at ${t.time}</strong> has been cancelled.</p>
          </div>
        </div>`;
    }

    await this.send({ to: appt.customer_email, subject: `Appointment Cancelled — ${t.service}`, html });
  }

  static async sendPasswordReset(email, resetUrl) {
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:24px">Password Reset</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151">Click the button below to reset your password. This link expires in 1 hour.</p>
          <div style="text-align:center;margin:32px 0">
            <a href="${resetUrl}" style="background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:600;font-size:16px">Reset Password</a>
          </div>
          <p style="color:#6b7280;font-size:14px">If you didn't request this, please ignore this email.</p>
        </div>
      </div>`;

    await this.send({ to: email, subject: 'Reset Your CK Scheduler Password', html });
  }

  static async send({ to, subject, html, text, attachments }) {
    const s = await this.getSettings();
    if (!s.user || !s.host) {
      console.log(`[Email] Would send to: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      const transporter = await this.getTransporter();
      if(transporter) {
        await transporter.sendMail({ from: `"${s.fromName}" <${s.fromEmail}>`, to, subject, html, text, attachments });
      }
    } catch (err) {
      console.error('[Email] Failed to send:', err.message);
    }
  }
}

module.exports = EmailService;
