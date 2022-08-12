import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { generateUseCaseDebugLogMessage, params, steps } from '_core/utils/use-case-debug-log-message'
import { OperationTypes } from '_transaction/enums'
import messages from '_transaction/messages'
import { Transaction } from '_transaction/model/transaction-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { getConnection } from 'typeorm'

import { TransactionP2PRequest } from './payloads'

export class P2PTransaction implements BaseUseCase {
  constructor(
    private transactionRepository: TransactionRepository,
    private transactionTypeRepository: TransactionTypeRepository,
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private logger: Logger
  ) {}

  async handle(request: TransactionP2PRequest): Promise<Transaction> {
    this.validate(request)

    const { extUserIdIn, extUserIdOut, amount, fiatSymbol } = request

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.transaction.startP2PTransferProcess, {
        [params.account.externalUserId]: `${extUserIdIn} -> ${extUserIdOut}`,
        [params.transaction.amountBRL]: amount,
        [params.account.fiatSymbol]: fiatSymbol,
      })
    )

    const fiat = await this.fiatRepository.findOne({ symbol: fiatSymbol })
    if (!fiat) {
      throw new DomainException(
        messages.invalidfiatSymbol.message,
        HttpStatusCode.NOT_FOUND,
        messages.invalidfiatSymbol.code
      )
    }

    const account1 = await this.accountRepository.findOne({ externalUserId: extUserIdIn, fiat })
    const account2 = await this.accountRepository.findOne({ externalUserId: extUserIdOut, fiat })
    if (!account1 || !account2) {
      throw new DomainException(
        messages.accountNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountNotFound.code
      )
    }

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.transaction.findAccountById, {
        [params.account.externalUserId]: `${account1.id}, ${account2.id}`,
        [params.account.fiatSymbol]: fiatSymbol,
      })
    )

    if (account1.balance < amount) {
      throw new DomainException(
        messages.insufficientFiatBalance.message(fiatSymbol),
        HttpStatusCode.BAD_REQUEST,
        messages.insufficientFiatBalance.code
      )
    }

    const typeOut = await this.transactionTypeRepository.findBySlug('TRANSACTION_OUT_P2P')

    const transaction1 = await this.transactionRepository.create({
      accountId: account1.id,
      amount,
      description: `Transferência P2P - ${amount} ${fiatSymbol}`,
      transactionType: typeOut,
      externalIdentifier: '0',
      operationType: OperationTypes.DEBIT,
      reason: '',
    })

    account1.balance -= amount
    transaction1.account = account1

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.transaction.p2pDebitTransfer, {
        accountId: account1.id,
        amount,
        description: 'P2P DEBIT Transfer',
      })
    )

    const typeIn = await this.transactionTypeRepository.findBySlug('TRANSACTION_IN_P2P')

    const transaction2 = await this.transactionRepository.create({
      accountId: account2.id,
      amount,
      description: `Transferência P2P - ${amount} ${fiatSymbol}`,
      transactionType: typeIn,
      externalIdentifier: '0',
      operationType: OperationTypes.CREDIT,
      reason: '',
    })

    account2.balance += amount
    transaction2.account = account2

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.transaction.p2pCreditTransfer, {
        accountId: account2.id,
        amount,
        description: 'P2P CREDIT Transfer',
      })
    )

    const queryRunner = await getConnection().createQueryRunner()
    await queryRunner.startTransaction()
    try {
      await this.transactionRepository.save(transaction1)
      await this.accountRepository.save(account1)
      await this.transactionRepository.save(transaction2)
      await this.accountRepository.save(account2)
    } catch (error) {
      this.logger.debug(
        generateUseCaseDebugLogMessage(this, `ERROR P2P Transaction`, {
          accountIds: `${account1.id} - ${account2.id}`,
          amount,
          description: 'Transferência P2P',
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

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.completeUseCase, {
        account1_balance: account1.balance,
        account2_balance: account2.balance,
        description: 'P2P Transfer OK',
      })
    )

    return transaction2
  }

  private validate(request: TransactionP2PRequest): void {
    const payloadRequest = TransactionP2PRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.invalidPayloadValidation.message
      )
    }
  }
}
