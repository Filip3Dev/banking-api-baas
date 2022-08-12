export interface JWTPayload {
  sub: string
}

export interface JWTAdapter {
  decode(token: string): Promise<JWTPayload>
}
