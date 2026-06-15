require('dotenv').config();
const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const path = require('path');

const app = express();

// ─── View Engine ─────────────────────────────────────────────────────────────
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'src/views'));

// ─── Static Files ─────────────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ─── Body Parsing ─────────────────────────────────────────────────────────────
// Raw body for Stripe webhooks MUST come before json parser
app.use('/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// ─── Session ──────────────────────────────────────────────────────────────────
app.use(session({
  secret: process.env.SESSION_SECRET || 'ck-scheduler-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: (parseInt(process.env.SESSION_TIMEOUT_HOURS) || 8) * 60 * 60 * 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production'
  }
}));

// ─── Flash Messages ───────────────────────────────────────────────────────────
app.use(flash());

// ─── Setup Middleware ─────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (process.env.SETUP_COMPLETED !== 'true') {
    if (req.path.startsWith('/setup') || req.path.match(/\.(css|js|png|jpg|svg)$/)) {
      return next();
    }
    return res.redirect('/setup');
  }
  next();
});

// ─── Global View Locals ───────────────────────────────────────────────────────
app.use((req, res, next) => {
  res.locals.user = req.session ? req.session.user : null;
  res.locals.success = req.flash ? req.flash('success') : [];
  res.locals.error = req.flash ? req.flash('error') : [];
  res.locals.appName = process.env.APP_NAME || 'CK Scheduler';
  res.locals.appUrl = process.env.APP_URL || `http://localhost:${process.env.APP_PORT || 3000}`;
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/setup', require('./src/routes/setup'));
app.use('/', require('./src/routes/auth'));
app.use('/booking', require('./src/routes/booking'));
app.use('/calendar', require('./src/routes/calendar'));
app.use('/appointments', require('./src/routes/appointments'));
app.use('/services', require('./src/routes/services'));
app.use('/providers', require('./src/routes/providers'));
app.use('/customers', require('./src/routes/customers'));
app.use('/settings', require('./src/routes/settings'));
app.use('/settings/webhooks', require('./src/routes/webhooks'));
app.use('/settings/coupons', require('./src/routes/coupons'));
app.use('/payments', require('./src/routes/payments'));
app.use('/api/v1', require('./src/routes/api/v1'));

// ─── Root Redirect ────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  if (req.session.user) return res.redirect('/calendar');
  res.redirect('/booking');
});

// ─── 404 Handler ─────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).render('errors/404', { title: 'Page Not Found' });
});

// ─── Error Handler ────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('errors/500', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'An unexpected error occurred.'
  });
});

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🗓️  CK Scheduler running at http://localhost:${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}\n`);
});

module.exports = app;
