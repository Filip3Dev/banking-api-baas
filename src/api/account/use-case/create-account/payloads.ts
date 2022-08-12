import { externalUserId, fiatSymbol } from '_account/use-case/payloads'
import { z } from 'zod'

export const AccountRequest = z.object({
  externalUserId,
  fiatSymbol,
})

export type AccountRequest = z.infer<typeof AccountRequest>
