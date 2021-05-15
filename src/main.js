const server = require('./server');
const { gracefulShutdown } = require('./utils');
const log = require('./utils/logger')(__filename);

async function boot() {
  gracefulShutdown(async (err) => {
    if (err) {
      log.fatal(err);
    }

    server.stop(() => {
      process.exit(1);
    });
  });

  await server.start();
}

boot();
