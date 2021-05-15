const Koa = require('koa');
const helmet = require('koa-helmet');
const morgan = require('koa-morgan');
const bodyParser = require('koa-bodyparser');

const router = require('./router');
const { errorHandler } = require('./middleware');
const { server } = require('../config');
const log = require('../utils/logger')(__filename);

const app = new Koa();

app.use(helmet());
app.use(morgan(server.MORGAN_FORMAT));
app.use(errorHandler());
app.use(bodyParser());
app.use(router.routes()).use(router.allowedMethods());

let serverInstance;
function start() {
  serverInstance = app.listen(server.PORT, server.HOST, () => {
    log.info(`Server start on "http://${server.HOST}:${server.PORT}"`);
  });
}

function stop(callback) {
  if (serverInstance) serverInstance.close(callback);
}

module.exports = {
  start,
  stop,
};
