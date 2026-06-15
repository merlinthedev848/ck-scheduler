require('dotenv').config();

/** @type {Object.<string, import('knex').Knex.Config>} */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME || 'ck_scheduler',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      charset: 'utf8mb4'
    },
    pool: { min: 2, max: 10 },
    migrations: { directory: './database/migrations', tableName: 'knex_migrations' },
    seeds: { directory: './database/seeds' }
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT) || 3306,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      charset: 'utf8mb4',
      ssl: { rejectUnauthorized: false }
    },
    pool: { min: 2, max: 20 },
    migrations: { directory: './database/migrations', tableName: 'knex_migrations' },
    seeds: { directory: './database/seeds' }
  }
};
