import { OperationTypes } from '_transaction/enums'
import messages from '_transaction/messages'
import { z } from 'zod'

export const amount = z
  .number({ required_error: messages.amountNotProvided.message })
  .positive({ message: messages.invalidAmount.message })

export const externalIdentifier = z
  .string({ required_error: messages.invalidExternalIdentifier.message })
  .regex(/^\d+$/, messages.invalidExternalIdentifier.message)

export const externalUserId = z
  .string({ required_error: messages.invalidExternalUserId.message })
  .regex(/^\d+$/, messages.invalidExternalUserId.message)

export const page = z
  .number({ required_error: messages.pageNotProvided.message })
  .positive({ message: messages.invalidPage.message })

export const pageSize = z
  .number({ required_error: messages.pageSizeNotProvided.message })
  .positive({ message: messages.invalidPageSize.message })

export const userId = z
  .string({ required_error: messages.invalidExternalUserId.message })
  .regex(/^\d+$/, messages.invalidExternalUserId.message)

export const fiatSymbol = z
  .string({ required_error: messages.invalidfiatSymbol.message })
  .regex(/^[a-zA-Z]+$/, messages.assetInvalidSymbol.message)

export const symbol = z
  .string({ required_error: messages.invalidSymbol.message })
  .min(3)
  .regex(/^[a-zA-Z]+$/, messages.assetInvalidSymbol.message)

export const month = z.string({ required_error: messages.invalidMonth.message }).min(5)

export const transactionTypeSlug = z
  .string({ required_error: messages.invalidTypeSlug.message })
  .min(3)
  .regex(/^[a-zA-Z0-9_]+$/, messages.assetInvalidType.message)

export const operationType = z.enum([OperationTypes.CREDIT, OperationTypes.DEBIT])

export const description = z.string().optional()

export const reason = z.string().optional()

export const transactionTypeId = z
  .number({ required_error: messages.invalidTransactionType.message })
  .positive({ message: messages.invalidTransactionType.message })
