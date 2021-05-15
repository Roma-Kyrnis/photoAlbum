const busboy = require('async-busboy');

const { firebase } = require('../../lib');
const { uploadImage } = require('../services');
const db = require('../../db');
const config = require('../../config');

async function getAlbumsWithPhotoUrl(albums) {
  const updatedAlbums = [];

  for await (const album of albums) {
    const file = firebase.getFileFromBucket(album.main_photo);
    album.main_photo_url = await file.getSignedUrl({
      action: 'read',
      expires: new Date(Date.now() + config.photos.URL_EXPIRES_AFTER),
    });

    updatedAlbums.push(album);
  }

  return updatedAlbums;
}

function isMainPhoto(file) {
  return file.fieldname === 'main_photo';
}

async function create(ctx) {
  const { authPayload } = ctx.state;

  const { files, fields } = await busboy(ctx.req);

  ctx.assert(fields.name, 400, 'Album name required');
  ctx.assert(fields.description, 400, 'Album description required');

  const album = {
    user_id: authPayload.userId,
    name: fields.name,
    description: fields.description,
    public: !!fields.public,
  };

  const readFileStream = files.find(isMainPhoto);
  if (readFileStream) {
    album.main_photo = await uploadImage(authPayload.userId, album.public, readFileStream);
  }

  const newAlbum = await db.albums.create(album);

  ctx.status = 201;
  ctx.body = {
    name: newAlbum.name,
    description: newAlbum.description,
    main_photo: newAlbum.main_photo,
    public: newAlbum.public,
  };
}

async function getByUser(ctx) {
  const { authPayload } = ctx.state;

  const albums = await db.albums.getByUserId(authPayload.userId);

  const updatedAlbums = await getAlbumsWithPhotoUrl(albums);

  ctx.body = { albums: updatedAlbums };
}

async function getPublic(ctx) {
  const albums = await db.albums.getPublic();

  const updatedAlbums = await getAlbumsWithPhotoUrl(albums);

  ctx.body = { albums: updatedAlbums };
}

async function createPhoto(ctx) {
  const { authPayload } = ctx.state;
  const { id: albumId } = ctx.params;

  const { files, fields } = await busboy(ctx.req);

  ctx.assert(fields.name, 400, 'No name');
  ctx.assert(fields.description, 400, 'No description');

  const readFileStream = files.find(isMainPhoto);
  ctx.assert(readFileStream, 400, 'No photo');
  const photo = {
    album_id: albumId,
    name: fields.name,
    description: fields.description,
    public: !!fields.public,
    firebase_name: readFileStream.filename,
  };

  await db.photos.create(photo);

  await uploadImage(authPayload.userId, photo.public, readFileStream);

  ctx.status = 201;
}

module.exports = {
  create,
  getByUser,
  getPublic,
  createPhoto,
};
