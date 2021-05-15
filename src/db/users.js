const {
  tables: { USERS },
} = require('../config');

let knex;

async function create(newUser) {
  const [user] = await knex(USERS).insert(newUser).returning('*');

  return user;
}

async function getById(id) {
  return await knex(USERS).where({ id, deleted_at: null }).first();
}

async function getByEmail(email) {
  return await knex(USERS).where({ email, deleted_at: null }).first();
}

async function update({ id, ...updatedUser }) {
  updatedUser.updated_at = new Date();

  const [user] = await knex(USERS).where({ id }).update(updatedUser).returning('*');

  return user;
}

module.exports = (instanceKnex) => {
  knex = instanceKnex;

  return { create, getById, getByEmail, update };
};
