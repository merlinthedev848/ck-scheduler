exports.up = async (knex) => {
  await knex.schema.createTable('settings', (t) => {
    t.increments('id').primary();
    t.string('name', 100).notNullable().unique();
    t.text('value');
    t.timestamps(true, true);
  });

  // Insert default settings
  await knex('settings').insert([
    { name: 'company_name',         value: 'CK Scheduler' },
    { name: 'company_email',        value: 'info@ckscheduler.com' },
    { name: 'company_phone',        value: '' },
    { name: 'company_address',      value: '' },
    { name: 'company_city',         value: '' },
    { name: 'company_zip',          value: '' },
    { name: 'company_logo',         value: '' },
    { name: 'date_format',          value: 'DD/MM/YYYY' },
    { name: 'time_format',          value: '24' },
    { name: 'first_weekday',        value: '1' },
    { name: 'booking_timeout',      value: '5' },
    { name: 'booking_cancellation', value: '1' },
    { name: 'require_captcha',      value: '0' },
    { name: 'stripe_enabled',       value: '0' },
    { name: 'stripe_pub_key',       value: '' },
    { name: 'stripe_secret_key',    value: '' },
    { name: 'stripe_webhook_secret',value: '' },
    { name: 'default_currency',     value: 'GBP' },
    { name: 'api_enabled',          value: '1' },
    { name: 'language',             value: 'en' },
    { name: 'timezone',             value: 'Europe/London' },
    { name: 'show_provider_col',    value: '1' },
    { name: 'terms_url',            value: '' },
    { name: 'privacy_url',          value: '' },
    { name: 'custom_css',           value: '' },
    { name: 'working_hours_per_day',value: '8' },
  ]);
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('settings');
};
