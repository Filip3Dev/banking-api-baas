import { logger } from '_core/adapter/logger'

export class InterfaceException extends Error {
  message: string
  description?: string
  documentation?: string

  constructor(message: string, description?: string, documentation?: string) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.description = description
    this.documentation = documentation

    Error.captureStackTrace(this, this.constructor)

    logger.error(`${this.name}: ${this.message}`)
    logger.trace(this.stack)
  }
}
