import {
  externalIdentifier,
  amount,
  externalUserId,
  description,
  symbol,
  transactionTypeSlug,
  reason,
} from '_transaction/use-case/payloads'
import { z } from 'zod'

export const TransactionRequest = z.object({
  amount,
  externalIdentifier,
  externalUserId,
  description,
  symbol,
  transactionTypeSlug,
  reason,
})

export type TransactionRequest = z.infer<typeof TransactionRequest>
