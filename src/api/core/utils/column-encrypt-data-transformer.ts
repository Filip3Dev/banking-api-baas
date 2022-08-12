import { CryptoHashingHandler } from '_core/services/crypto-hashing-handler'

export class ColumnEncryptDataTransformer {
  private hashingHandler = new CryptoHashingHandler()

  to(value: string): string {
    if (!value) return null
    return this.hashingHandler.encrypt(value)
  }

  from(value: string): string {
    if (!value) return null
    return this.hashingHandler.decrypt(value)
  }
}
