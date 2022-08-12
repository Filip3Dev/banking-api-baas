export enum OperationTypes {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum TransactionTypes {
  BUY_CRYPTO = 'BUY_CRYPTO',
  CASH_IN = 'CASH_IN',
  CASH_OUT = 'CASH_OUT',
  DEPOSIT_FINANCE = 'DEPOSIT_FINANCE',
  REVERT_IN = 'REVERT_IN',
  REVERT_OUT = 'REVERT_OUT',
  SELL_CRYPTO = 'SELL_CRYPTO',
  START = 'START',
  TRANSFER_BAAS_WALLET = 'TRANSFER_BAAS_WALLET',
  TRANSFER_P2P_WALLET = 'TRANSFER_P2P_WALLET',
  WITHDRAW_FINANCE = 'WITHDRAW_FINANCE',
}

export enum TransactionStartStatement {
  DEFAULT_AMOUNT = 0,
  DEFAULT_TRANSACTION_TYPE = 'START',
  DEFAULT_EXTERNAL_ID = '0',
}

export enum AccountStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

export enum AccountSegmentation {
  NORMAL = 'NORMAL',
}