import { describe, it, expect } from 'vitest';
import { LRUCache, computeHash } from '@/lib/utils/lruCache';

describe('LRUCache', () => {
  it('stores and retrieves values in O(1)', () => {
    const cache = new LRUCache<string, number>({ maxEntries: 3 });
    cache.set('a', 1);
    cache.set('b', 2);

    expect(cache.get('a')).toBe(1);
    expect(cache.get('b')).toBe(2);
    expect(cache.get('c')).toBeUndefined();
    expect(cache.size).toBe(2);
  });

  it('evicts the least recently used item when maxEntries is reached', () => {
    const cache = new LRUCache<string, number>({ maxEntries: 2 });
    cache.set('a', 10);
    cache.set('b', 20);

    // Access 'a' to make 'b' the least recently used
    expect(cache.get('a')).toBe(10);

    // Insert 'c', which should evict 'b'
    cache.set('c', 30);

    expect(cache.get('a')).toBe(10);
    expect(cache.get('b')).toBeUndefined();
    expect(cache.get('c')).toBe(30);
    expect(cache.size).toBe(2);
  });

  it('evicts items after TTL expires', async () => {
    const cache = new LRUCache<string, string>({ maxEntries: 5, defaultTtlMs: 20 });
    cache.set('key1', 'value1');

    expect(cache.get('key1')).toBe('value1');

    // Wait for TTL expiration
    await new Promise((resolve) => setTimeout(resolve, 35));

    expect(cache.get('key1')).toBeUndefined();
  });

  it('deletes and clears entries properly', () => {
    const cache = new LRUCache<string, number>({ maxEntries: 5 });
    cache.set('x', 100);
    cache.set('y', 200);

    expect(cache.has('x')).toBe(true);
    cache.delete('x');
    expect(cache.has('x')).toBe(false);
    expect(cache.get('x')).toBeUndefined();

    cache.clear();
    expect(cache.size).toBe(0);
  });

  it('computes deterministic SHA-256 hashes', () => {
    const hash1 = computeHash({ a: 1, b: 'test' });
    const hash2 = computeHash({ a: 1, b: 'test' });
    const hash3 = computeHash({ a: 2, b: 'test' });

    expect(hash1).toBe(hash2);
    expect(hash1).not.toBe(hash3);
    expect(hash1).toHaveLength(64); // 256 bits = 64 hex chars
  });
});
