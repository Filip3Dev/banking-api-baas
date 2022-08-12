export type FeesResponse = {
  digitalAccountFee: number
  exchangeFee: number
}

export type FeeMultiplicationFactorsResponse = {
  digitalAccountFeeMultiplicationFactor: number
  exchangeFeeMultiplicationFactor: number
}

export interface BaseUseCase {
  handle(request: unknown): Promise<unknown>
}

export interface Job {
  init(): Promise<unknown>
}

export type WithdrawFeeRelatedData = {
  digitalAccountWithdrawFee: number
  digitalAccountWithdrawFeeAmount: number
  digitalAccountWithdrawFeeDiscountedAmount: number
}
