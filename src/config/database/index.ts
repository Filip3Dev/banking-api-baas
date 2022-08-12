import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { Connection, createConnection } from 'typeorm'

export const loadConnection = (logger?: Logger): Promise<Connection> => {
  const connection = createConnection()

  if (logger) {
    logger.info('Loaded => database')
  }

  return connection
}
