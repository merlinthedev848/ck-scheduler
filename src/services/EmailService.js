const nodemailer = require('nodemailer');
const dayjs = require('dayjs');

class EmailService {
  static getTransporter() {
    return nodemailer.createTransport({
      host:   process.env.SMTP_HOST   || 'smtp.gmail.com',
      port:   parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  static from() {
    const name  = process.env.MAIL_FROM_NAME  || 'CK Scheduler';
    const email = process.env.MAIL_FROM_EMAIL || process.env.SMTP_USER;
    return `"${name}" <${email}>`;
  }

  static formatAppt(appt) {
    return {
      service:  appt.service_name,
      provider: `${appt.provider_first_name} ${appt.provider_last_name}`,
      customer: `${appt.customer_first_name} ${appt.customer_last_name}`,
      date:     dayjs(appt.start_datetime).format('dddd, D MMMM YYYY'),
      time:     dayjs(appt.start_datetime).format('HH:mm'),
      location: appt.location || 'Online / TBC',
      hash:     appt.hash
    };
  }

  static async sendConfirmation(appt, appUrl) {
    const t = this.formatAppt(appt);
    const cancelUrl = `${appUrl}/booking/cancel/${t.hash}`;

    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#6366f1,#8b5cf6);padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:28px">Appointment Confirmed ✓</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;font-size:16px">Hi ${t.customer},</p>
          <p style="color:#374151">Your appointment has been confirmed. Here are your details:</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280;width:40%">Service</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.service}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280">Provider</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.provider}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280">Date</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.date}</td></tr>
            <tr><td style="padding:10px;border-bottom:1px solid #f3f4f6;color:#6b7280">Time</td><td style="padding:10px;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${t.time}</td></tr>
            <tr><td style="padding:10px;color:#6b7280">Location</td><td style="padding:10px;font-weight:600;color:#111827">${t.location}</td></tr>
          </table>
          <p style="margin-top:24px;text-align:center">
            <a href="${cancelUrl}" style="color:#ef4444;text-decoration:none;font-size:14px">Need to cancel? Click here</a>
          </p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px;text-align:center">CK Scheduler · This is an automated email</p>
        </div>
      </div>`;

    await this.send({
      to:      appt.customer_email,
      subject: `Appointment Confirmed — ${t.service} on ${t.date}`,
      html
    });

    // Notify provider
    await this.send({
      to:      appt.provider_email,
      subject: `New Appointment: ${t.customer} — ${t.service} on ${t.date}`,
      html:    html.replace('Your appointment has been confirmed', `A new appointment has been booked with you`)
    });
  }

  static async sendCancellation(appt) {
    const t = this.formatAppt(appt);
    const html = `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:linear-gradient(135deg,#ef4444,#f97316);padding:32px;text-align:center;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;margin:0;font-size:28px">Appointment Cancelled</h1>
        </div>
        <div style="background:#fff;padding:32px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151">Hi ${t.customer},</p>
          <p style="color:#374151">Your appointment for <strong>${t.service}</strong> on <strong>${t.date} at ${t.time}</strong> has been cancelled.</p>
          <p style="color:#6b7280;font-size:14px">If you'd like to rebook, please visit our booking page.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="color:#9ca3af;font-size:12px;text-align:center">CK Scheduler · This is an automated email</p>
        </div>
      </div>`;

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

  static async send({ to, subject, html, text }) {
    if (!process.env.SMTP_USER) {
      console.log(`[Email] Would send to: ${to} | Subject: ${subject}`);
      return;
    }
    try {
      const transporter = this.getTransporter();
      await transporter.sendMail({ from: this.from(), to, subject, html, text });
    } catch (err) {
      console.error('[Email] Failed to send:', err.message);
    }
  }
}

module.exports = EmailService;
