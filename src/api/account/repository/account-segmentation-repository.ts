import { AccountSegmentation } from '_account/model/account-segmentation-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(AccountSegmentation)
export class AccountSegmentationRepository extends Repository<AccountSegmentation> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
