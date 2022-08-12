import { Transaction } from '../model/transaction-model'

export interface Statement {
  haveTransactions: boolean
  statement: Array<Transaction>
  totalResults: number
  months: Array<string>
  currentPage: number
  perPage: number
  totalPages: number
  balance?: number
}
