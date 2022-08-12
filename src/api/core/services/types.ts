export interface AssetPriceConverter {
  convertAssetPriceToBRL(assetPrice: number, amount: number, symbol: string): number
  convertBRLtoBaseAssetPrice(amountBRL: number): number
  loadBRLPrice(): Promise<void>
  getBaseAssetPriceQuotation(): number
}

export interface HashingHandler {
  availableCommonAlgorithms: Record<string, string>
  hash(sourceString: string, algorithm?: string, length?: number, salt?: string): string
  verify(hashedString: string, plainString: string, algorithm?: string, length?: number): boolean
  createHmac(key: string, data: string, algorithm?: string, encoding?: string): string
  randomUUID(options?: Record<string, unknown>): string
  encrypt(data: string, algorithm?: string, salt?: string, length?: number): string
  decrypt(dataBundle: string, algorithm?: string, length?: number): string
}
