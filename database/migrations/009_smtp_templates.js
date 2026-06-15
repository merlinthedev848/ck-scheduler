exports.up = async (knex) => {
  // Insert default SMTP and Email Templates settings
  await knex('settings').insert([
    { name: 'smtp_host', value: '' },
    { name: 'smtp_port', value: '587' },
    { name: 'smtp_user', value: '' },
    { name: 'smtp_pass', value: '' },
    { name: 'smtp_secure', value: '0' },
    { name: 'email_template_confirmation', value: '<h1>Booking Confirmed!</h1><p>Hi {{customer_name}},</p><p>Your booking for <b>{{service_name}}</b> on {{date}} at {{time}} is confirmed.</p><p>Thank you!</p>' },
    { name: 'email_template_cancellation', value: '<h1>Booking Cancelled</h1><p>Hi {{customer_name}},</p><p>Your booking for <b>{{service_name}}</b> has been cancelled.</p>' },
    { name: 'email_template_admin_notice', value: '<h1>New Booking!</h1><p>A new booking for <b>{{service_name}}</b> has been made by {{customer_name}}.</p>' }
  ]);
};

exports.down = async (knex) => {
  await knex('settings').whereIn('name', [
    'smtp_host', 'smtp_port', 'smtp_user', 'smtp_pass', 'smtp_secure', 
    'email_template_confirmation', 'email_template_cancellation', 'email_template_admin_notice'
  ]).del();
};
