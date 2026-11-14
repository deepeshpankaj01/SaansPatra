/**
 * FNV-1a 32-bit hash.
 */
function fnv1a(input: string): number {
  let hash = 0x811c9dc5; // FNV offset basis
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    // Multiply by FNV prime 0x01000193.  Use Math.imul for correct 32-bit
    // integer multiplication in JS.
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0; // ensure unsigned
}

/**
 * Generate a deterministic, stable row identifier from the station ID,
 * timestamp string, and the row's original index.
 *
 * Returns a string in the form "R" + 8-character hex hash.
 */
export function generateRowId(
  stationId: string,
  timestamp: string | null,
  rowIndex: number,
): string {
  const key = `${stationId}|${timestamp ?? ''}|${rowIndex}`;
  const hash = fnv1a(key);
  return 'R' + hash.toString(16).padStart(8, '0');
}
