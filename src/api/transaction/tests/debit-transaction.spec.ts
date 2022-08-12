import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { OperationTypes } from '_transaction/enums'
import messages from '_transaction/messages'
import { AccountRepository } from '_transaction/repository/account-repository'
import { AccountSegmentationRepository } from '_transaction/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_transaction/repository/account-status-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { makeAccount, randomTransactionTypeByOperationType } from '_transaction/tests/helpers/make-functions'
import { TransactionRequest } from '_transaction/use-case/credit-transaction/payloads'
import { DebitTransaction } from '_transaction/use-case/debit-transaction'
import { getCustomRepository } from 'typeorm'

import exceptions from './exceptions'
import { httpClientResponseErrorMessages } from './validation-error-messages'

let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let transactionRepository: TransactionRepository
let transactionTypeRepository: TransactionTypeRepository
let accountStatusRepository: AccountStatusRepository
let accountSegmentationRepository: AccountSegmentationRepository
let debitTransaction: DebitTransaction
const operationType = OperationTypes.DEBIT

beforeAll(async () => {
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)
  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  accountStatusRepository = getCustomRepository(AccountStatusRepository, DB_CONNECTION_NAMES.TEST)
  accountSegmentationRepository = getCustomRepository(AccountSegmentationRepository, DB_CONNECTION_NAMES.TEST)
})

beforeEach(async () => {
  await transactionRepository.removeAll()
  await accountRepository.removeAll()

  debitTransaction = new DebitTransaction(
    transactionRepository,
    transactionTypeRepository,
    accountRepository,
    fiatRepository,
    accountStatusRepository,
    accountSegmentationRepository,
    logger
  )
})

describe('Test DebitTransaction use case', () => {
  it('success when trying to create an debit transaction when account not exists', async () => {
    const externalUserId = '123'
    const symbol = 'BRL'
    const externalIdentifier = '1'
    const amount = 1000
    const transactionType = await randomTransactionTypeByOperationType(operationType)

    const request: TransactionRequest = {
      externalUserId: externalUserId,
      amount,
      externalIdentifier,
      symbol,
      transactionTypeSlug: transactionType,
    }
    expect(async () => {
      await debitTransaction.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.insufficientFiatBalance.message(symbol),
      code: HttpStatusCode.BAD_REQUEST,
      codeAsString: messages.insufficientFiatBalance.code,
    })
  })

  it('success when trying to create an debit transaction when account exists', async () => {
    const account = await makeAccount()
    const externalIdentifier = '1'
    const amount = 1000

    const transactionType = await randomTransactionTypeByOperationType(operationType)

    const request: TransactionRequest = {
      externalUserId: account.externalUserId,
      amount,
      externalIdentifier,
      symbol: account.fiat.symbol,
      transactionTypeSlug: transactionType,
    }
    const transactionExpected = {
      amount: account.balance + amount,
      account: {
        externalUserId: externalIdentifier,
        balance: account.balance + amount,
      },
      transactionType: {
        slug: transactionType,
      },
    }

    expect(async () => {
      const transaction = await debitTransaction.handle(request)
      expect(transaction).toMatchObject(transactionExpected)
    })
  })

  it('success when trying to create an debit transaction when account exists with insufficient balance', async () => {
    const account = await makeAccount()
    const externalIdentifier = '1'
    const amount = account.balance + 1
    const transactionType = await randomTransactionTypeByOperationType(operationType)

    const request: TransactionRequest = {
      externalUserId: account.externalUserId,
      amount,
      externalIdentifier,
      symbol: account.fiat.symbol,
      transactionTypeSlug: transactionType,
    }
    expect(async () => {
      await debitTransaction.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.insufficientFiatBalance.message(account.fiat.symbol),
      code: HttpStatusCode.BAD_REQUEST,
      codeAsString: messages.insufficientFiatBalance.code,
    })
  })

  it('fails when trying to create an debit transaction when account is blocked', async () => {
    const account = await makeAccount()
    account.isBlocked = true
    await accountRepository.save(account)

    const externalIdentifier = '1'
    const amount = 1000
    const transactionType = await randomTransactionTypeByOperationType(operationType)

    const request: TransactionRequest = {
      externalUserId: account.externalUserId,
      amount,
      externalIdentifier,
      symbol: account.fiat.symbol,
      transactionTypeSlug: transactionType,
    }
    expect(async () => {
      const transaction = await debitTransaction.handle(request)
      expect(transaction).toMatchObject({
        code: HttpStatusCode.BAD_REQUEST,
        message: {
          code: HttpStatusCode.BAD_REQUEST,
          codeAsString: messages.accountIsBlocked.code,
          message: httpClientResponseErrorMessages.accountIsBlocked,
          name: exceptions.domainException,
        },
      })
    })
  })
})
