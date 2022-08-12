import { JWTAdapter, JWTPayload } from '_core/adapter/interfaces/jsonwebtoken-interfaces'
import { decode } from 'jsonwebtoken'

export class JsonWebToken implements JWTAdapter {
  async decode(token: string): Promise<JWTPayload> {
    return decode(token) as JWTPayload
  }
}
