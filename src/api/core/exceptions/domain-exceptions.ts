import { logger } from '_core/adapter/logger'
import { HttpStatusCode } from '_core/enums'
import { APIError } from '_core/exceptions/api-error'

export class DomainException extends Error implements APIError {
  message: string
  code: number
  codeAsString: string
  description?: string
  documentation?: string

  constructor(
    message: string,
    code = HttpStatusCode.BAD_REQUEST,
    codeAsString: string,
    description?: string,
    documentation?: string
  ) {
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.code = code
    this.codeAsString = codeAsString
    this.description = description
    this.documentation = documentation

    Error.captureStackTrace(this, this.constructor)

    logger.error(`${this.name}: ${this.message} | code: ${this.code} | code_as_string: ${this.codeAsString}`)
    logger.trace(this.stack)
  }
}
