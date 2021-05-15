const {
  authorizationTokens: { verifyAccessToken, verifyRefreshToken },
} = require('../../utils');

function getToken(ctx) {
  const { authorization } = ctx.headers;
  if (authorization) {
    return authorization.split(' ')[1];
  }
  return false;
}

function access() {
  return async (ctx, next) => {
    try {
      const token = getToken(ctx);
      ctx.assert(token, 401, 'No authorization header');
      const payload = await verifyAccessToken(token);

      ctx.state.authPayload = payload;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

function refresh() {
  return async (ctx, next) => {
    try {
      const token = getToken(ctx);
      ctx.assert(token, 401, 'No authorization header');
      const payload = await verifyRefreshToken(token);
      payload.token = token;

      ctx.state.authPayload = payload;

      return next();
    } catch (err) {
      return ctx.throw(403, err);
    }
  };
}

module.exports = { access, refresh };
