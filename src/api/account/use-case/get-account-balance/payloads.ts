import { externalUserId, fiatSymbol } from '_account/use-case/payloads'
import { z } from 'zod'

export const AccountBalanceRequest = z.object({
  externalUserId,
  fiatSymbol,
})

export type AccountBalanceRequest = z.infer<typeof AccountBalanceRequest>
