import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import pino from 'pino'

const ENV = process.env.NODE_ENV
const TEST_ENV = 'test'

const LOGGER_DATE_FORMAT = 'dd-mm-yyyy HH:MM:ss'

const pinoOptions = {
  level: ENV === TEST_ENV ? 'silent' : 'trace',
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: `SYS:${LOGGER_DATE_FORMAT}`,
      ignore: 'pid,hostname',
    },
  },
}

class PinoLogger implements Logger {
  constructor(private logger = pino(pinoOptions)) {}

  fatal(message: unknown): void {
    this.logger.fatal(message)
  }

  error(message: unknown): void {
    this.logger.error(message)
  }

  warn(message: unknown): void {
    this.logger.warn(message)
  }

  info(message: unknown): void {
    this.logger.info(message)
  }

  debug(message: unknown): void {
    this.logger.debug(message)
  }

  trace(message: unknown): void {
    this.logger.trace(message)
  }
}

export const logger = new PinoLogger()
