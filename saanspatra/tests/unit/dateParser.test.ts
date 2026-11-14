import { describe, it, expect } from 'vitest';
import { tryParseDate } from '@/lib/cleaning/dateParser';

describe('Date parser', () => {
  it('parses ISO 8601 strings', () => {
    const d = tryParseDate('2025-01-15T08:30:00Z');
    expect(d).not.toBeNull();
    expect(d?.getUTCFullYear()).toBe(2025);
    expect(d?.getUTCMonth()).toBe(0); // 0-indexed January
    expect(d?.getUTCDate()).toBe(15);
  });

  it('parses Indian format DD/MM/YYYY', () => {
    const d = tryParseDate('15/01/2025');
    expect(d).not.toBeNull();
    expect(d?.getFullYear()).toBe(2025);
    expect(d?.getDate()).toBe(15);
  });

  it('disambiguates DD/MM vs MM/DD when day > 12', () => {
    const d = tryParseDate('25/04/2025');
    expect(d).not.toBeNull();
    expect(d?.getDate()).toBe(25);
    expect(d?.getMonth()).toBe(3); // April
  });

  it('parses hyphenated DD-MM-YYYY', () => {
    const d = tryParseDate('15-08-2024');
    expect(d).not.toBeNull();
    expect(d?.getDate()).toBe(15);
    expect(d?.getMonth()).toBe(7); // August
  });

  it('parses epoch milliseconds', () => {
    const epochMs = 1736928000000; // 2025-01-15 08:00:00 UTC
    const d = tryParseDate(String(epochMs));
    expect(d).not.toBeNull();
    expect(d?.getTime()).toBe(epochMs);
  });

  it('returns null for invalid garbage', () => {
    expect(tryParseDate('not-a-date')).toBeNull();
    expect(tryParseDate('')).toBeNull();
    expect(tryParseDate('99/99/9999')).toBeNull();
  });
});
