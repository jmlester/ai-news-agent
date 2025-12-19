const buildApp = require('./app');
const config = require('./config/env');
const logger = require('./logger');

const app = buildApp();

app.listen(config.port, () => {
  logger.info(`AI News Agent listening on port ${config.port}`);
});
