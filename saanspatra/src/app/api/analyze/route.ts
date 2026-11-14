import { NextRequest, NextResponse } from 'next/server';
import { cleanDataset, generateQualityReport } from '@/lib/cleaning';
import { analyzeDataset } from '@/lib/analytics';
import { defaultRateLimiter } from '@/lib/security/rateLimiter';
import { validateInput, analyzeInputSchema } from '@/lib/security/inputValidator';

export async function POST(req: NextRequest) {
  try {
    // 1. Rate limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || '127.0.0.1';
    const rateCheck = defaultRateLimiter.check(ip);
    if (!rateCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Please try again shortly.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil(rateCheck.resetMs / 1000).toString(),
          },
        },
      );
    }

    // 2. Body parsing and validation
    const body = await req.json();
    const validated = validateInput(analyzeInputSchema, body);
    if (!validated.success) {
      return NextResponse.json(
        { error: `Invalid input: ${validated.error}` },
        { status: 400 },
      );
    }

    const { data } = validated.data;

    // 3. Clean and flag dataset
    const dataset = cleanDataset(data);
    if (dataset.rowCount === 0) {
      return NextResponse.json(
        { error: 'No valid data rows could be extracted from input.' },
        { status: 422 },
      );
    }

    // 4. Generate data quality report
    const qualityReport = generateQualityReport(dataset);

    // 5. Deterministic analytics & CPCB AQI
    const analytics = analyzeDataset(dataset, qualityReport);

    return NextResponse.json({
      success: true,
      dataset: {
        rowCount: dataset.rowCount,
        stationIds: dataset.stationIds,
        headers: dataset.headers,
        previewRows: dataset.rows.slice(0, 50),
      },
      qualityReport,
      analytics,
    });
  } catch (error) {
    console.error('API /api/analyze error:', error instanceof Error ? error.message : 'Unknown');
    return NextResponse.json(
      { error: 'Failed to process air quality data. Please check data format.' },
      { status: 500 },
    );
  }
}
