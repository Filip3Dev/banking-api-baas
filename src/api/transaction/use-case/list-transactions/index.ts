import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { steps, params, generateUseCaseDebugLogMessage } from '_core/utils/use-case-debug-log-message'
import { Statement } from '_transaction/@types'
import messages from '_transaction/messages'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'
import { TransactionRepository } from '_transaction/repository/transaction-repository'
import { StatementRequest } from '_transaction/use-case/list-transactions/payloads'
import { endOfMonth, startOfMonth, parse, isValid } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
export class ListTransactions implements BaseUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private transactionRepository: TransactionRepository,
    private logger: Logger
  ) {}

  public async handle(req: StatementRequest): Promise<Statement> {
    this.validate(req)

    const { month, externalUserId, fiatSymbol, page, pageSize } = req

    this.logger.debug(
      generateUseCaseDebugLogMessage(this, steps.account.findAccount, {
        [params.account.externalUserId]: externalUserId,
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

    const account = await this.accountRepository.findOne({
      select: ['id', 'isBlocked', 'balance'],
      where: { externalUserId },
    })

    if (!account) {
      throw new DomainException(
        messages.accountNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountNotFound.code
      )
    }

    const data = parse(month, 'MMM/yyyy', new Date(), { locale: ptBR })
    if (!isValid(data)) {
      throw new DomainException(messages.invalidMonth.message, HttpStatusCode.NOT_FOUND, messages.invalidMonth.code)
    }
    const dateInitial = startOfMonth(new Date(data))
    const dateFinal = endOfMonth(new Date(data))

    const result = await this.transactionRepository.findTransactionsByDateAndAccount(
      dateInitial,
      dateFinal,
      Number(account.id),
      page,
      pageSize
    )

    result.statement.map((e) => (e.operationType === 'DEBIT' ? (e.amount = e.amount * -1) : e.amount))
    result.balance = account.balance

    return result
  }

  private validate(request: StatementRequest): void {
    const payloadRequest = StatementRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.invalidExternalUserId.message
      )
    }
  }
}
