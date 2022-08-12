import messages from '_config/http/messages'
import { logger } from '_core/adapter/logger'
import * as Sentry from '@sentry/node'
import { AxiosError, AxiosResponse } from 'axios'

export type HttpClientError = AxiosError

export class HttpClientResponseError extends Error {
  status: number
  statusText: string
  message: string
  codeAsString?: string

  constructor(err: HttpClientError | HttpClientResponseError, codeAsString?: string) {
    super()
    this.name = this.constructor.name
    this.codeAsString = codeAsString
    this.message = err.message

    if (err instanceof HttpClientResponseError) {
      this.status = err.status
      this.statusText = err.statusText
    } else if (err.response) {
      this.message = this.mapData(err.response)
      this.status = err.response.status
      this.statusText = err.response.statusText
    }

    logger.error(`${this.name}: ${this.message} | status: ${this.status} | code_as_string: ${this.codeAsString}`)
    logger.trace(this.stack)
    Sentry.captureException(err)
  }

  private isRedBenxError(response: AxiosResponse): boolean {
    return response.data.error && response.data.error_description && response.data.message
  }

  private isExchangeError(response: AxiosResponse): boolean {
    return response.data.code && response.data.msg
  }

  private mapData(response: AxiosResponse): string {
    if (this.isRedBenxError(response)) {
      return messages.REDBENX.requestFailed(response.status, response.data.message)
    } else if (this.isExchangeError(response)) {
      return messages.EXCHANGE.requestFailed(response.data.code, response.data.msg)
    } else {
      return 'Request failed'
    }
  }
}
