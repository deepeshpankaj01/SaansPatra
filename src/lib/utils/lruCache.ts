import crypto from 'node:crypto';

interface CacheEntry<V> {
  value: V;
  expiry: number;
}

/**
 * High-performance O(1) Least-Recently-Used (LRU) Cache with Time-To-Live (TTL) eviction.
 * Uses JavaScript's insertion-ordered Map for true O(1) get, set, and eviction.
 */
export class LRUCache<K, V> {
  private readonly maxEntries: number;
  private readonly defaultTtlMs: number;
  private readonly map = new Map<K, CacheEntry<V>>();

  constructor(options: { maxEntries?: number; defaultTtlMs?: number } = {}) {
    this.maxEntries = options.maxEntries ?? 500;
    this.defaultTtlMs = options.defaultTtlMs ?? 1000 * 60 * 15; // 15 minutes default TTL
  }

  /**
   * Retrieves an entry in O(1) time and marks it as Most Recently Used.
   */
  get(key: K): V | undefined {
    const entry = this.map.get(key);
    if (!entry) return undefined;

    // Check TTL expiration
    if (Date.now() > entry.expiry) {
      this.map.delete(key);
      return undefined;
    }

    // Refresh LRU position by re-inserting
    this.map.delete(key);
    this.map.set(key, entry);
    return entry.value;
  }

  /**
   * Stores an entry in O(1) time, evicting the oldest element if max capacity is exceeded.
   */
  set(key: K, value: V, ttlMs?: number): void {
    if (this.map.has(key)) {
      this.map.delete(key);
    } else if (this.map.size >= this.maxEntries) {
      // Evict oldest (first) key in O(1)
      const oldestKey = this.map.keys().next().value;
      if (oldestKey !== undefined) {
        this.map.delete(oldestKey);
      }
    }

    const expiry = Date.now() + (ttlMs ?? this.defaultTtlMs);
    this.map.set(key, { value, expiry });
  }

  /**
   * Check if a key exists and is unexpired in O(1) time.
   */
  has(key: K): boolean {
    return this.get(key) !== undefined;
  }

  /**
   * Remove a specific key.
   */
  delete(key: K): boolean {
    return this.map.delete(key);
  }

  /**
   * Clear all cached items.
   */
  clear(): void {
    this.map.clear();
  }

  /**
   * Current number of entries in the cache.
   */
  get size(): number {
    return this.map.size;
  }
}

/**
 * Cryptographic SHA-256 content hashing for deterministic cache keys.
 */
export function computeHash(data: unknown): string {
  const content = typeof data === 'string' ? data : JSON.stringify(data);
  return crypto.createHash('sha256').update(content).digest('hex');
}
