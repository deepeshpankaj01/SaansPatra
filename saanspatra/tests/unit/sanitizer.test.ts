import { describe, it, expect } from 'vitest';
import {
  stripControlChars,
  sanitizeForCSVExport,
  sanitizeInput,
} from '@/lib/cleaning/sanitizer';

describe('Sanitizer', () => {
  it('strips non-printable ASCII control characters but keeps newlines and tabs', () => {
    const dirty = 'Hello\x00\x07World\tNew\nLine\x1F';
    const clean = stripControlChars(dirty);
    expect(clean).toBe('HelloWorld\tNew\nLine');
  });

  it('neutralizes CSV formula injection characters with single quote prefix', () => {
    expect(sanitizeForCSVExport('=cmd|')).toBe("'=cmd|");
    expect(sanitizeForCSVExport('+SUM(A1:A10)')).toBe("'+SUM(A1:A10)");
    expect(sanitizeForCSVExport('-123')).toBe("'-123");
    expect(sanitizeForCSVExport('@import')).toBe("'@import");
    expect(sanitizeForCSVExport('Normal text')).toBe('Normal text');
  });

  it('limits input to 1 MB and trims', () => {
    const huge = 'A'.repeat(2 * 1024 * 1024);
    const sanitized = sanitizeInput(huge);
    expect(sanitized.length).toBeLessThanOrEqual(1024 * 1024);
  });
});
