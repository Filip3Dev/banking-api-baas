import { AccountStatus } from '_account/model/account-status-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(AccountStatus)
export class AccountStatusRepository extends Repository<AccountStatus> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
