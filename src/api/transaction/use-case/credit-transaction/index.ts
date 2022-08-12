import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { DEFAULT_LIMIT } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { generateUseCaseDebugLogMessage } from '_core/utils/use-case-debug-log-message'
import { AccountSegmentation, AccountStatus, OperationTypes } from '_transaction/enums'
import messages from '_transaction/messages'
import { Account } from '_transaction/model/account-model'
import { Fiat } from '_transaction/model/fiat-model'
import { Transaction } from '_transaction/model/transaction-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { AccountSegmentationRepository } from '_transaction/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_transaction/repository/account-status-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { getConnection } from 'typeorm'

import { TransactionRequest } from './payloads'

export class CreditTransaction implements BaseUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private accountStatusRepository: AccountStatusRepository,
    private accountSegmentationRepository: AccountSegmentationRepository,
    private logger: Logger
  ) {}

  async handle(request: TransactionRequest): Promise<Transaction> {
    this.validate(request)

    const { amount, externalIdentifier, description, externalUserId, symbol, transactionTypeSlug, reason } = request

    const fiat = await this.findFiat(symbol)
    let account = await this.accountRepository.findOne({ externalUserId, fiat })

    if (!account) {
      account = await this.createAccount(externalUserId, fiat)
    } else if (account.isBlocked) {
      throw new DomainException(
        messages.accountIsBlocked.message,
        HttpStatusCode.BAD_REQUEST,
        messages.accountIsBlocked.code
      )
    }

    const transactionType = await this.transactionTypeRepository.findBySlug(transactionTypeSlug)
    const operationType = OperationTypes.CREDIT

    const transaction = await this.transactionRepository.create({
      accountId: account.id,
      amount,
      externalIdentifier,
      description,
      transactionType,
      operationType,
      reason,
    })
    account.balance += amount
    transaction.account = account

    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.startTransaction()
    try {
      await this.transactionRepository.save(transaction)
      await this.accountRepository.save(account)
    } catch (error) {
      this.logger.debug(
        generateUseCaseDebugLogMessage(this, `Credit Transaction`, {
          accountId: account.id,
          amount,
          externalIdentifier,
          description,
          type: transactionType.nameExtract,
          operationType,
        })
      )
      await queryRunner.rollbackTransaction()
      throw new DomainException(
        messages.transactionNotCreated.message,
        HttpStatusCode.BAD_REQUEST,
        messages.transactionNotCreated.code
      )
    } finally {
      await queryRunner.release()
    }
    return transaction
  }

  private validate(request: TransactionRequest): void {
    const payloadRequest = TransactionRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.transactionValidationError.code
      )
    }
  }

  private async createAccount(externalUserId: string, fiat: Fiat): Promise<Account> {
    const accountStatus = await this.accountStatusRepository.findBySlug(AccountStatus.ACTIVE)
    const accountSegmentation = await this.accountSegmentationRepository.findBySlug(AccountSegmentation.NORMAL)

    const newAccount = this.accountRepository.create({
      externalUserId,
      fiat,
      limit: DEFAULT_LIMIT.limit,
      balance: 0,
      status: accountStatus,
      segmentation: accountSegmentation,
    })

    await this.accountRepository.save(newAccount)
    return newAccount
  }

  private async findFiat(symbol: string): Promise<Fiat> {
    const fiat = await this.fiatRepository.findOne({ symbol })

    if (!fiat) {
      throw new DomainException(messages.fiatNotFound.message, HttpStatusCode.NOT_FOUND, messages.fiatNotFound.code)
    }
    return fiat
  }
}
