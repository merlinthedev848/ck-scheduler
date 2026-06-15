const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const config = require('../../config/app');

exports.seed = async (knex) => {
  // Only seed if no admin exists
  const existing = await knex('users').where({ role: 'admin' }).first();
  if (existing) return;

  const password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'Admin123!', 12);

  // Create admin user
  const [adminId] = await knex('users').insert({
    first_name: process.env.ADMIN_FIRST_NAME || 'Admin',
    last_name:  process.env.ADMIN_LAST_NAME  || 'User',
    email:      process.env.ADMIN_EMAIL      || 'admin@ckscheduler.com',
    password,
    phone:      '07000000000',
    role:       'admin',
    timezone:   'Europe/London',
    language:   'en',
    is_active:  true,
    api_token:  uuidv4().replace(/-/g, '')
  });

  // Default service category
  const [catId] = await knex('service_categories').insert({
    name:        'General',
    description: 'General appointment services',
    icon:        'bi-calendar-check'
  });

  // Default services
  const [svc1Id] = await knex('services').insert({
    name:              'Consultation',
    duration:          60,
    price:             0.00,
    currency:          'GBP',
    description:       'A free 60-minute initial consultation.',
    availabilities_type: 'flexible',
    attendants_number: 1,
    requires_payment:  false,
    category_id:       catId
  });

  const [svc2Id] = await knex('services').insert({
    name:              'Full Session',
    duration:          90,
    price:             75.00,
    currency:          'GBP',
    description:       'A full 90-minute paid session.',
    availabilities_type: 'flexible',
    attendants_number: 1,
    requires_payment:  true,
    category_id:       catId
  });

  // Create a default provider
  const providerPassword = await bcrypt.hash('Provider123!', 12);
  const [providerId] = await knex('users').insert({
    first_name: 'Jane',
    last_name:  'Smith',
    email:      'jane.smith@ckscheduler.com',
    password:   providerPassword,
    phone:      '07111111111',
    role:       'provider',
    timezone:   'Europe/London',
    language:   'en',
    is_active:  true,
    api_token:  uuidv4().replace(/-/g, '')
  });

  // Assign services to provider
  await knex('provider_services').insert([
    { provider_id: providerId, service_id: svc1Id },
    { provider_id: providerId, service_id: svc2Id }
  ]);

  // Default working plan
  const defaultPlan = {
    monday:    { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    tuesday:   { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    wednesday: { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    thursday:  { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    friday:    { start: '09:00', end: '17:00', breaks: [{ start: '13:00', end: '14:00' }] },
    saturday:  null,
    sunday:    null
  };

  await knex('working_plans').insert({
    provider_id: providerId,
    plan:        JSON.stringify(defaultPlan)
  });

  console.log('✅ Database seeded successfully');
  console.log(`   Admin: ${process.env.ADMIN_EMAIL || 'admin@ckscheduler.com'}`);
  console.log(`   Provider: jane.smith@ckscheduler.com`);
};
