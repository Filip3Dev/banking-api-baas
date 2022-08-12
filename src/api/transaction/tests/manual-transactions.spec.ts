import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { TransactionTypes } from '_transaction/enums'
import messages from '_transaction/messages'
// import { OperationTypes } from "_transaction/enums"
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
// import { TransactionRequest } from "_transaction/use-case/list-transactions/payloads"
import { ManualTransaction } from '_transaction/use-case/manual-transactions'
import { TransactionManualRequest } from '_transaction/use-case/manual-transactions/payloads'
import { getCustomRepository } from 'typeorm'

import exceptions from './exceptions'
import { makeAccount } from './helpers/make-functions'

let transactionTypeRepository: TransactionTypeRepository
let transactionRepository: TransactionRepository
let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let manualTransaction: ManualTransaction

beforeAll(async () => {
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)
  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
})

beforeEach(async () => {
  await transactionRepository.removeAll()
  await transactionTypeRepository.removeAll()
  await accountRepository.removeAll()
  await fiatRepository.removeAll()

  manualTransaction = new ManualTransaction(
    transactionRepository,
    transactionTypeRepository,
    accountRepository,
    fiatRepository,
    logger
  )
})

describe('Test manualTransaction use case', () => {
  it('success when trying to create an manual transaction when account exists', async () => {
    const account = await makeAccount()
    const accountId = account.id
    const amount = 1000
    const request: TransactionManualRequest = {
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '0',
      externalIdentifier: '123',
    }

    const transactionExpected = {
      accountId,
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '0',
      externalIdentifier: '123',
    }

    expect(async () => {
      const transaction = await manualTransaction.handle(request)
      expect(transaction).toMatchObject(transactionExpected)
    })
  })

  it('fail when trying to create an manual transaction when account does not exist', async () => {
    await makeAccount()
    const amount = 1000
    const request: TransactionManualRequest = {
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '104',
      externalIdentifier: '123',
    }

    expect(async () => {
      await manualTransaction.handle(request)
    }).rejects.toThrowError()
  })

  it('fail when fiat not found', async () => {
    await makeAccount()
    const amount = 1000
    const request: TransactionManualRequest = {
      amount,
      symbol: 'BRS',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '0',
      externalIdentifier: '123',
    }

    expect(async () => {
      await manualTransaction.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.invalidfiatSymbol.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.invalidfiatSymbol.code,
    })
  })

  it('fail when transaction type not found', async () => {
    await makeAccount()
    const amount = 1000
    const request: TransactionManualRequest = {
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '0',
      externalIdentifier: '123',
    }

    expect(async () => {
      await manualTransaction.handle(request)
    }).rejects.toThrowError()
  })

  it('fail when amount is negative', async () => {
    await makeAccount()
    const amount = -1000
    const request: TransactionManualRequest = {
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeSlug: TransactionTypes.CASH_OUT_MANUAL_PAYMENT,
      externalUserId: '0',
      externalIdentifier: '123',
    }

    expect(async () => {
      await manualTransaction.handle(request)
    }).rejects.toThrowError()
  })
})
