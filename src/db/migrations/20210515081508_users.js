exports.up = async (knex) => {
  await knex.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').unique().notNullable().primary().defaultTo(knex.raw('uuid_generate_v4()'));
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email');
    table.string('password');
    table.string('facebook_id');
    table.string('google_id');

    table.string('refresh_token').nullable();

    table.unique('email', 'email_users_unique');
    table.unique('facebook_id', 'facebook_id_users_unique');
    table.unique('google_id', 'google_id_users_unique');

    table.timestamp('deleted_at').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('users');
  await knex.raw('DROP EXTENSION IF EXISTS "uuid-ossp"');
};
