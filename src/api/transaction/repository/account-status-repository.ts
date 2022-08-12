import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { AccountStatus as AccountStatusConstants } from '_transaction/enums'
import messages from '_transaction/messages'
import { AccountStatus } from '_transaction/model/account-status-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(AccountStatus)
export class AccountStatusRepository extends Repository<AccountStatus> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }

  async findBySlug(slug: AccountStatusConstants): Promise<AccountStatus> {
    const accountStatus = await this.findOne({ slug })

    if (!accountStatus) {
      throw new DomainException(
        messages.accountStatusNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountStatusNotFound.code
      )
    }

    return accountStatus
  }
}
