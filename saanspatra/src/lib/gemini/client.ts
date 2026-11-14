import { GoogleGenAI } from '@google/genai';

/**
 * Cleanly reads the Gemini API key from server-side environment variables.
 * Trims leading/trailing whitespace and removes accidental wrapping quotes.
 */
export function getGeminiApiKey(): string | null {
  const raw = process.env.GEMINI_API_KEY;
  if (!raw) return null;
  const clean = raw.trim().replace(/^["']|["']$/g, '').trim();
  return clean.length > 0 ? clean : null;
}

/**
 * Returns a configured GoogleGenAI instance using server-side environment variables.
 * Returns null if the key is missing or blank, triggering deterministic fallback.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Resolves the configured Gemini model name.
 * Uses GEMINI_MODEL env var or falls back to 'gemini-2.5-flash'.
 */
export function getModelName(): string {
  const custom = process.env.GEMINI_MODEL?.trim().replace(/^["']|["']$/g, '');
  return custom && custom.length > 0 ? custom : 'gemini-2.5-flash';
}

/**
 * Helper to check whether Gemini API is configured and available.
 */
export function isGeminiAvailable(): boolean {
  return Boolean(getGeminiApiKey());
}
