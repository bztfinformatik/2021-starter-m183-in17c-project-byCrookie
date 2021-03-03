const winston = require("winston");
const { createLogger, format, transports } = winston;
const { combine, timestamp, prettyPrint } = format;

const logger = createLogger({
  level: process.env.NODE_LOGLEVEL,
  levels: {
    production: 0,
    error: 1,
    warn: 2,
    info: 3,
    http: 4,
    verbose: 5,
    debug: 6,
    silly: 7
  },
  format: combine(timestamp(), prettyPrint()),
  transports: [new transports.File({ filename: process.env.NODE_LOGFILE })]
});

if (process.env.NODE_ENV !== "production") {
  logger.add(
    new transports.Console({
      level: "debug"
    })
  );
}

module.exports = logger;
