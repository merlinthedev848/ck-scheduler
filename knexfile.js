require('dotenv').config();

/** @type {Object.<string, import('knex').Knex.Config>} */
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.sqlite3'
    },
    useNullAsDefault: true,
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
