const knex = require('./knex');
const { validateError } = require('./databaseError');
const log = require('../utils/logger')(__filename);

const dbUsers = require('./users')(knex);
const dbAlbums = require('./albums')(knex);
const dbPhotos = require('./photos')(knex);

async function handle(resultFunction) {
  try {
    return await resultFunction;
  } catch (error) {
    log.error(error, 'Database error: ');
    return validateError(error);
  }
}

module.exports = {
  users: {
    create: (user) => handle(dbUsers.create(user)),
    getById: (email) => handle(dbUsers.getById(email)),
    getByEmail: (email) => handle(dbUsers.getByEmail(email)),
    update: (user) => handle(dbUsers.update(user)),
  },
  albums: {
    create: (album) => handle(dbAlbums.create(album)),
    getById: (id) => handle(dbAlbums.getById(id)),
    getByUserId: (userId) => handle(dbAlbums.getByUserId(userId)),
    getPublic: () => handle(dbAlbums.getPublic()),
    update: (album) => handle(dbAlbums.update(album)),
    remove: (id) => handle(dbAlbums.remove(id)),
  },
  photos: {
    create: (photo) => handle(dbPhotos.create(photo)),
    getById: (id) => handle(dbPhotos.getById(id)),
    getByUserId: (albumId) => handle(dbPhotos.getByAlbumId(albumId)),
    getPublic: (albumId) => handle(dbPhotos.getPublic(albumId)),
    update: (photo) => handle(dbPhotos.update(photo)),
    remove: (id) => handle(dbPhotos.remove(id)),
  },
};
