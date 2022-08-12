import { DB_CONNECTION_NAMES } from '_core/constants'
import amqplib from 'amqplib'
import mockAmqplib from 'mock-amqplib'
import { createConnection } from 'typeorm'

jest.setTimeout(30000)

beforeAll(async () => {
  amqplib.connect = mockAmqplib.connect
  return createConnection(DB_CONNECTION_NAMES.TEST)
})
