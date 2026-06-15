exports.up = async (knex) => {
  await knex.schema.createTable('appointments', (t) => {
    t.increments('id').primary();
    t.dateTime('book_datetime').notNullable();
    t.dateTime('start_datetime').notNullable();
    t.dateTime('end_datetime').notNullable();
    t.string('location', 255);
    t.text('notes');
    t.string('hash', 64).notNullable().unique();
    t.string('status', 20).notNullable().defaultTo('pending');
    t.string('google_event_id', 255);
    t.integer('service_id').unsigned().notNullable().references('id').inTable('services').onDelete('CASCADE');
    t.integer('provider_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
    t.integer('customer_id').unsigned().notNullable().references('id').inTable('customers').onDelete('CASCADE');
    t.timestamps(true, true);
    t.index(['start_datetime', 'end_datetime']);
    t.index('provider_id');
    t.index('customer_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('appointments');
};
