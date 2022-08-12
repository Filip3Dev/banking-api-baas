import messages from '_account/messages'
import { AccountRepository } from '_account/repository/account-repository'
import { AccountSegmentationRepository } from '_account/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_account/repository/account-status-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import { TransactionRepository } from '_account/repository/transaction-repository'
import { TransactionTypeRepository } from '_account/repository/transaction-type-repository'
import exceptions from '_account/tests/exceptions'
import { CreateAccount } from '_account/use-case/create-account'
import { AccountRequest } from '_account/use-case/create-account/payloads'
import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { getCustomRepository } from 'typeorm'

import { makeFiat, makeAccountSegmentation, makeAccountStatus, makeTransactionType } from './helpers/make-functions'

let accountRepository: AccountRepository = undefined
let createAccount: CreateAccount = undefined
let fiatRepository: FiatRepository = undefined
let accountStatusRepository: AccountStatusRepository = undefined
let accountSegmentationRepository: AccountSegmentationRepository = undefined
let transactionRepository: TransactionRepository = undefined
let transactionTypeRepository: TransactionTypeRepository = undefined

beforeEach(async () => {
  transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  await transactionRepository.removeAll()

  transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)
  await transactionTypeRepository.removeAll()

  accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)
  await accountRepository.removeAll()

  fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  await fiatRepository.removeAll()

  accountStatusRepository = getCustomRepository(AccountStatusRepository, DB_CONNECTION_NAMES.TEST)
  await accountStatusRepository.removeAll()

  accountSegmentationRepository = getCustomRepository(AccountSegmentationRepository, DB_CONNECTION_NAMES.TEST)
  await accountSegmentationRepository.removeAll()

  createAccount = new CreateAccount(
    accountRepository,
    fiatRepository,
    accountStatusRepository,
    accountSegmentationRepository,
    transactionRepository,
    transactionTypeRepository,
    logger
  )
})

describe('Test CreateAccount use case', () => {
  const externalUserId = '1'
  const fiatSymbol = 'BRL'

  it('create an account ', async () => {
    const request: AccountRequest = {
      externalUserId: externalUserId,
      fiatSymbol: fiatSymbol,
    }
    await makeFiat()
    await makeAccountSegmentation()
    await makeAccountStatus()
    await makeTransactionType()
    const account = await createAccount.handle(request)
    expect(account.id).not.toBeUndefined()
    expect(account.externalUserId).toBe(externalUserId)
    expect(account.fiat.symbol).toBe(fiatSymbol)
  })

  it('fails when trying to create an account that already exists', async () => {
    const request: AccountRequest = {
      externalUserId: externalUserId,
      fiatSymbol: fiatSymbol,
    }

    await makeFiat()
    await makeAccountSegmentation()
    await makeAccountStatus()
    await makeTransactionType()
    await createAccount.handle(request)

    expect(async () => {
      await createAccount.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.accountAlreadyExists.message,
      code: HttpStatusCode.BAD_REQUEST,
      codeAsString: messages.accountAlreadyExists.code,
    })
  })

  it('fails when trying to create an account with an invalid fiat symbol', async () => {
    const request: AccountRequest = {
      externalUserId: externalUserId,
      fiatSymbol: 'FOO',
    }
    await makeFiat()
    await makeAccountSegmentation()
    await makeAccountStatus()
    await makeTransactionType()
    expect(async () => {
      await createAccount.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.invalidfiatSymbol.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.invalidfiatSymbol.code,
    })
  })
})
