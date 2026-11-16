import { NextRequest, NextResponse } from 'next/server';
import { computeDiff } from '@/lib/compare/diff';
import { narrateChanges } from '@/lib/gemini/comparison';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, compareInputSchema } from '@/lib/security/inputValidator';
import { BriefSnapshot } from '@/lib/compare/types';
import { LRUCache, computeHash } from '@/lib/utils/lruCache';

// In-memory O(1) LRU memoization cache for snapshot comparisons
const compareCache = new LRUCache<string, Record<string, unknown>>({
  maxEntries: 200,
  defaultTtlMs: 1000 * 60 * 30, // 30 minutes TTL
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
    const validated = validateInput(compareInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        { error: `Invalid input: ${validated.error}` },
        { status: 400 },
      );
    }

    const { currentSnapshot, previousSnapshot } = validated.data;
    const cur = currentSnapshot as BriefSnapshot;
    const prev = previousSnapshot as BriefSnapshot;

    // O(1) LRU Cache Check
    const cacheKey = computeHash({
      curHash: cur.statsHash || cur.id,
      prevHash: prev.statsHash || prev.id,
      persona: cur.persona,
    });
    const cachedResult = compareCache.get(cacheKey);
    if (cachedResult) {
      return NextResponse.json(cachedResult, {
        headers: {
          'X-Cache': 'HIT',
          'Cache-Control': 'public, max-age=1800, stale-while-revalidate=60',
        },
      });
    }

    // 1. Deterministic diff
    const diff = computeDiff(cur, prev);

    // 2. Gemini narration of changes
    const narration = await narrateChanges(diff);

    const payload = {
      success: true,
      diff,
      narration,
    };

    // Store in LRU Cache
    compareCache.set(cacheKey, payload);

    return NextResponse.json(payload, {
      headers: {
        'X-Cache': 'MISS',
        'Cache-Control': 'public, max-age=1800, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('API /api/compare error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Comparison failed.' },
      { status: 500 },
    );
  }
}
