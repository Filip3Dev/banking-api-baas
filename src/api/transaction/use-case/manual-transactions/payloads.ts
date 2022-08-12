import {
  amount,
  page,
  pageSize,
  month,
  externalUserId,
  description,
  symbol,
  transactionTypeSlug,
  externalIdentifier,
} from '_transaction/use-case/payloads'
import { z } from 'zod'

export const TransactionManualRequest = z.object({
  amount,
  externalUserId,
  description,
  transactionTypeSlug,
  symbol,
  externalIdentifier,
})

export type TransactionManualRequest = z.infer<typeof TransactionManualRequest>

export const StatementRequest = z.object({
  page,
  externalUserId,
  symbol,
  month,
  pageSize,
})

export type StatementRequest = z.infer<typeof StatementRequest>
