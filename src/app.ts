import { logger as pinoLogger } from '_core/adapter/logger'
import express from 'express'
import 'reflect-metadata'
import SocketIO from 'socket.io'

let app: Application | null = null
class Application {
  public project: string
  public http: express.Application
  public io: SocketIO
  private constants

  constructor(private logger = pinoLogger) {
    // SETTINGS
    this.project = 'redbenx-banking'
  }

  public async init(): Promise<void> {
    await this.config()

    // DATABASE
    const { loadConnection } = await import('_config/database')
    loadConnection(this.logger)

    // INTERFACES
    const { loadInterfaces } = await import('_interfaces')
    const { http, socketIO } = loadInterfaces(this.logger)
    this.http = http
    this.io = socketIO

    await this.configureRoutes()
    await this.configureErrorHandler()

    if (this.constants.ENV !== 'test') {
      this.http.listen(this.constants.PORT)
    }

    this.logger.info(`Interfaces on PORT => ${this.constants.PORT}`)
    this.logger.info(`Server is running 🚀`)
  }

  private async config(): Promise<void> {
    await import('_config/env')
    this.constants = await import('_core/constants')
  }

  private async configureRoutes() {
    const { getRoutes } = await import('_core/router')
    getRoutes(this.http)
  }

  private async configureErrorHandler() {
    // It should always be the at the end of the application stack.
    // See: https://stackoverflow.com/a/32671421
    const { errorHandlerMiddleware } = await import('_config/middlewares/error-handler')
    this.http.use(errorHandlerMiddleware)
  }
}

async function getServer(): Promise<Application> {
  if (app === null) {
    app = new Application()
    await app.init()
  }
  return app
}

export default getServer()
