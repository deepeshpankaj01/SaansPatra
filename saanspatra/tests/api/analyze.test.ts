import { describe, it, expect } from 'vitest';
import { POST } from '@/lib/../app/api/analyze/route';
import { NextRequest } from 'next/server';

describe('POST /api/analyze', () => {
  it('returns cleaned dataset and analytics for valid CSV input', async () => {
    const csv = 'station,pm25,pm10,no2\nAnand Vihar,150,280,60\nAnand Vihar,180,310,75';
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ data: csv }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.dataset.rowCount).toBe(2);
    expect(json.analytics.overallAQI.value).toBeGreaterThan(0);
    expect(json.qualityReport.totalRows).toBe(2);
  });

  it('rejects empty payload with 400 status', async () => {
    const req = new NextRequest('http://localhost:3000/api/analyze', {
      method: 'POST',
      body: JSON.stringify({ data: '' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
