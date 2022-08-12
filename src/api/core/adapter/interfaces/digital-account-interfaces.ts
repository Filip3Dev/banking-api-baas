export interface DigitalAccountAdapter {
  generateToken(): Promise<ExchangeToken>
  transferFromUserToBBX(
    userToken: string,
    pin: string,
    total: number,
    transactionId: number
  ): Promise<DigitalAccountTransferResponse>
  transferFromBBXToUser(
    userToken: string,
    pin: string,
    total: number,
    transactionId: number
  ): Promise<DigitalAccountTransferResponse>
  revertTransfer(bankTransferId: string): Promise<DigitalAccountRevertTransferResponse>
  validatePin(userToken: string, pin: string): Promise<DigitalAccountValidatePinResponse>
}

export type ExchangeToken = {
  value: string
  ttlSeconds: number
}

export type BaseDigitalAccountResponse = {
  msg: string
  acao: null
}

export type DigitalAccountRevertTransferResponse = DigitalAccountTransferResponse

export type DigitalAccountValidatePinResponse = BaseDigitalAccountResponse

export type DigitalAccountGenerateTokenResponse = {
  token_type: string
  expires_in: number
  access_token: string
}

export type DigitalAccountTransferResponse = {
  id: number
}
