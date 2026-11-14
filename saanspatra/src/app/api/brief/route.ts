import { NextRequest, NextResponse } from 'next/server';
import { generateBriefing } from '@/lib/gemini/briefing';
import { validateBriefing } from '@/lib/grounding/validator';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, briefInputSchema } from '@/lib/security/inputValidator';
import { AnalyticsResult } from '@/lib/analytics/types';

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

    // 3. Generate briefing via Gemini or fallback
    const { brief, isFallback } = await generateBriefing(analyticsStats, persona);

    // 4. Grounding validation: verify evidence references and extracted numbers
    const validation = validateBriefing(brief, analyticsStats.evidence, analyticsStats);

    return NextResponse.json({
      success: true,
      brief,
      validation,
      isFallback,
    });
  } catch (error) {
    console.error('API /api/brief error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Failed to generate briefing note.' },
      { status: 500 },
    );
  }
}
