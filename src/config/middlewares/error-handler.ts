import { HttpClientResponseError } from '_config/http/errors'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { Request, Response, NextFunction } from 'express'

const parseDomainException = (exception: DomainException) => {
  return {
    status: exception.code,
    body: {
      code: exception.code,
      message: { ...exception, message: exception.message },
    },
  }
}

export async function errorHandlerMiddleware(
  error: Error,
  request: Request,
  response: Response,
  _next: NextFunction
): Promise<Response> {
  if (error instanceof DomainException) {
    const parsedError = parseDomainException(error)
    return response.status(parsedError.status || HttpStatusCode.INTERNAL_SERVER_ERROR).json(parsedError.body)
  } else if (error instanceof HttpClientResponseError) {
    return response
      .status(error.status || HttpStatusCode.INTERNAL_SERVER_ERROR)
      .json({ code: error.status, message: { ...error } })
  }

  return response.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: error.message })
}
