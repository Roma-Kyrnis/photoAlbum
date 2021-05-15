const db = require('../../db');
const { hash, authorizationTokens } = require('../../utils');

function registrationDTO(ctx) {
  const { first_name: firstName, last_name: lastName, email, password } = ctx.request.body;

  ctx.assert(firstName && typeof firstName === 'string', 400, 'Incorrect first_name');
  ctx.assert(lastName && typeof lastName === 'string', 400, 'Incorrect last_name');
  ctx.assert(email && /^\w+@[A-Za-z0-9]+\.[A-Za-z.]+$/.test(email), 400, 'Incorrect email');
  ctx.assert(
    password && /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{8,50}$/.test(password),
    400,
    'Incorrect password',
  );

  return { first_name: firstName, last_name: lastName, email, password };
}

async function singTokens(userId) {
  const accessToken = await authorizationTokens.generateAccessToken({ userId });
  const refreshToken = await authorizationTokens.generateRefreshToken({ userId });

  const hashedRefreshToken = hash.create(refreshToken);

  await db.users.update({ id: userId, refresh_token: hashedRefreshToken });

  return { access_token: accessToken, refresh_token: refreshToken };
}

async function registration(ctx) {
  const user = registrationDTO(ctx);

  const passwordHash = hash.create(user.password);
  user.password = passwordHash;

  const newUser = await db.users.create(user);

  ctx.status = 201;
  ctx.body = {
    id: newUser.id,
    last_name: newUser.last_name,
    first_name: newUser.first_name,
  };
}

async function login(ctx) {
  const { email, password } = ctx.request.body;
  ctx.assert(email, 400, 'No email');
  ctx.assert(password, 400, 'No password');

  const user = await db.users.getByEmail(email);
  ctx.assert(user, 403, 'Incorrect credentials');

  const passwordHash = hash.create(password);
  const isValidPassword = hash.compare(passwordHash, user.password);
  ctx.assert(isValidPassword, 403, 'Incorrect credentials');

  const tokens = await singTokens(user.id);

  ctx.body = tokens;
}

async function refresh(ctx) {
  const { authPayload } = ctx.state;
  const { refresh_token: userToken } = await db.users.getById(authPayload.userId);
  ctx.assert(userToken, 401, 'Incorrect user`s token');

  const isUserToken = hash.compare(hash.create(authPayload.token), userToken);
  ctx.assert(isUserToken, 401, 'Token deprecated');

  const tokens = await singTokens(authPayload.userId);

  ctx.body = tokens;
}

async function logout(ctx) {
  const { authPayload } = ctx.state;

  await db.users.update({ id: authPayload.userId, refresh_token: null });

  ctx.body = 'OK';
}

module.exports = { registration, login, refresh, logout };
