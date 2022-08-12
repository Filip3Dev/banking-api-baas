export default {
  noSingleAssetPriceByExchange: {
    message: 'No single asset price were provided',
    code: 'no_single_asset_price',
  },
  failAtExchangeGetAssetsPrice: {
    code: 'fail_at_exchange_get_assets_price',
  },
  failAtExchangeGetSingleAssetPrice: {
    code: 'fail_at_exchange_get_single_asset_price',
  },
  failAtExchangeGetAssetPricesByPeriod: {
    code: 'fail_at_exchange_get_asset_prices_by_period',
  },
  failAtGetExchangeInformationByAsset: {
    code: 'fail_at_get_exchange_information_by_asset',
  },
  failAtExchangeGetAccountInformation: {
    code: 'fail_at_exchange_get_account_information',
  },
  failAtExchangeCreateSubAccount: {
    code: 'fail_at_exchange_create_sub_account',
  },
  failAtExchangeCreateSubAccountApi: {
    code: 'fail_at_exchange_create_sub_account_api',
  },
  failAtExchangeGetSubAccount: {
    code: 'fail_at_exchange_get_sub_account',
  },
  failAtExchangeTransferToSubAccount: {
    code: 'fail_at_exchange_transfer_to_sub_account',
  },
  failAtExchangeTransferToMasterAccount: {
    code: 'fail_at_exchange_transfer_to_master_account',
  },
  failAtExchangeGetAccountTransfer: {
    code: 'fail_at_exchange_get_account_transfer',
  },
  failAtExchangeCreateOrder: {
    code: 'fail_at_exchange_create_order',
  },
  failAtDigitalAccountTransferFromUserToBBX: {
    code: 'fail_at_digital_account_transfer_from_user_to_bbx',
  },
  failAtDigitalAccountTransferFromBBXToUser: {
    code: 'fail_at_digital_account_transfer_from_bbx_to_user',
  },
  failAtDigitalAccountRevertTransfer: {
    code: 'fail_at_digital_account_revert_transfer',
  },
  failAtDigitalAccountValidatePin: {
    code: 'fail_at_digital_account_validate_pin',
  },
  failAtDigitalAccountGenerateToken: {
    code: 'fail_at_digital_account_generate_token',
  },
  assetMinimumAmountValidationError: {
    message: (minimumAmount: number, symbol: string): string =>
      `The amount must be at least ${minimumAmount} in ${symbol}`,
    code: 'asset_minimum_amount_validation_error',
  },
  assetMaximumAmountValidationError: {
    message: (maximumAmount: number, symbol: string): string =>
      `The amount must be at most ${maximumAmount} in ${symbol}`,
    code: 'asset_maximum_amount_validation_error',
  },
  assetMinimumQuantityValidationError: {
    message: (minimumQuantity: number, symbol: string): string =>
      `The quantity must be at least ${minimumQuantity} ${symbol}`,
    code: 'asset_minimum_quantity_validation_error',
  },
  assetMaximumQuantityValidationError: {
    message: (maximumQuantity: number, symbol: string): string =>
      `The quantity must be at most ${maximumQuantity} ${symbol}`,
    code: 'asset_maximum_quantity_validation_error',
  },
  failToGetBuyingFeeData: {
    message: 'Fail to get buying fee data',
    code: 'fail_to_get_buying_fee_data',
  },
  failToGetSellingFeeData: {
    message: 'Fail to get selling fee data',
    code: 'fail_to_get_selling_fee_data',
  },
  failToGetWithdrawFeeData: {
    message: 'Fail to get withdraw fee data',
    code: 'fail_to_get_withdraw_fee_data',
  },
  noSymbolsMetadataByProvider: {
    message: 'No symbols metadata were provided by Asset Metadata provider',
    code: 'no_symbols_metadata',
  },
  noMetadataIdsByProvider: {
    message: 'No metadata ids were provided by Asset Metadata provider',
    code: 'no_metadata_ids_metadata',
  },
  insufficientAssetBalance: {
    message: (symbol: string): string => `Insufficient ${symbol} balance`,
    code: 'insufficient_asset_balance',
  },
  failAtExchangeGetAccountBalances: {
    code: 'fail_to_get_account_balances',
  },
  failAtExchangeGetAllCoinsInformation: {
    code: 'fail_to_get_all_coins_information',
  },
  noAssetCoinInformationByExchange: {
    message: 'No asset coin information were provided',
    code: 'no_asset_coin_information',
  },
  failAtExchangeGetDepositAddress: {
    code: 'fail_to_get_deposit_address',
  },
  failAtExchangeGetDepositHistory: {
    code: 'fail_to_get_deposit_history',
  },
  failAtExchangeGetWithdrawHistory: {
    code: 'fail_to_get_withdraw_history',
  },
  failAtExchangeSendWithdraw: {
    code: 'fail_to_get_withdraw_history',
  },
}
