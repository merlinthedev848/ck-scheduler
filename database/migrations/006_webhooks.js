exports.up = async (knex) => {
  await knex.schema.createTable('webhooks', (t) => {
    t.increments('id').primary();
    t.string('name', 100).notNullable();
    t.string('url', 512).notNullable();
    t.json('actions').notNullable();
    t.string('secret_key', 100);
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('webhooks');
};
