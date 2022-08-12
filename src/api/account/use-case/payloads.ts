import messages from '_account/messages'
import { z } from 'zod'

export const externalUserId = z
  .string({ required_error: messages.invalidExternalUserId.message })
  .regex(/^\d+$/, messages.invalidExternalUserId.message)

export const fiatSymbol = z
  .string({ required_error: messages.invalidfiatSymbol.message })
  .regex(/^([a-zA-Z0-9_-]){3,5}$/, messages.invalidfiatSymbol.message)
