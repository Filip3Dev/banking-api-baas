import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { AccountSegmentation as AccountSegmentationConstants } from '_transaction/enums'
import messages from '_transaction/messages'
import { AccountSegmentation } from '_transaction/model/account-segmentation-model'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(AccountSegmentation)
export class AccountSegmentationRepository extends Repository<AccountSegmentation> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }

  async findBySlug(slug: AccountSegmentationConstants): Promise<AccountSegmentation> {
    const accountStatus = await this.findOne({ slug })

    if (!accountStatus) {
      throw new DomainException(
        messages.accountSegmentationStatusNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.accountSegmentationStatusNotFound.code
      )
    }

    return accountStatus
  }
}
