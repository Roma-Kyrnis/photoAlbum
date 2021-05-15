exports.up = async (knex) => {
  await knex.schema.createTable('albums', (table) => {
    table.increments('id');
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.boolean('public').defaultTo(false).notNullable();
    table.string('main_photo');

    table.uuid('user_id').notNullable();

    table.foreign('user_id', 'albums_fk0').references('users.id');

    table.timestamp('deleted_at').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('albums');
};
