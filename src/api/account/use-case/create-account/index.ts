import {
  AccountSegmentation,
  AccountStatus,
  OperationTypes,
  TransactionStartStatement,
  TransactionTypes,
} from '_account/enums'
import messages from '_account/messages'
import { Account } from '_account/model/account-model'
import { Transaction } from '_account/model/transaction-model'
import { AccountRepository } from '_account/repository/account-repository'
import { AccountSegmentationRepository } from '_account/repository/account-segmentation-repository'
import { AccountStatusRepository } from '_account/repository/account-status-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import { TransactionRepository } from '_account/repository/transaction-repository'
import { TransactionTypeRepository } from '_account/repository/transaction-type-repository'
import { AccountRequest } from '_account/use-case/create-account/payloads'
import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { DEFAULT_LIMIT } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { steps, params, generateUseCaseDebugLogMessage } from '_core/utils/use-case-debug-log-message'

export class CreateAccount implements BaseUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private accountStatusRepository: AccountStatusRepository,
    private accountSegmentationRepository: AccountSegmentationRepository,
    private transactionRepository: TransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,

    private logger: Logger
  ) {}

  async handle(request: AccountRequest): Promise<Account> {
    this.validate(request)

    const { externalUserId, fiatSymbol } = request

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.account.findAccount, {
        [params.account.externalUserId]: externalUserId,
        [params.account.fiatSymbol]: fiatSymbol,
      })
    )

    const fiat = await this.fiatRepository.findOne({
      select: ['id', 'symbol'],
      where: { symbol: fiatSymbol },
    })

    if (!fiat) {
      throw new DomainException(
        messages.invalidfiatSymbol.message,
        HttpStatusCode.NOT_FOUND,
        messages.invalidfiatSymbol.code
      )
    }

    const existingAccount = await this.accountRepository.findOne({ externalUserId, fiat })

    if (existingAccount) {
      throw new DomainException(
        messages.accountAlreadyExists.message,
        HttpStatusCode.BAD_REQUEST,
        messages.accountAlreadyExists.code
      )
    }

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.account.createAccount, {
        [params.account.externalUserId]: externalUserId,
        [params.account.fiatSymbol]: fiatSymbol,
        [params.account.fiatId]: fiat.id,
      })
    )

    const limit = DEFAULT_LIMIT.limit
    const status = await this.accountStatusRepository.findOneOrFail({ slug: AccountStatus.ACTIVE })
    const segmentation = await this.accountSegmentationRepository.findOneOrFail({ slug: AccountSegmentation.NORMAL })
    const balance = Number(TransactionStartStatement.DEFAULT_AMOUNT)

    const account = this.accountRepository.create({
      externalUserId,
      fiat,
      limit,
      balance,
      status,
      segmentation,
    })

    await this.accountRepository.save(account)

    const transactionStart = await this.createStartTransaction(account)

    await this.transactionRepository.save(transactionStart)

    return account
  }

  private validate(request: AccountRequest): void {
    const payloadRequest = AccountRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.accountValidationError.code
      )
    }
  }

  private async createStartTransaction(account: Account): Promise<Transaction> {
    const transactionType = await this.transactionTypeRepository.findOneOrFail({ slug: TransactionTypes.START })
    const amount = Number(TransactionStartStatement.DEFAULT_AMOUNT)
    const externalIdentifier = String(TransactionStartStatement.DEFAULT_EXTERNAL_ID)
    const description = 'Criação da Conta'
    const operationType = OperationTypes.CREDIT

    const transaction = await this.transactionRepository.create({
      account,
      amount,
      description,
      externalIdentifier,
      transactionType,
      operationType,
    })

    await this.transactionRepository.save(transaction)

    return transaction
  }
}
