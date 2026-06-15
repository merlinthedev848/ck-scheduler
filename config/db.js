require('dotenv').config();
const knex = require('knex');
const config = require('../knexfile');

const env = process.env.NODE_ENV || 'development';

let db;
if (process.env.SETUP_COMPLETED === 'true') {
  db = knex(config[env]);
} else {
  // Return a dummy proxy to prevent crash during require() tree if DB is not set
  db = new Proxy(function() {}, {
    get: function(target, prop) {
      return function() { throw new Error("Database not configured."); }
    },
    apply: function() { throw new Error("Database not configured."); }
  });
}

module.exports = db;
