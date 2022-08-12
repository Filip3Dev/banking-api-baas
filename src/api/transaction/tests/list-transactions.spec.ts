import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import messages from '_transaction/messages'
import { Account } from '_transaction/model/account-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import exceptions from '_transaction/tests/exceptions'
import { ListTransactions } from '_transaction/use-case/list-transactions'
import { StatementRequest } from '_transaction/use-case/list-transactions/payloads'
import { getCustomRepository } from 'typeorm'

import { makeAccount, makeTransaction } from './helpers/make-functions'

let transactionRepository: TransactionRepository
let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let listTransactions: ListTransactions = undefined
let account: Account

beforeAll(async () => {
  account = await makeAccount('1234', 1000)
  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  listTransactions = new ListTransactions(accountRepository, fiatRepository, transactionRepository, logger)
})

afterAll(async () => {
  await transactionRepository.removeAll()
  await accountRepository.removeAll()
})

describe('Test ListTransactions Use Case', () => {
  it('OK - list transactions', async () => {
    account.createdAt = new Date('2022-01-02')
    await accountRepository.save(account)
    await makeTransaction(account)
    const request: StatementRequest = {
      page: 1,
      month: 'ago/2022',
      pageSize: 50,
      externalUserId: account.externalUserId,
      fiatSymbol: account.fiat.symbol,
    }
    const statement = await listTransactions.handle(request)
    expect(statement.balance).toBe(1000)
    expect(statement.totalResults).toBe(1)
    expect(statement.haveTransactions).toBe(true)
  })
  it('OK - list empty transactions', async () => {
    const acc = await makeAccount('1', 0)
    acc.createdAt = new Date('2022-01-02')
    await accountRepository.save(acc)
    const request: StatementRequest = {
      page: 1,
      month: 'jul/2022',
      pageSize: 50,
      externalUserId: '1',
      fiatSymbol: account.fiat.symbol,
    }
    const statement = await listTransactions.handle(request)
    expect(statement.balance).toBe(0)
    expect(statement.totalResults).toBe(0)
    expect(statement.haveTransactions).toBe(false)
  })
  it('FAILS - list transactions user not found', async () => {
    await makeTransaction(account)
    const request: StatementRequest = {
      page: 1,
      month: 'jul/2022',
      pageSize: 50,
      externalUserId: '3',
      fiatSymbol: account.fiat.symbol,
    }

    expect(async () => {
      await listTransactions.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.accountNotFound.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.accountNotFound.code,
    })
  })
  it('FAILS - list transactions fiat not found', async () => {
    await makeTransaction(account)
    const request: StatementRequest = {
      page: 1,
      month: 'jul/2022',
      pageSize: 50,
      externalUserId: account.externalUserId,
      fiatSymbol: 'CAD',
    }

    expect(async () => {
      await listTransactions.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.invalidfiatSymbol.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.invalidfiatSymbol.code,
    })
  })
  it('FAILS - list transactions date error', async () => {
    await makeTransaction(account)
    const request: StatementRequest = {
      page: 1,
      month: 'top/2022',
      pageSize: 50,
      externalUserId: account.externalUserId,
      fiatSymbol: account.fiat.symbol,
    }

    expect(async () => {
      await listTransactions.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.invalidMonth.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.invalidMonth.code,
    })
  })
})
