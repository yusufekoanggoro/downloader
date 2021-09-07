const winston = require('winston');
const st = require('stack-trace');

const logger = new winston.Logger({
  // // thanks to https://github.com/winstonjs/winston/issues/1135
  // format: winston.format.combine(
  //   winston.format.timestamp(),
  //   winston.format.colorize(),
  //   winston.format.simple(),
  //   winston.format.printf((info) => {
  //     const {
  //       timestamp, level, message
  //     } = info;

  //     const ts = timestamp.slice(0, 19).replace('T', ' ');
  //     return `${ts} [${level}]: ${message} `;
  //   })
  // ),
  levels: {
    trace: 9,
    input: 8,
    verbose: 7,
    prompt: 6,
    debug: 5,
    info: 4,
    data: 3,
    help: 2,
    warn: 1,
    error: 0
  },
  transports: [new winston.transports.Console({
    level: 'info',
    handleExceptions: true,
    json: false,
    colorize: true
  })
  ],
  exitOnError: false
});

const log = (context, message, scope) => {
  const msg = `(${context}) - ${message} => [${st.get()[1].getFileName()}:${st.get()[1].getLineNumber()}]`;
  if (scope === 'error') {
    logger.error(msg);
  } else {
    logger.info(msg);
  }
};

module.exports = {
  log
};
