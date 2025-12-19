const LEVELS = ['debug', 'info', 'warn', 'error'];
const envLevel = process.env.LOG_LEVEL || 'info';
const levelIndex = LEVELS.indexOf(envLevel) >= 0 ? LEVELS.indexOf(envLevel) : LEVELS.indexOf('info');

const formatMessage = (level, message, meta) => {
  const timestamp = new Date().toISOString();
  const metaString = meta ? ` ${JSON.stringify(meta)}` : '';
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaString}`;
};

const logger = LEVELS.reduce((acc, level, index) => {
  acc[level] = (message, meta) => {
    if (index < levelIndex) return;
    const text = formatMessage(level, message, meta);
    if (level === 'error') {
      console.error(text);
    } else if (level === 'warn') {
      console.warn(text);
    } else {
      console.log(text);
    }
  };
  return acc;
}, {});

module.exports = logger;
