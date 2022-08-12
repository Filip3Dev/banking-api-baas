import { logger } from '_core/adapter/logger'
import { default as dotenv, DotenvSafeOptions } from 'dotenv-safe'
import path from 'path'

let dotenvOptions: DotenvSafeOptions = {
  example: path.join(__dirname, '../config/.env.example'),
}

export const ENVIRONMENTS = {
  DEV: 'development',
  TEST: 'test',
  STAGING: 'staging',
  PROD: 'production',
}

if ([ENVIRONMENTS.DEV, ENVIRONMENTS.TEST].includes(process.env.NODE_ENV)) {
  dotenvOptions = {
    ...dotenvOptions,
    path: path.join(__dirname, `../config/.env.${process.env.NODE_ENV}`),
  }
}

dotenv.config(dotenvOptions)

logger.info(`Loaded => environment: ${process.env.NODE_ENV}`)
