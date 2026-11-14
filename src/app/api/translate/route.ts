import { NextRequest, NextResponse } from 'next/server';
import { translateAdvisory } from '@/lib/gemini/translation';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, translateInputSchema } from '@/lib/security/inputValidator';
import { LRUCache, computeHash } from '@/lib/utils/lruCache';

// In-memory O(1) LRU memoization cache for multi-lingual translations
const translateCache = new LRUCache<string, Record<string, unknown>>({
  maxEntries: 300,
  defaultTtlMs: 1000 * 60 * 60, // 1 hour TTL
});

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = defaultRateLimiter.check(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { status: 429 },
      );
    }

    const body = await req.json();
    const validated = validateInput(translateInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        { error: `Invalid input: ${validated.error}` },
        { status: 400 },
      );
    }

    const { text, language, readingLevel } = validated.data;

    // O(1) LRU Cache Check
    const cacheKey = computeHash({ text, language, readingLevel });
    const cachedResult = translateCache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=120',
        },
      });
    }

    const result = await translateAdvisory(
      text,
      language,
      readingLevel as 'simple' | 'general' | 'technical',
      body.statsFallback,
    );

    const payload = {
      success: true,
      translation: result.translation,
      language: result.language,
      readingLevel: result.readingLevel,
    };

    // Store in LRU Cache
    translateCache.set(cacheKey, payload);

    return NextResponse.json(payload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=120',
      },
    });
  } catch (error) {
    console.error('API /api/translate error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Translation failed.' },
      { status: 500 },
    );
  }
}
