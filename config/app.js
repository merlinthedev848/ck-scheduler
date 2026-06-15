module.exports = {
  appName: process.env.APP_NAME || 'CK Scheduler',
  appUrl: process.env.APP_URL || 'http://localhost:3000',
  appPort: parseInt(process.env.APP_PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || 'development',

  roles: {
    ADMIN: 'admin',
    PROVIDER: 'provider',
    SECRETARY: 'secretary'
  },

  appointmentStatus: {
    PENDING: 'pending',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
    PAID: 'paid'
  },

  paymentStatus: {
    PENDING: 'pending',
    PAID: 'paid',
    REFUNDED: 'refunded',
    FAILED: 'failed'
  },

  availabilityType: {
    FLEXIBLE: 'flexible',
    FIXED: 'fixed'
  },

  weekDays: ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'],

  defaultWorkingPlan: {
    monday:    { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    tuesday:   { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    wednesday: { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    thursday:  { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    friday:    { start: '09:00', end: '18:00', breaks: [{ start: '13:00', end: '14:00' }] },
    saturday:  null,
    sunday:    null
  },

  timezones: [
    'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'America/New_York',
    'America/Chicago', 'America/Denver', 'America/Los_Angeles',
    'America/Toronto', 'Australia/Sydney', 'Asia/Tokyo', 'Asia/Dubai'
  ]
};
