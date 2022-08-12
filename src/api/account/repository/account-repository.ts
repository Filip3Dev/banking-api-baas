import { Account } from '_account/model/account-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Account)
export class AccountRepository extends Repository<Account> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
