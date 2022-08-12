import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import messages from '_transaction/messages'
import { TransactionType } from '_transaction/model/transaction-type-model'
import { EntityRepository, Repository } from 'typeorm'

//TODO create repository
@EntityRepository(TransactionType)
export class TransactionTypeRepository extends Repository<TransactionType> {
  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }

  async findBySlug(slug: string): Promise<TransactionType> {
    const transactionType = await this.findOne({ slug })

    if (!transactionType) {
      throw new DomainException(
        messages.transactionTypeNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.transactionTypeNotFound.code
      )
    }

    return transactionType
  }
}
