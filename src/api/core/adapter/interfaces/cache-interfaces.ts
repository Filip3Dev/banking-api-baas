export interface CacheValue {
  key: string
  val: unknown
  ttl?: number
}

export interface CacheAdapter {
  get<T>(key: string): T | undefined
  set<T>(key: string, value: T, ttl: number): boolean
  del(keys: string[] | string): number
  setMany(cacheValues: CacheValue[]): boolean
  getMany<T>(keys: string[]): Record<string, T>
  clearAllCache(): void
}
