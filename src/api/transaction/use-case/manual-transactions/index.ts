import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { generateUseCaseDebugLogMessage } from '_core/utils/use-case-debug-log-message'
import { OperationTypes } from '_transaction/enums'
import messages from '_transaction/messages'
import { Transaction } from '_transaction/model/transaction-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { getConnection } from 'typeorm'

import { TransactionManualRequest } from './payloads'
export class ManualTransaction implements BaseUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private logger: Logger
  ) {}

  async handle(request: TransactionManualRequest): Promise<Transaction> {
    this.validate(request)

    const { amount, description, externalUserId, symbol, transactionTypeSlug, externalIdentifier } = request

    const fiat = await this.fiatRepository.findOne({ symbol })
    if (!fiat) {
      throw new DomainException(
        messages.invalidfiatSymbol.message,
        HttpStatusCode.NOT_FOUND,
        messages.invalidfiatSymbol.code
      )
    }

    const account = await this.accountRepository.findOneOrFail({ externalUserId, fiat })
    if (!account) {
      throw new DomainException(
        messages.accountNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountNotFound.code
      )
    }

    const transactionType = await this.transactionTypeRepository.findBySlug(transactionTypeSlug)

    const operationType = transactionType.operationType

    const transaction = await this.transactionRepository.create({
      accountId: account.id,
      amount,
      description,
      transactionType,
      externalIdentifier,
      operationType,
    })

    if (operationType === OperationTypes.CREDIT) {
      account.balance += amount
    } else if (operationType === OperationTypes.DEBIT) {
      if (account.balance < amount) {
        throw new DomainException(
          messages.insufficientFiatBalance.message(symbol),
          HttpStatusCode.BAD_REQUEST,
          messages.insufficientFiatBalance.code
        )
      }
      account.balance -= amount
    }

    transaction.account = account

    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.startTransaction()
    try {
      await this.transactionRepository.save(transaction)
      await this.accountRepository.save(account)
    } catch (error) {
      this.logger.debug(
        generateUseCaseDebugLogMessage(this, `${operationType} Transaction`, {
          accountId: account.id,
          amount,
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

  private validate(request: TransactionManualRequest): void {
    const payloadRequest = TransactionManualRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.invalidPayloadValidation.message
      )
    }
  }
}
