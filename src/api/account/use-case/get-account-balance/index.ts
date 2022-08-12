import messages from '_account/messages'
import { Account } from '_account/model/account-model'
import { AccountRepository } from '_account/repository/account-repository'
import { FiatRepository } from '_account/repository/fiat-repository'
import { AccountBalanceRequest } from '_account/use-case/get-account-balance/payloads'
import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { Logger } from '_core/adapter/interfaces/logger-interfaces'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { steps, params, generateUseCaseDebugLogMessage } from '_core/utils/use-case-debug-log-message'

export class GetAccountBalance implements BaseUseCase {
  constructor(
    private accountRepository: AccountRepository,
    private fiatRepository: FiatRepository,
    private logger: Logger
  ) {}

  async handle(request: AccountBalanceRequest): Promise<Account> {
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

    const account = await this.accountRepository.findOne({
      where: { externalUserId, fiat },
    })

    if (!account) {
      throw new DomainException(
        messages.accountNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountNotFound.code
      )
    }

    account.fiat = fiat

    await this.accountRepository.save(account)
    this.logger.debug(generateUseCaseDebugLogMessage(this, steps.completeUseCase))
    return account
  }

  private validate(request: AccountBalanceRequest): void {
    const payloadRequest = AccountBalanceRequest.safeParse(request)
    if (payloadRequest.success === false) {
      throw new DomainException(
        payloadRequest.error.issues[0].message,
        HttpStatusCode.BAD_REQUEST,
        messages.accountValidationError.code
      )
    }
  }
}
