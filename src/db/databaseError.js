const { errors } = require('../config');

class DatabaseError extends Error {
  constructor(...params) {
    super(...params);

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, DatabaseError);
    }

    this.name = errors.DATABASE;
  }
}

function validateError(error) {
  if (error.constraint === 'email_users_unique') {
    throw new DatabaseError('Email already exist');
  }
  if (error.constraint === 'facebook_id_users_unique') {
    throw new DatabaseError('Facebook_id already exist');
  }
  if (error.constraint === 'google_id_users_unique') {
    throw new DatabaseError('Google_id already exist');
  }
  if (error.constraint === 'albums_fk0') {
    throw new DatabaseError('User does not exist');
  }
  if (error.constraint === 'photos_fk0') {
    throw new DatabaseError('Album does not exist');
  }

  throw error;
}

module.exports = { DatabaseError, validateError };
