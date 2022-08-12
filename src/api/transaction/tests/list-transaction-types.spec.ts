import { DB_CONNECTION_NAMES } from '_core/constants'
import { HttpStatusCode } from '_core/enums'
import messages from '_transaction/messages'
import { TransactionTypeRepository } from '_transaction/repository/transaction-type-repository'
import { makeTransactionType } from '_transaction/tests/helpers/make-functions'
import { ListTransactionTypes } from '_transaction/use-case/list-transaction-types'
import { getCustomRepository } from 'typeorm'

import exceptions from './exceptions'

let transactionTypeRepository: TransactionTypeRepository = undefined
let listTransactionTypes: ListTransactionTypes = undefined
beforeEach(async () => {
  transactionTypeRepository = getCustomRepository(TransactionTypeRepository, DB_CONNECTION_NAMES.TEST)
  await transactionTypeRepository.removeAll()

  listTransactionTypes = new ListTransactionTypes(transactionTypeRepository)
})

it('list transaction types ', async () => {
  await makeTransactionType()
  const result = await listTransactionTypes.handle()
  expect(result.length).toBeGreaterThan(0)
  expect(result.length).toBe(1)
})

it('list transaction types with empty result ', async () => {
  expect(async () => {
    await listTransactionTypes.handle()
  }).rejects.toMatchObject({
    name: exceptions.domainException,
    message: messages.resultNotFound.message,
    code: HttpStatusCode.NOT_FOUND,
    codeAsString: messages.resultNotFound.code,
  })
})
