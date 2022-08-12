import { logger } from '_core/adapter/logger'

export class ExportToCsvError extends Error {
  constructor(err: Error) {
    super()
    this.message = `Error trying to generate CSV file. Error: ${err.message}`
    this.name = this.constructor.name

    logger.error(`${this.name}: ${this.message}`)
    logger.trace(this.stack)
  }
}
