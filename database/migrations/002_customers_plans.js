exports.up = async (knex) => {
  // Customers (separate from staff users)
  await knex.schema.createTable('customers', (t) => {
    t.increments('id').primary();
    t.string('first_name', 100).notNullable();
    t.string('last_name', 100).notNullable();
    t.string('email', 255).notNullable();
    t.string('phone', 30);
    t.string('mobile', 30);
    t.string('address', 255);
    t.string('city', 100);
    t.string('zip_code', 20);
    t.string('language', 10).defaultTo('en');
    t.string('timezone', 100).defaultTo('Europe/London');
    t.text('notes');
    t.timestamps(true, true);
    t.index('email');
  });

  // Working plans per provider
  await knex.schema.createTable('working_plans', (t) => {
    t.increments('id').primary();
    t.integer('provider_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.json('plan').notNullable();
    t.timestamps(true, true);
    t.unique('provider_id');
  });

  // Working plan exceptions (day overrides)
  await knex.schema.createTable('working_plan_exceptions', (t) => {
    t.increments('id').primary();
    t.integer('provider_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.date('date').notNullable();
    t.json('plan');
    t.timestamps(true, true);
    t.unique(['provider_id', 'date']);
  });

  // Blocked periods
  await knex.schema.createTable('blocked_periods', (t) => {
    t.increments('id').primary();
    t.integer('provider_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
    t.dateTime('start_datetime').notNullable();
    t.dateTime('end_datetime').notNullable();
    t.text('notes');
    t.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('blocked_periods');
  await knex.schema.dropTableIfExists('working_plan_exceptions');
  await knex.schema.dropTableIfExists('working_plans');
  await knex.schema.dropTableIfExists('customers');
};
