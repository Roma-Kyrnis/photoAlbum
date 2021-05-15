const Router = require('koa-router');

const controller = require('../controller');
const {
  checkTokens: { access },
} = require('../middleware');
const config = require('../../config');

const router = new Router({
  prefix: config.server.prefix.ALBUMS,
});

router.post('Create album', '/', access(), controller.albums.create);
router.get('Get public albums', '/public', access(), controller.albums.getPublic);
router.get('Get user albums', '/', access(), controller.albums.getByUser);

router.post('Add photo to album', '/:id/photos', access(), controller.albums.createPhoto);

module.exports = router;
