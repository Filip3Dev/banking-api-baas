import {
  externalIdentifier,
  amount,
  page,
  pageSize,
  month,
  userId,
  externalUserId,
  description,
  fiatSymbol,
  symbol,
  transactionTypeSlug,
  operationType,
} from '_transaction/use-case/payloads'
import { z } from 'zod'

export const TransactionRequest = z.object({
  amount,
  externalIdentifier,
  userId,
  description,
  symbol,
  transactionTypeSlug,
  operationType,
})

export type TransactionRequest = z.infer<typeof TransactionRequest>

export const StatementRequest = z.object({
  page,
  externalUserId,
  fiatSymbol,
  month,
  pageSize,
})

export type StatementRequest = z.infer<typeof StatementRequest>
