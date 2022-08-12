export const validationErrorMessages = {}

export const httpClientResponseErrorMessages = {
  insufficientFiatBalance: (symbol: string): string => `Insufficient ${symbol} balance`,
  accountIsBlocked: `Account is Blocked`,
}
