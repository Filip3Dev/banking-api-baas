import { CacheAdapter, CacheValue } from '_core/adapter/interfaces/cache-interfaces'
import { CACHE_CONFIG } from '_core/constants'
import NodeCache from 'node-cache'

class Cache implements CacheAdapter {
  constructor(private cacheService = new NodeCache()) {}

  get<T>(key: string): T | undefined {
    return this.cacheService.get(key)
  }

  set<T>(key: string, value: T, ttl = CACHE_CONFIG.defaultTtlSeconds): boolean {
    return this.cacheService.set(key, value, ttl)
  }

  del(keys: string[] | string): number {
    return this.cacheService.del(keys)
  }

  setMany(cacheValues: CacheValue[]): boolean {
    return this.cacheService.mset(cacheValues)
  }

  getMany<T>(keys: string[]): Record<string, T> {
    return this.cacheService.mget(keys)
  }

  clearAllCache(): void {
    this.cacheService.flushAll()
  }
}

// Singleton
export default new Cache()
