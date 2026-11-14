import { GoogleGenAI } from '@google/genai';

/**
 * Returns a configured GoogleGenAI instance using server-side environment variables.
 */
export function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }

  return new GoogleGenAI({ apiKey });
}

/**
 * Resolves the configured Gemini model name.
 * Uses GEMINI_MODEL env var or falls back to 'gemini-2.5-flash'.
 */
export function getModelName(): string {
  return process.env.GEMINI_MODEL || 'gemini-2.5-flash';
}

/**
 * Helper to check whether Gemini API is configured and available.
 */
export function isGeminiAvailable(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey.trim().length > 0);
}
