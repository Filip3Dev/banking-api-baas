import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { swaggerSpec } from '_interfaces/openapi'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import express from 'express'
import path from 'path'
import swaggerUI from 'swagger-ui-express'

export const loadExpress = (logger: Logger): express.Application => {
  const application: express.Application = express()

  // SENTRY - init before all middlewares
  Sentry.init({ dsn: process.env.SENTRY_DSN })
  application.use(Sentry.Handlers.requestHandler())

  // MIDDLEWARES
  application.use(cors())

  // STATIC
  application.use('/banking/static', express.static(path.join(__dirname, 'public')))

  // DOCS
  application.use('/banking/v1/docs/openapi.json', (req, res) => res.json(swaggerSpec))
  application.use('/banking/v1/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

  logger.info(`Loaded => express`)

  return application
}
