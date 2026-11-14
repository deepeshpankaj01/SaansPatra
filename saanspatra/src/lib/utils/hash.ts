/**
 * FNV-1a fast 32-bit string hashing algorithm.
 * Used for stable IDs and caching keys without heavy crypto dependencies.
 */
export function hashString(str: string): string {
  let hash = 2166136261;
  for (let i = 0; i < str.length; i++) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16).padStart(8, '0');
}

export function hashObject(obj: unknown): string {
  return hashString(JSON.stringify(obj));
}
