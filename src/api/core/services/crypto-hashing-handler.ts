import { HashingHandler } from '_core/services/types'
import crypto, { BinaryToTextEncoding, RandomUUIDOptions, scryptSync } from 'crypto'

export const availableCommonAlgorithms = {
  DSA: 'DSA',
  DSA_SHA: 'DSA-SHA',
  DSA_SHA1: 'DSA-SHA1',
  RSA_MD4: 'RSA-MD4',
  RSA_MD5: 'RSA-MD5',
  RSA_SHA: 'RSA-SHA',
  RSA_SHA1: 'RSA-SHA1',
  RSA_SHA256: 'RSA-SHA256',
  RSA_SHA384: 'RSA-SHA384',
  RSA_SHA512: 'RSA-SHA512',
  MD4: 'md4',
  MD5: 'md5',
  SHA: 'sha',
  SHA1: 'sha1',
  SHA256: 'sha256',
  SHA384: 'sha384',
  SHA512: 'sha512',
  WHIRLPOOL: 'whirlpool',
  AES_192_CBC: 'aes-192-cbc',
}

export class CryptoHashingHandler implements HashingHandler {
  private saltSize = 16
  private hashEncoding: BufferEncoding = 'hex'
  private digestEncoding: BinaryToTextEncoding = 'hex'
  private iterationCount = 1000

  private defaultHashingAlgorithm = availableCommonAlgorithms.SHA512
  private defaultHashingLength = 64
  private password = process.env.PRIVATE_KEY

  public availableCommonAlgorithms = availableCommonAlgorithms

  hash(plainString: string, algorithm?: string, length?: number, salt?: string): string {
    algorithm = algorithm ?? this.defaultHashingAlgorithm
    length = length ?? this.defaultHashingLength
    salt = salt ?? this.generateSalt()

    return (
      salt +
      ':' +
      crypto.pbkdf2Sync(plainString, salt, this.iterationCount, length, algorithm).toString(this.hashEncoding)
    )
  }

  verify(hashedString: string, plainString: string, algorithm?: string, length?: number): boolean {
    algorithm = algorithm ?? this.defaultHashingAlgorithm
    length = length ?? this.defaultHashingLength
    const salt = hashedString.split(':')[0]

    return hashedString === this.hash(plainString, algorithm, length, salt)
  }

  private generateSalt(): string {
    return crypto.randomBytes(this.saltSize).toString(this.hashEncoding)
  }

  createHmac(key: string, data: string, algorithm?: string, encoding?: string): string {
    return crypto
      .createHmac(algorithm ?? this.defaultHashingAlgorithm, key)
      .update(data)
      .digest((encoding as BinaryToTextEncoding) ?? this.digestEncoding)
  }

  randomUUID(options?: Record<string, unknown>): string {
    return crypto.randomUUID(options as RandomUUIDOptions)
  }

  encrypt(
    data: string,
    algorithm = availableCommonAlgorithms.AES_192_CBC,
    salt = this.generateSalt(),
    length = 24
  ): string {
    const key = scryptSync(this.password, salt, length)
    const iv = crypto.randomFillSync(new Uint8Array(16))
    const cipher = crypto.createCipheriv(algorithm, key, iv)

    let encrypted = cipher.update(data, 'utf8', 'hex')
    encrypted += cipher.final('hex')

    return salt + ':' + iv.toString() + ':' + encrypted
  }

  decrypt(dataBundle: string, algorithm = availableCommonAlgorithms.AES_192_CBC, length = 24): string {
    const [salt, encryptedIv, encryptedData] = dataBundle.split(':')
    const iv = new Uint8Array(encryptedIv.split(',').map((i: string): number => parseInt(i)))

    const key = scryptSync(this.password, salt, length)
    const decipher = crypto.createDecipheriv(algorithm, key, iv)

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  }
}
