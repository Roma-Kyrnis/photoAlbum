const {
  tables: { PHOTOS },
} = require('../config');

let knex;

async function create(newPhoto) {
  const [photo] = await knex(PHOTOS).insert(newPhoto).returning('*');

  return photo;
}

async function getById(id) {
  return await knex(PHOTOS).where({ id, deleted_at: null }).first();
}

async function getPublic(albumId) {
  return await knex(PHOTOS).where({ album_id: albumId, public: true, deleted_at: null });
}

async function getByAlbumId(albumId) {
  return await knex(PHOTOS).where({ album_id: albumId, deleted_at: null });
}

async function update({ id, ...updatedPhoto }) {
  updatedPhoto.updated_at = new Date();

  const [photo] = await knex(PHOTOS).where({ id }).update(updatedPhoto).returning('*');

  return photo;
}

async function remove(id) {
  await knex(PHOTOS).where({ id }).update({ deleted_at: new Date() });
}

module.exports = (instanceKnex) => {
  knex = instanceKnex;

  return { create, getById, getPublic, getByAlbumId, update, remove };
};
