import { amount, externalUserId, symbol } from '_transaction/use-case/payloads'
import { z } from 'zod'

export const TransactionP2PRequest = z.object({
  extUserIdIn: externalUserId,
  extUserIdOut: externalUserId,
  amount,
  fiatSymbol: symbol,
})

export type TransactionP2PRequest = z.infer<typeof TransactionP2PRequest>
