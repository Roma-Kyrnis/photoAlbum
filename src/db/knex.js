const Knex = require('knex');

const { db: config } = require('../config');

const knex = new Knex(config);

module.exports = knex;
