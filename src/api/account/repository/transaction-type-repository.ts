import messages from '_account/messages'
import { TransactionType } from '_account/model/transaction-type-model'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(TransactionType)
export class TransactionTypeRepository extends Repository<TransactionType> {
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

  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
