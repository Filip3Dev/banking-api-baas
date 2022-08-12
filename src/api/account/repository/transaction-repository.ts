import messages from '_account/messages'
import { Transaction } from '_account/model/transaction-model'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import { EntityRepository, Repository } from 'typeorm'

@EntityRepository(Transaction)
export class TransactionRepository extends Repository<Transaction> {
  /**
   * Reload an entity from the database
   * @param transaction
   */
  async reload(transaction: Transaction): Promise<Transaction> {
    const transactionUpToDate = await this.findOneOrFail(transaction.id)
    if (!transactionUpToDate) {
      throw new DomainException(
        messages.transactionNotFound.message,
        HttpStatusCode.NOT_FOUND,
        messages.transactionNotFound.code
      )
    }
    return transactionUpToDate
  }

  async removeAll(): Promise<void> {
    await this.remove(await this.find())
  }
}
