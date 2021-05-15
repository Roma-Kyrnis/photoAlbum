const Router = require('koa-router');

const config = require('../../config');

const router = new Router({
  prefix: config.server.prefix.API_V1,
});

const auth = require('./auth');
const albums = require('./albums');

router.use(auth.routes());
router.use(albums.routes());

module.exports = router;
