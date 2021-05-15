const {
  tables: { ALBUMS },
} = require('../config');

let knex;

async function create(newAlbum) {
  const [album] = await knex(ALBUMS).insert(newAlbum).returning('*');

  return album;
}

async function getById(id) {
  return await knex(ALBUMS).where({ id, deleted_at: null }).first();
}

async function getPublic() {
  return await knex(ALBUMS).where({ public: true, deleted_at: null });
}

async function getByUserId(userId) {
  return await knex(ALBUMS).where({ user_id: userId, deleted_at: null });
}

async function update({ id, ...updatedAlbum }) {
  updatedAlbum.updated_at = new Date();

  const [album] = await knex(ALBUMS).where({ id }).update(updatedAlbum).returning('*');

  return album;
}

async function remove(id) {
  await knex(ALBUMS).where({ id }).update({ deleted_at: new Date() });
}

module.exports = (instanceKnex) => {
  knex = instanceKnex;

  return { create, getById, getPublic, getByUserId, update, remove };
};
