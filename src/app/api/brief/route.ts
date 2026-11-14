import { NextRequest, NextResponse } from 'next/server';
import { generateBriefing } from '@/lib/gemini/briefing';
import { validateBriefing } from '@/lib/grounding/validator';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, briefInputSchema } from '@/lib/security/inputValidator';
import { AnalyticsResult } from '@/lib/analytics/types';
import { LRUCache, computeHash } from '@/lib/utils/lruCache';

// In-memory O(1) LRU memoization cache for Gemini & fallback briefings
const briefCache = new LRUCache<string, Record<string, unknown>>({
  maxEntries: 200,
  defaultTtlMs: 1000 * 60 * 30, // 30 minutes TTL
});

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = defaultRateLimiter.check(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        { status: 429 },
      );
    }

    // 2. Input validation
    const body = await req.json();
    const validated = validateInput(briefInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        { error: `Invalid input: ${validated.error}` },
        { status: 400 },
      );
    }

    const { stats, persona } = validated.data;
    const analyticsStats = stats as AnalyticsResult;

    // 3. O(1) LRU Cache Check (keyed by SHA-256 of payload)
    const cacheKey = computeHash({ stats, persona });
    const cachedResult = briefCache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=60',
        },
      });
    }

    // 4. Generate briefing via Gemini or fallback
    const { brief, isFallback } = await generateBriefing(analyticsStats, persona);

    // 5. Grounding validation: verify evidence references and extracted numbers
    const validation = validateBriefing(brief, analyticsStats.evidence, analyticsStats);

    const payload = {
      success: true,
      brief,
      validation,
      isFallback,
    };

    // Store in LRU Cache
    briefCache.set(cacheKey, payload);

    return NextResponse.json(payload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('API /api/brief error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Failed to generate briefing note.' },
      { status: 500 },
    );
  }
}
