import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import messages from '_transaction/messages'
import { Account } from '_transaction/model/account-model'
import { AccountRepository } from '_transaction/repository/account-repository'
import { FiatRepository } from '_transaction/repository/fiat-repository'

export async function getAccountByExternalUserIdAndFiatSymbol(
  externalUserId: string,
  fiatSymbol: string,
  accountRepository: AccountRepository,
  fiatRepository: FiatRepository
): Promise<Account> {
  const fiat = await fiatRepository.findOne({ symbol: fiatSymbol })
  if (!fiat) {
    throw new DomainException(messages.fiatNotFound.message, HttpStatusCode.NOT_FOUND, messages.fiatNotFound.code)
  }
  const account = await accountRepository.findOne({ externalUserId, fiat })

  if (!account) {
    throw new DomainException(messages.accountNotFound.message, HttpStatusCode.NOT_FOUND, messages.accountNotFound.code)
  }

  return account
}
