exports.up = async (knex) => {
  // 1. Create coupons table
  await knex.schema.createTable('coupons', (t) => {
    t.increments('id').primary();
    t.string('code', 50).notNullable().unique();
    t.enum('type', ['percentage', 'fixed']).defaultTo('percentage');
    t.decimal('discount', 10, 2).notNullable();
    t.integer('usage_limit').nullable();
    t.integer('used_count').defaultTo(0);
    t.timestamp('expires_at').nullable();
    t.boolean('is_active').defaultTo(true);
    t.timestamps(true, true);
  });

  // 2. Add columns to appointments table
  await knex.schema.alterTable('appointments', (t) => {
    t.integer('coupon_id').unsigned().references('id').inTable('coupons').onDelete('SET NULL');
    t.json('custom_fields').nullable();
  });

  // 3. Add custom_questions to services table
  await knex.schema.alterTable('services', (t) => {
    t.json('custom_questions').nullable();
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('services', (t) => {
    t.dropColumn('custom_questions');
  });

  await knex.schema.alterTable('appointments', (t) => {
    t.dropColumn('custom_fields');
    t.dropColumn('coupon_id');
  });

  await knex.schema.dropTableIfExists('coupons');
};
