exports.up = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.string('gateway').defaultTo('stripe').after('appointment_id');
    table.string('paypal_order_id').nullable().after('stripe_payment_intent');
    table.string('paypal_capture_id').nullable().after('paypal_order_id');
  }).then(() => {
    // Insert default settings for PayPal and SMS
    return knex('settings').insert([
      { name: 'paypal_enabled', value: '0' },
      { name: 'paypal_client_id', value: '' },
      { name: 'paypal_client_secret', value: '' },
      { name: 'paypal_mode', value: 'sandbox' },
      { name: 'sms_enabled', value: '0' },
      { name: 'twilio_account_sid', value: '' },
      { name: 'twilio_auth_token', value: '' },
      { name: 'twilio_from_number', value: '' }
    ]);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('payments', function(table) {
    table.dropColumn('gateway');
    table.dropColumn('paypal_order_id');
    table.dropColumn('paypal_capture_id');
  }).then(() => {
    return knex('settings').whereIn('name', [
      'paypal_enabled', 'paypal_client_id', 'paypal_client_secret', 'paypal_mode',
      'sms_enabled', 'twilio_account_sid', 'twilio_auth_token', 'twilio_from_number'
    ]).delete();
  });
};
