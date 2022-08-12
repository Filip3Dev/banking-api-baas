import { DB_CONNECTION_NAMES } from '_core/constants'
import { OperationTypes, TransactionTypes } from '_transaction/enums'
import { Account } from '_transaction/model/account-model'
import { AccountSegmentation } from '_transaction/model/account-segmentation-model'
import { AccountStatus } from '_transaction/model/account-status-model'
import { Fiat } from '_transaction/model/fiat-model'
import { Transaction } from '_transaction/model/transaction-model'
import { TransactionType } from '_transaction/model/transaction-type-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { AccountSegmentationRepository } from '_transaction/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_transaction/repository/account-status-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { getCustomRepository } from 'typeorm'

export const makeAccount = async (externalUserId = '123', balance = 1000): Promise<Account> => {
  const accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)

  const fiat = await makeFiat()
  const status = await makeAccountStatus()
  const segmentation = await makeAccountSegmentation()
  const account = accountRepository.create({
    externalUserId,
    fiat,
    limit: 1000000,
    balance,
    status,
    segmentation,
  })

  await accountRepository.save(account)
  return account
}

export const makeFiat = async (name = 'real', symbol = 'BRL'): Promise<Fiat> => {
  const fiatRepository = getCustomRepository(FiatRepository, DB_CONNECTION_NAMES.TEST)
  let fiat = await fiatRepository.findOne({ symbol })

  if (!fiat) {
    fiat = fiatRepository.create({
      name,
      symbol,
    })
    await fiatRepository.save(fiat)
  }
  return fiat
}

export const makeAccountSegmentation = async (slug = 'NORMAL'): Promise<AccountSegmentation> => {
  const accountSegmentationRepository = getCustomRepository(AccountSegmentationRepository, DB_CONNECTION_NAMES.TEST)

  let accountSegmentation = await accountSegmentationRepository.findOne({ slug })

  if (!accountSegmentation) {
    accountSegmentation = accountSegmentationRepository.create({
      slug,
    })
    await accountSegmentationRepository.save(accountSegmentation)
  }

  return accountSegmentation
}

export const makeAccountStatus = async (slug = 'ACTIVE'): Promise<AccountStatus> => {
  const accountStatusRepository = getCustomRepository(AccountStatusRepository, DB_CONNECTION_NAMES.TEST)

  let accountStatus = await accountStatusRepository.findOne({ slug })

  if (!accountStatus) {
    accountStatus = accountStatusRepository.create({
      slug,
    })
    await accountStatusRepository.save(accountStatus)
  }
  return accountStatus
}

export const randomTransactionTypeByOperationType = async (
  operationType: OperationTypes
): Promise<TransactionTypes> => {
  const transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)

  const transactionTypes = await transactionTypeRepository.find({ operationType })
  const randomTransactionTypeSlug = transactionTypes[Math.floor(Math.random() * transactionTypes.length)].slug
  const transactionTypeKey = Object.keys(TransactionTypes).find(
    (key) => TransactionTypes[key] === randomTransactionTypeSlug
  )
  return TransactionTypes[transactionTypeKey]
}

export const makeTransaction = async (account: Account): Promise<Transaction> => {
  const transactionRepository = getCustomRepository(TransactionRepository, DB_CONNECTION_NAMES.TEST)
  const transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)

  const transactionType = await transactionTypeRepository.findBySlug(TransactionTypes.CASH_IN)

  const newTransaction = new Transaction()
  newTransaction.account = account
  newTransaction.accountId = account.id
  newTransaction.amount = 10000
  newTransaction.description = 'Deposito'
  newTransaction.externalIdentifier = '1'
  newTransaction.isVisible = true
  newTransaction.operationType = OperationTypes.CREDIT
  newTransaction.transactionType = transactionType

  const transaction = await transactionRepository.create(newTransaction)
  await transactionRepository.save(transaction)

  return transaction
}

export const makeTransactionType = async (slug = 'START', types = 'DEBIT'): Promise<TransactionType> => {
  const transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)

  const transactionType = transactionTypeRepository.create({
    slug,
    nameExtract: slug,
    description: slug,
    operationType: types == 'DEBIT' ? OperationTypes.DEBIT : OperationTypes.CREDIT,
  })

  await transactionTypeRepository.save(transactionType)
  return transactionType
}
