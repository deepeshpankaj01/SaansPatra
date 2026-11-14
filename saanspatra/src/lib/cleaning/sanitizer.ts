/**
 * Remove control characters 0x00–0x08, 0x0B, 0x0C, 0x0E–0x1F while preserving
 * \n (0x0A), \r (0x0D), and \t (0x09).
 */
export function stripControlChars(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, '');
}

/**
 * Prevent CSV injection by prefixing dangerous leading characters with a
 * single-quote.  Dangerous characters: = + - @ \t \r
 */
export function sanitizeForCSVExport(value: string): string {
  if (/^[=+\-@\t\r]/.test(value)) {
    return "'" + value;
  }
  return value;
}

const ONE_MB = 1_048_576; // 1 MB in bytes

/**
 * Sanitize raw input text:
 *  1. Strip control characters.
 *  2. Truncate to 1 MB.
 */
export function sanitizeInput(text: string): string {
  let cleaned = stripControlChars(text);
  if (cleaned.length > ONE_MB) {
    cleaned = cleaned.slice(0, ONE_MB);
  }
  return cleaned;
}
