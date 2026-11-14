import { NextRequest, NextResponse } from 'next/server';
import { translateAdvisory } from '@/lib/gemini/translation';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, translateInputSchema } from '@/lib/security/inputValidator';

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
    const result = await translateAdvisory(
      text,
      language,
      readingLevel as 'simple' | 'general' | 'technical',
      body.statsFallback,
    );

    return NextResponse.json({
      success: true,
      translation: result.translation,
      language: result.language,
      readingLevel: result.readingLevel,
    });
  } catch (error) {
    console.error('API /api/translate error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Translation failed.' },
      { status: 500 },
    );
  }
}
