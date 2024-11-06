import pino from 'pino';

export type Logger = pino.Logger;

/**
 * createLogger()
 * LOG_LEVEL environment variable determines logging level
 * LOG_DEST environment variable determines log file location
 * @returns logger
 */
export default function createLogger(): Logger {
  const transports = pino.transport({
    targets: [
      {
        level: process.env.LOG_LEVEL,
        target: 'pino/file',
        options: {
          destination: process.env.LOG_DEST,
        },
      },
      {
        level: process.env.LOG_LEVEL,
        target: 'pino-pretty',
        options: {colorize: true},
      },
    ],
  });

  const logger = pino({}, transports);

  return logger;
}
