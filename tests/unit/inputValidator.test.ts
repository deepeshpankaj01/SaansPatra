import { describe, it, expect } from 'vitest';
import {
  validateInput,
  analyzeInputSchema,
  translateInputSchema,
} from '@/lib/security/inputValidator';

describe('Zod Input Validator', () => {
  it('validates analyze input successfully', () => {
    const valid = { data: 'station,pm25\nA,50', format: 'csv' };
    const res = validateInput(analyzeInputSchema, valid);
    expect(res.success).toBe(true);
  });

  it('rejects empty analyze input', () => {
    const invalid = { data: '' };
    const res = validateInput(analyzeInputSchema, invalid);
    expect(res.success).toBe(false);
  });

  it('rejects input exceeding 1 MB', () => {
    const oversized = { data: 'A'.repeat(1_048_577) };
    const res = validateInput(analyzeInputSchema, oversized);
    expect(res.success).toBe(false);
  });

  it('validates translation language codes strictly', () => {
    const valid = { text: 'Hello', language: 'hi', readingLevel: 'simple' };
    expect(validateInput(translateInputSchema, valid).success).toBe(true);

    const invalidLang = { text: 'Hello', language: 'fr', readingLevel: 'simple' };
    expect(validateInput(translateInputSchema, invalidLang).success).toBe(false);
  });
});
