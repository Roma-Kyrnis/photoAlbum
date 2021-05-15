const Router = require('koa-router');

const controller = require('../controller');
const {
  checkTokens: { access, refresh },
} = require('../middleware');
const config = require('../../config');

const router = new Router({
  prefix: config.server.prefix.AUTH,
});

router.post('Registre user', '/registration', controller.auth.registration);
router.post('Login user by email and password', '/login', controller.auth.login);
router.get('Refresh authorization tokens', '/refresh', refresh(), controller.auth.refresh);
router.get('Refresh authorization tokens', '/logout', access(), controller.auth.logout);

module.exports = router;
