exports.up = async (knex) => {
  // Users (admins, providers, secretaries)
  await knex.schema.createTable('users', (t) => {
    t.increments('id').primary();
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('email', 255).notNullable().unique();
    t.string('password', 255).notNullable();
    t.string('phone', 30);
    t.string('mobile', 30);
    t.string('address', 255);
    t.string('city', 100);
    t.string('zip_code', 20);
    t.string('timezone', 100).defaultTo('Europe/London');
    t.string('language', 10).defaultTo('en');
    t.string('role', 20).notNullable().defaultTo('provider');
    t.text('notes');
    t.string('reset_token', 100);
    t.timestamp('reset_token_expires');
    t.string('api_token', 100);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // Service categories
  await knex.schema.createTable('service_categories', (t) => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.text('description');
    t.string('icon', 50).defaultTo('bi-calendar-check');
    t.timestamps(true, true);
  });

  // Services
  await knex.schema.createTable('services', (t) => {
    t.increments('id').primary();
    t.string('name', 150).notNullable();
    t.integer('duration').notNullable().defaultTo(60);
    t.decimal('price', 10, 2).defaultTo(0.00);
    t.string('currency', 3).defaultTo('GBP');
    t.string('location', 255);
    t.text('description');
    t.string('availabilities_type', 20).defaultTo('flexible');
    t.integer('attendants_number').defaultTo(1);
    t.boolean('requires_payment').defaultTo(false);
    t.integer('category_id').unsigned().references('id').inTable('service_categories').onDelete('SET NULL');
    t.timestamps(true, true);
  });

  // Provider <-> Service pivot
  await knex.schema.createTable('provider_services', (t) => {
    t.integer('provider_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.integer('service_id').unsigned().references('id').inTable('services').onDelete('CASCADE');
    t.primary(['provider_id', 'service_id']);
  });

  // Secretary <-> Provider pivot
  await knex.schema.createTable('secretary_providers', (t) => {
    t.integer('secretary_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.integer('provider_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.primary(['secretary_id', 'provider_id']);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('secretary_providers');
  await knex.schema.dropTableIfExists('provider_services');
  await knex.schema.dropTableIfExists('services');
  await knex.schema.dropTableIfExists('service_categories');
  await knex.schema.dropTableIfExists('users');
};
