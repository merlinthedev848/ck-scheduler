exports.up = async (knex) => {
  await knex.schema.createTable('payments', (t) => {
    t.increments('id').primary();
    t.integer('appointment_id').unsigned().notNullable().references('id').inTable('appointments').onDelete('CASCADE');
    t.string('stripe_payment_intent_id', 255);
    t.string('stripe_session_id', 255);
    t.decimal('amount', 10, 2).notNullable();
    t.string('currency', 3).notNullable().defaultTo('GBP');
    t.string('status', 20).notNullable().defaultTo('pending');
    t.json('stripe_metadata');
    t.timestamps(true, true);
    t.index('appointment_id');
    t.index('stripe_session_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('payments');
};
