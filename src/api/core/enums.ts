export enum HttpStatusCode {
  OK = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export enum TransactionStatuses {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum TransferTypes {
  DEPOSIT = 'DEPOSIT',
  WITHDRAW = 'WITHDRAW',
}

export enum FeeOrigin {
  DIGITAL_ACCOUNT = 'DIGITAL_ACCOUNT',
  EXCHANGE = 'EXCHANGE',
}

export enum TransactionRevertStatuses {
  EXCHANGE_TRANSFER_REVERT = 'exchange_transfer_revert',
  DIGITAL_ACCOUNT_TRANSFER_REVERT = 'digital_account_transfer_revert',
  DIGITAL_ACCOUNT_TRANSFER_BRL_TO_USER = 'digital_account_transfer_brl_to_user',
  COMPLETED = 'completed',
}

export enum DepositHistoryStatuses {
  PENDING = 0,
  CREDITED_BUT_CANNOT_WITHDRAW = 6,
  SUCCESS = 1,
}

export enum WithdrawHistoryStatuses {
  EMAIL_SENT = 0,
  CANCELLED = 1,
  AWAITING_APPROVAL = 2,
  REJECTED = 3,
  PROCESSING = 4,
  FAILURE = 5,
  COMPLETED = 6,
}
