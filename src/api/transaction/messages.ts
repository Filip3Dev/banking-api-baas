export default {
  invalidAmount: {
    message: 'Invalid amount',
    code: 'invalid_amount',
  },
  amountNotProvided: {
    message: 'Amount not provided',
  },
  invalidExternalUserId: {
    message: 'Invalid external user id',
    code: 'invalid_external_user_id',
  },
  invalidDescription: {
    message: 'Description is invalid',
  },
  transactionValidationError: {
    code: 'transaction_validation_error',
  },
  invalidfiatSymbol: {
    message: 'Invalid fiat symbol',
    code: 'invalid_fiat_symbol',
  },
  assetInvalidSymbol: {
    message: 'Symbol must be alphanumeric',
  },
  assetInvalidType: {
    message: 'Type is invalid',
  },
  fiatNotFound: {
    message: 'Fiat not found',
    code: 'fiat_not_found',
  },
  accountNotFound: {
    message: 'Account not found',
    code: 'account_not_found',
  },
  transactionTypeNotFound: {
    message: 'Transaction Type not found',
    code: 'transaction_type_not_found',
  },
  accountStatusNotFound: {
    message: 'Account Status not found',
    code: 'account_status_not_found',
  },
  accountSegmentationStatusNotFound: {
    message: 'Account Segmentation not found',
    code: 'account_segmentation_not_found',
  },
  invalidExternalIdentifier: {
    message: 'External Identifier is invalid',
    code: 'external_identifier_is_invalid',
  },
  invalidSymbol: {
    message: 'Symbol is invalid',
    code: 'symbol_is_invalid',
  },
  invalidTypeSlug: {
    message: 'Type is invalid',
    code: 'type_is_invalid',
  },
  transactionNotFound: {
    message: 'Transaction Not Found',
    code: 'transaction_not_found',
  },
  insufficientFiatBalance: {
    message: (symbol: string): string => `Insufficient ${symbol} balance`,
    code: 'insufficient_fiat_balance',
  },
  invalidPage: {
    message: 'Invalid page',
    code: 'invalid_page',
  },
  invalidPageSize: {
    message: 'Invalid Page size',
    code: 'invalid_page_size',
  },
  pageNotProvided: {
    message: 'Page not provided',
  },
  pageSizeNotProvided: {
    message: 'Page size not provided',
  },
  invalidMonth: {
    message: 'Month is invalid',
    code: 'month_is_invalid',
  },
  resultNotFound: {
    message: 'Result not found',
    code: 'result_not_found',
  },
  invalidTransactionType: {
    message: 'Invalid transaction type',
    code: 'invalid_transaction_type',
  },
  invalidPayloadValidation: {
    message: 'Invalid payload validation',
    code: 'invalid_payload_validation',
  },

  transactionNotCreated: {
    message: 'Transaction cannot created',
    code: 'transaction_cannot_created',
  },
  accountIsBlocked: {
    message: 'Account is Blocked',
    code: 'account_is_blocked',
  },
}
