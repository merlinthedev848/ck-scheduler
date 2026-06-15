const { roles } = require('../../config/app');

/**
 * Require the user to be authenticated.
 */
const requireAuth = (req, res, next) => {
  if (!req.session.user) {
    req.flash('error', 'Please log in to access that page.');
    return res.redirect('/login');
  }
  next();
};

/**
 * Require admin role.
 */
const requireAdmin = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  if (req.session.user.role !== roles.ADMIN) {
    req.flash('error', 'You do not have permission to access that page.');
    return res.redirect('/calendar');
  }
  next();
};

/**
 * Require admin or secretary role.
 */
const requireAdminOrSecretary = (req, res, next) => {
  if (!req.session.user) return res.redirect('/login');
  if (![roles.ADMIN, roles.SECRETARY].includes(req.session.user.role)) {
    req.flash('error', 'You do not have permission to access that page.');
    return res.redirect('/calendar');
  }
  next();
};

/**
 * Redirect already-logged-in users away from auth pages.
 */
const redirectIfAuthenticated = (req, res, next) => {
  if (req.session.user) return res.redirect('/calendar');
  next();
};

/**
 * API Key middleware for REST API.
 */
const requireApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key required. Pass X-Api-Key header.' });
  }
  const db = require('../../config/db');
  const user = await db('users').where({ api_token: apiKey, is_active: true }).first();
  if (!user) {
    return res.status(401).json({ error: 'Invalid API key.' });
  }
  req.apiUser = user;
  next();
};

module.exports = { requireAuth, requireAdmin, requireAdminOrSecretary, redirectIfAuthenticated, requireApiKey };
