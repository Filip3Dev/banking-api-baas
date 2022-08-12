import { logger } from '_core/adapter/logger'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import messages from '_transaction/messages'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { P2PTransaction } from '_transaction/use-case/p2p-transaction'
import { TransactionP2PRequest } from '_transaction/use-case/p2p-transaction/payloads'
import { getCustomRepository } from 'typeorm'

import exceptions from './exceptions'
import { makeAccount } from './helpers/make-functions'

let transactionTypeRepository: TransactionTypeRepository
let transactionRepository: TransactionRepository
let accountRepository: AccountRepository
let fiatRepository: FiatRepository
let p2PTransaction: P2PTransaction

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

  p2PTransaction = new P2PTransaction(
    transactionRepository,
    transactionTypeRepository,
    accountRepository,
    fiatRepository,
    logger
  )
})

describe('Test P2PTransaction use case', () => {
  it('success when trying to create an P2P transaction', async () => {
    const account1 = await makeAccount('1')
    const account2 = await makeAccount('2')
    const accountId = account1.id
    const amount = 1000
    const request: TransactionP2PRequest = {
      amount,
      fiatSymbol: 'BRL',
      extUserIdIn: account1.externalUserId,
      extUserIdOut: account2.externalUserId,
    }

    const transactionExpected = {
      accountId,
      amount,
      symbol: 'BRL',
      description: 'test',
      transactionTypeId: 1,
      externalUserId: '0',
    }

    expect(async () => {
      const transaction = await p2PTransaction.handle(request)
      expect(transaction).toMatchObject(transactionExpected)
    })
  })

  it('fail when trying to create an P2P transaction when account does not exist', async () => {
    const account1 = await makeAccount('1')
    const account2 = await makeAccount('2')
    const amount = 1000
    const request: TransactionP2PRequest = {
      amount,
      fiatSymbol: 'BRL',
      extUserIdIn: account1.externalUserId,
      extUserIdOut: account2.externalUserId,
    }

    expect(async () => {
      await p2PTransaction.handle(request)
    }).rejects.toThrowError()
  })

  it('fail when fiat not found', async () => {
    const account1 = await makeAccount('1')
    const account2 = await makeAccount('2')
    const amount = 1000
    const request: TransactionP2PRequest = {
      amount,
      fiatSymbol: 'BRZ',
      extUserIdIn: account1.externalUserId,
      extUserIdOut: account2.externalUserId,
    }

    expect(async () => {
      await p2PTransaction.handle(request)
    }).rejects.toMatchObject({
      name: exceptions.domainException,
      message: messages.invalidfiatSymbol.message,
      code: HttpStatusCode.NOT_FOUND,
      codeAsString: messages.invalidfiatSymbol.code,
    })
  })

  it('fail when value is not enough', async () => {
    const account1 = await makeAccount('1')
    const account2 = await makeAccount('2')
    const amount = 10000
    const request: TransactionP2PRequest = {
      amount,
      fiatSymbol: 'BRL',
      extUserIdIn: account1.externalUserId,
      extUserIdOut: account2.externalUserId,
    }

    expect(async () => {
      await p2PTransaction.handle(request)
    }).rejects.toThrowError()
  })
})
