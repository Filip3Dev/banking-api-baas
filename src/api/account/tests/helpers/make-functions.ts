import { OperationTypes, TransactionTypes } from '_account/enums'
import { Account } from '_account/model/account-model'
import { AccountSegmentation } from '_account/model/account-segmentation-model'
import { AccountStatus } from '_account/model/account-status-model'
import { Fiat } from '_account/model/fiat-model'
import { TransactionType } from '_account/model/transaction-type-model'
import { AccountRepository } from '_account/repository/account-repository'
import { AccountSegmentationRepository } from '_account/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_account/repository/account-status-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import { TransactionTypeRepository } from '_account/repository/transaction-type-repository'
import { DB_CONNECTION_NAMES } from '_core/constants'
import { getCustomRepository } from 'typeorm'

export const makeAccount = async (externalUserId = '1'): Promise<Account> => {
  const accountRepository = getCustomRepository(AccountRepository, DB_CONNECTION_NAMES.TEST)

  const fiat = await makeFiat()
  const status = await makeAccountStatus()
  const segmentation = await makeAccountSegmentation()

  const account = accountRepository.create({
    externalUserId,
    fiat,
    limit: 1000000,
    balance: 0,
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

export const makeTransactionType = async (slug = TransactionTypes.START): Promise<TransactionType> => {
  const transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)

  const transactionType = transactionTypeRepository.create({
    slug,
    nameExtract: TransactionTypes.START,
    description: TransactionTypes.START,
    operationType: OperationTypes.CREDIT,
  })

  await transactionTypeRepository.save(transactionType)
  return transactionType
}
