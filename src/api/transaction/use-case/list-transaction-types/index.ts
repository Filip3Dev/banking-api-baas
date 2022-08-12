import { BaseUseCase } from '_core/adapter/interfaces/interfaces'
import { HttpStatusCode } from '_core/enums'
import { DomainException } from '_core/exceptions/domain-exceptions'
import messages from '_transaction/messages'
import { TransactionType } from '_transaction/model/transaction-type-model'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'

export class ListTransactionTypes implements BaseUseCase {
  constructor(private transactionTypeRepository: TransactionTypeRepository) {}

  public async handle(): Promise<TransactionType[]> {
    const result = await this.transactionTypeRepository.find()

    if (!result.length) {
      throw new DomainException(messages.resultNotFound.message, HttpStatusCode.NOT_FOUND, messages.resultNotFound.code)
    }
    return result
  }
}
