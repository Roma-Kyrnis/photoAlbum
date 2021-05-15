exports.up = async (knex) => {
  await knex.schema.createTable('photos', (table) => {
    table.increments('id');
    table.string('firebase_name').notNullable();
    table.string('name').notNullable();
    table.text('description').notNullable();
    table.boolean('public').defaultTo(false).notNullable();

    table.integer('album_id').notNullable();

    table.foreign('album_id', 'photos_fk0').references('albums.id');

    table.timestamp('deleted_at').defaultTo(null);
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTable('photos');
};
