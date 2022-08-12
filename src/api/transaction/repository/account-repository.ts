import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import messages from '_transaction/messages'
import { Account } from '_transaction/model/account-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  /**
   * Reload an entity from the database
   * @param account
   */
  async reload(account: Account): Promise<Account> {
    const accountUpToDate = await this.findOneOrFail(account.id)

    if (!accountUpToDate) {
      throw new DomainException(
        messages.accountNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountNotFound.code
      )
    }

    return accountUpToDate
  }

  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
