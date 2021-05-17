require('dotenv').config();

const fatal = require('../utils/fatalError');

process.stdout.write(`Private key: ${process.env.FIREBASE_PRIVATE_KEY}`);

module.exports = {
  server: {
    PORT: Number(process.env.PORT) || 3000,
    HOST: process.env.HOST || 'localhost',
    prefix: {
      API_V1: '/api/v1',
      AUTH: '/auth',
      ALBUMS: '/albums',
    },
    NODE_ENV: process.env.NODE_ENV || 'production',
    MORGAN_FORMAT: 'dev',
    HASH_SECRET: process.env.HASH_SECRET || fatal('No HASH_SECRET'),
    tokens: {
      ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET || fatal('No ACCESS_TOKEN_SECRET'),
      ACCESS_TOKEN_LIFE: process.env.ACCESS_TOKEN_LIFE || fatal('No ACCESS_TOKEN_LIFE'),
      REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET || fatal('No REFRESH_TOKEN_SECRET'),
      REFRESH_TOKEN_LIFE: process.env.REFRESH_TOKEN_LIFE || fatal('No REFRESH_TOKEN_LIFE'),
    },
  },

  tables: {
    USERS: 'users',
    ALBUMS: 'albums',
    PHOTOS: 'photos',
  },

  errors: {
    DATABASE: 'DatabaseError',
    RESPONSE_ERROR_NAME: 'error',
  },

  db: {
    client: 'postgresql',
    connection: {
      user: process.env.POSTGRES_USER || fatal('POSTGRES_USER is not defined'),
      host: process.env.POSTGRES_HOST || fatal('DB_HOST is not defined'),
      port: Number(process.env.POSTGRES_PORT) || fatal('DB_PORT is not defined'),
      database: process.env.POSTGRES_DB || fatal('POSTGRES_DB is not defined'),
      password: process.env.POSTGRES_PASSWORD || fatal('POSTGRES_PASSWORD is not defined'),
    },
    pool: {
      min: 2,
      max: 10,
    },
    debug: process.env.NODE_ENV === 'development',
  },

  firebase: {
    storageBucker: process.env.FIREBASE_STORAGE_BUCKER || fatal('No FIREBASE_STORAGE_BUCKER'),
    serviceAccount: {
      type: process.env.FIREBASE_TYPE || fatal('No FIREBASE_TYPE'),
      project_id: process.env.FIREBASE_PROJECT_ID || fatal('No FIREBASE_PROJECT_ID'),
      private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID || fatal('No FIREBASE_PRIVATE_KEY_ID'),
      private_key: process.env.FIREBASE_PRIVATE_KEY || fatal('No FIREBASE_PRIVATE_KEY'),
      client_email: process.env.FIREBASE_CLIENT_EMAIL || fatal('No FIREBASE_CLIENT_EMAIL'),
      client_id: process.env.FIREBASE_CLIENT_ID || fatal('No FIREBASE_CLIENT_ID'),
      auth_uri: process.env.FIREBASE_AUTH_URI || fatal('No FIREBASE_AUTH_URI'),
      token_uri: process.env.FIREBASE_TOKEN_URI || fatal('No FIREBASE_TOKEN_URI'),
      auth_provider_x509_cert_url:
        process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL ||
        fatal('No FIREBASE_AUTH_PROVIDER_X509_CERT_URL'),
      client_x509_cert_url:
        process.env.FIREBASE_CLIENT_X509_CERT_URL || fatal('No FIREBASE_CLIENT_X509_CERT_URL'),
    },
  },

  photos: {
    URL_EXPIRES_AFTER: 60 * 60 * 1000, // one hour
  },
};
