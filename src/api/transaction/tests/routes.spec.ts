import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import app from '_src/app'
import messages from '_transaction/messages'
import { Account } from '_transaction/model/account-model'
import { Fiat } from '_transaction/model/fiat-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { AccountSegmentationRepository } from '_transaction/repository/account-segmentation-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { Application, NextFunction, Request, Response } from 'express'
import { Server } from 'http'
import request, { SuperAgentTest } from 'supertest'
import { getCustomRepository } from 'typeorm'

import exceptions from './exceptions'
import { makeAccount, makeTransaction, makeTransactionType } from './helpers/make-functions'
import { httpClientResponseErrorMessages } from './validation-error-messages'

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
let account: Account
let fiat: Fiat
let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let accountSegmentationRepository: AccountSegmentationRepository
let transactionTypeRepository: TransactionTypeRepository = undefined
let transactionRepository: TransactionRepository

beforeAll(async () => {
  const application = await app
  http = application.http
  account = await makeAccount('1234', 1000)
  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  accountSegmentationRepository = getCustomRepository(AccountSegmentationRepository, DB_CONNECTION_NAMES.TEST)
  fiat = await fiatRepository.findOneOrFail(account.fiat.id)
})

beforeEach(async (done) => {
  account.balance = 1000
  account.isBlocked = false
  await accountRepository.save(account)
  server = http.listen(process.env.PORT, () => {
    agent = request.agent(server)
    done()
  })
})

afterEach(async () => {
  account.balance = 1000
  account = await accountRepository.save(account)
  server.close()
})

afterAll(async () => {
  await transactionRepository.removeAll()
  await accountRepository.removeAll()
  await accountSegmentationRepository.removeAll()
})

describe('Transaction Context routes', () => {
  test('POST /api/v1/transaction/cash_in HTTP 200 Ok', async (done) => {
    const body = {
      amount: 1000,
      extTransactionId: '1',
      externalUserId: account.externalUserId,
      description: 'test',
      fiatSymbol: 'BRL',
    }
    agent
      .post('/api/v1/transaction/cash_in')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          amount: body.amount,
          balance: account.balance + body.amount,
          dtTransaction: expect.any(String),
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/cash_in HTTP 400 Account is Blocked', async (done) => {
    account.isBlocked = true
    await accountRepository.save(account)

    const body = {
      amount: 1000,
      extTransactionId: '1',
      externalUserId: account.externalUserId,
      description: 'test',
      fiatSymbol: 'BRL',
    }
    agent
      .post('/api/v1/transaction/cash_in')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.BAD_REQUEST)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          code: HttpStatusCode.BAD_REQUEST,
          message: {
            code: HttpStatusCode.BAD_REQUEST,
            codeAsString: messages.accountIsBlocked.code,
            message: httpClientResponseErrorMessages.accountIsBlocked,
            name: exceptions.domainException,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/cash_out HTTP 200 Ok', async (done) => {
    const body = {
      amount: account.balance,
      extTransactionId: '1',
      externalUserId: account.externalUserId,
      description: 'test',
      fiatSymbol: 'BRL',
    }
    agent
      .post('/api/v1/transaction/cash_out')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          amount: body.amount,
          balance: account.balance - body.amount,
          dtTransaction: expect.any(String),
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/cash_out HTTP 400 Bad Request', async (done) => {
    const body = {
      amount: account.balance + 1,
      extTransactionId: '1',
      externalUserId: account.externalUserId,
      description: 'test',
      fiatSymbol: 'BRL',
    }

    agent
      .post('/api/v1/transaction/cash_out')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.BAD_REQUEST)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          code: HttpStatusCode.BAD_REQUEST,
          message: {
            code: HttpStatusCode.BAD_REQUEST,
            codeAsString: messages.insufficientFiatBalance.code,
            message: httpClientResponseErrorMessages.insufficientFiatBalance(fiat.symbol),
            name: exceptions.domainException,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/cash_out HTTP 400 Account is Blocked', async (done) => {
    account.isBlocked = true
    await accountRepository.save(account)

    const body = {
      amount: account.balance + 1,
      extTransactionId: '1',
      externalUserId: account.externalUserId,
      description: 'test',
      fiatSymbol: 'BRL',
    }

    agent
      .post('/api/v1/transaction/cash_out')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.BAD_REQUEST)
      .then((response: request.Response) => {
        expect(response.body).toEqual({
          code: HttpStatusCode.BAD_REQUEST,
          message: {
            code: HttpStatusCode.BAD_REQUEST,
            codeAsString: messages.accountIsBlocked.code,
            message: httpClientResponseErrorMessages.accountIsBlocked,
            name: exceptions.domainException,
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  describe('Account Context routes', () => {
    test('GET /api/v1/statements HTTP 200 Ok', async (done) => {
      account.createdAt = new Date('2022-01-02')
      await accountRepository.save(account)
      await makeTransaction(account)

      agent
        .get(`/api/v1/statements?month=jul/2022&externalUserId=${account.externalUserId}&fiatSymbol=BRL`)
        .set('Secret', process.env.SECRET)
        .expect('Content-Type', /json/)
        .expect(HttpStatusCode.OK)
        .then((response: request.Response) => {
          expect(response.body).toHaveProperty('balance')
          expect(response.body).toHaveProperty('haveTransactions')
          expect(response.body).toHaveProperty('totalResults')
          done()
        })
        .catch((err) => done(err))
    })
  })

  test('GET /api/v1/statements HTTP 400 Not found', async (done) => {
    await makeTransaction(account)

    agent
      .get('/api/v1/statements?month=jul/2022&externalUserId=2&fiatSymbol=BRL')
      .set('Secret', process.env.SECRET)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.NOT_FOUND)
      .then((response: request.Response) => {
        expect(response.body).toStrictEqual({
          code: 404,
          message: {
            code: 404,
            codeAsString: 'account_not_found',
            message: 'Account not found',
            name: 'DomainException',
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('GET /API/V1/transaction/type', async (done) => {
    agent
      .get('/api/v1/transaction/type')
      .set('Secret', process.env.SECRET)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        for (const transactionType of response.body) {
          expect(transactionType).toHaveProperty('id')
          expect(transactionType).toHaveProperty('slug')
          expect(transactionType).toHaveProperty('nameExtract')
          expect(transactionType).toHaveProperty('description')
          expect(transactionType).toHaveProperty('isActive')
        }
        done()
      })
      .catch((err) => done(err))
  })

  test('GET /api/v1/transaction/type HTTP 404 Not found', async (done) => {
    transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
    await transactionRepository.removeAll()

    transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)
    await transactionTypeRepository.removeAll()

    agent
      .get('/api/v1/transaction/type')
      .set('Secret', process.env.SECRET)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.NOT_FOUND)
      .then((response: request.Response) => {
        expect(response.body).toStrictEqual({
          code: 404,
          message: {
            code: 404,
            codeAsString: 'result_not_found',
            message: 'Result not found',
            name: 'DomainException',
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction HTTP 200 Ok', async (done) => {
    const transType = await makeTransactionType('CREDIT')
    const body = {
      amount: 1000,
      symbol: 'BRL',
      description: 'test',
      transactionType: transType.slug,
      externalUserId: account.externalUserId,
      extTransactionId: '123',
    }

    agent
      .post('/api/v1/transaction')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        expect(response.body).toHaveProperty('amount')
        expect(response.body).toHaveProperty('operationType')
        expect(response.body).toHaveProperty('dtTransaction')
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction HTTP 400 Invalid transaction type', async (done) => {
    const transType = await makeTransactionType('CREDIT')
    const body = {
      amount: 1000,
      symbol: 'BRL',
      description: 'test',
      transactionTypeId: transType.id,
      externalUserId: 1666,
    }

    agent
      .post('/api/v1/transaction')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.BAD_REQUEST)
      .then((response: request.Response) => {
        expect(response.body).toStrictEqual({
          code: 400,
          message: {
            code: 400,
            codeAsString: 'Invalid payload validation',
            message: 'Expected string, received number',
            name: 'DomainException',
          },
        })
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/transfer_p2p HTTP 200 Ok', async (done) => {
    await makeTransactionType('TRANSACTION_OUT_P2P', 'DEBIT')
    await makeTransactionType('TRANSACTION_IN_P2P', 'CREDIT')
    await makeAccount('1', 1000)
    await makeAccount('2', 100)
    const body = {
      amount: 1000,
      fiatSymbol: 'BRL',
      extUserIdIn: '1',
      extUserIdOut: '2',
    }

    agent
      .post('/api/v1/transaction/transfer_p2p')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.OK)
      .then((response: request.Response) => {
        expect(response.body).toHaveProperty('amount')
        expect(response.body).toHaveProperty('operationType')
        expect(response.body).toHaveProperty('dtTransaction')
        done()
      })
      .catch((err) => done(err))
  })

  test('POST /api/v1/transaction/transfer_p2p HTTP 404 Error', async (done) => {
    const body = {
      amount: 1000,
      fiatSymbol: 'BRZ',
      extUserIdIn: '1',
      extUserIdOut: '2',
    }

    agent
      .post('/api/v1/transaction/transfer_p2p')
      .set('Secret', 'valid-key')
      .send(body)
      .expect('Content-Type', /json/)
      .expect(HttpStatusCode.NOT_FOUND)
      .then((response: request.Response) => {
        expect(response.body).toStrictEqual({
          code: 404,
          message: {
            code: 404,
            codeAsString: 'invalid_fiat_symbol',
            message: 'Invalid fiat symbol',
            name: 'DomainException',
          },
        })
        done()
      })
      .catch((err) => done(err))
  })
})
