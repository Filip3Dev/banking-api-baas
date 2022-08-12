import messages from '_account/messages'
import { AccountRepository } from '_account/repository/account-repository'
import { AccountSegmentationRepository } from '_account/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_account/repository/account-status-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import { TransactionRepository } from '_account/repository/transaction-repository'
import exceptions from '_account/tests/exceptions'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import app from '_src/app'
import { Application, NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import request, { SuperAgentTest } from 'supertest'
import { getCustomRepository } from 'typeorm'

import { makeAccount, makeAccountSegmentation, makeAccountStatus } from './helpers/make-functions'
import { makeFiat } from './helpers/make-functions'

jest.mock('_config/middlewares/authorization', () => {
  const originalModule = jest.requireActual('_config/middlewares/authorization')

  const mockedAuthorizationMiddleware = async (
    req: Request,
    _res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    next()
  }

  return {
    ...originalModule,
    authorization: jest.fn().mockImplementation(mockedAuthorizationMiddleware),
  }
})

let http: Application
let server: Server
let agent: SuperAgentTest

let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let accountStatusRepository: AccountStatusRepository
let segmentationRepository: AccountSegmentationRepository
let transactionRepository: TransactionRepository

beforeAll(async () => {
  const application = await app
  http = application.http
})

beforeEach(async (done) => {
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  await transactionRepository.removeAll()

  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  await accountRepository.removeAll()

  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  await fiatRepository.removeAll()

  accountStatusRepository = getCustomRepository(AccountStatusRepository, DB_CONNECTION_NAMES.TEST)
  await accountStatusRepository.removeAll()

  segmentationRepository = getCustomRepository(AccountSegmentationRepository, DB_CONNECTION_NAMES.TEST)
  await segmentationRepository.removeAll()

  server = http.listen(process.env.PORT, () => {
    agent = request.agent(server)
    done()
  })
})

afterEach(async () => {
  server.close()
})

describe('Account Context routes', () => {
  test('GET /api/v1/account/balance HTTP 200 Ok', async (done) => {
    await makeAccount()
    agent
      .get('/api/v1/account/balance?externalUserId=1&fiatSymbol=BRL')
      .set('Secret', process.env.SECRET)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          balance: 0,
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('GET /api/v1/account/balance HTTP 404 Not Found - Account not found', async (done) => {
    await makeAccount()
    agent
      .get('/api/v1/account/balance?externalUserId=33&fiatSymbol=BRL')
      .set('Secret', process.env.SECRET)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.NOT_FOUND)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          code: HttpStatusCode.NOT_FOUND,
          message: {
            code: HttpStatusCode.NOT_FOUND,
            codeAsString: messages.accountNotFound.code,
            message: messages.accountNotFound.message,
            name: exceptions.domainException,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/account HTTP 201 Created', async (done) => {
    const fiat = await makeFiat()
    const status = await makeAccountStatus()
    const segmentation = await makeAccountSegmentation()

    const body = {
      externalUserId: '1',
      fiatSymbol: 'BRL',
    }

    agent
      .post('/api/v1/account')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.CREATED)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          externalUserId: '1',
          balance: 0,
          limit: 1000000,
          id: expect.any(Number),
          isBlocked: false,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          deletedAt: null,
          fiat: {
            id: fiat.id,
            symbol: fiat.symbol,
          },
          status: {
            id: status.id,
            slug: status.slug,
            createdAt: expect.any(String),
            description: null,
            updatedAt: expect.any(String),
            deletedAt: null,
          },
          segmentation: {
            id: segmentation.id,
            slug: segmentation.slug,
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            deletedAt: null,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/account HTTP 400 Bad Request - Account already exists', async (done) => {
    await makeAccount()
    const body = {
      externalUserId: '1',
      fiatSymbol: 'BRL',
    }

    agent
      .post('/api/v1/account')
      .set('Secret', 'valid - key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.BAD_REQUEST)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          code: HttpStatusCode.BAD_REQUEST,
          message: {
            code: HttpStatusCode.BAD_REQUEST,
            codeAsString: messages.accountAlreadyExists.code,
            message: messages.accountAlreadyExists.message,
            name: exceptions.domainException,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })
})
