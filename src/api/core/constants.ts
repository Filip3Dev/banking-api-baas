export const ENV = process.env.NODE_ENV

export const PORT = process.env.PORT

export const ENVIRONMENTS = {
  DEV: 'development',
  TEST: 'test',
  STAGING: 'staging',
  PROD: 'production',
}

export const DIGITAL_ACCOUNT_CONFIG = {
  clientId: process.env.BBX_CLIENT_ID,
  clientSecret: process.env.BBX_CLIENT_SECRET,
  tokenCacheName: 'BANKING_TOKEN',
  baseURL: process.env.BBX_BASE_URL,
}

export const CACHE_CONFIG = {
  defaultTtlSeconds: parseInt(process.env.DEFAULT_CACHE_TTL_SECONDS),
}

export const MAX_DECIMAL_PLACES = 2

export const DECIMAL_PRECISION = 10

export const DB_CONNECTION_NAMES = {
  DEFAULT: 'default',
  TEST: 'test',
}

export const SECRET = {
  key: process.env.SECRET,
}

export const DEFAULT_LIMIT = {
  limit: 1000000,
}
