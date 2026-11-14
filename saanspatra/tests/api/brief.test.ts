import { describe, it, expect, vi } from 'vitest';
import { POST } from '@/lib/../app/api/brief/route';
import { NextRequest } from 'next/server';

describe('POST /api/brief', () => {
  it('generates fallback brief when Gemini is not configured', async () => {
    const stats = {
      stations: [
        {
          stationId: 'Anand Vihar',
          aqi: {
            stationId: 'Anand Vihar',
            overall: 320,
            category: 'Very Poor',
            dominant: 'pm25',
            subIndices: [],
            isProvisional: false,
            pollutantCount: 3,
            hasPM: true,
          },
          pollutantStats: {
            pm25: { mean: 210, max: 280, min: 140, count: 5, stdDev: 30 },
          },
          trend: 'worsening',
          hourlyPattern: {},
          readingCount: 5,
          flaggedCount: 0,
        },
      ],
      hotspots: [
        {
          stationId: 'Anand Vihar',
          score: 450,
          aqi: 320,
          category: 'Very Poor',
          dominant: 'pm25',
          duration: 0.4,
          dataConfidence: 1,
        },
      ],
      evidence: [
        {
          id: 'E1',
          type: 'stat',
          description: 'Worst station AQI is 320 at Anand Vihar',
          stationId: 'Anand Vihar',
          rowIds: ['R1'],
          value: 320,
        },
      ],
      overallAQI: {
        value: 320,
        category: 'Very Poor',
        isProvisional: false,
        dominantStation: 'Anand Vihar',
        dominantPollutant: 'pm25',
      },
      summary: {
        totalStations: 1,
        totalReadings: 5,
        worstStation: 'Anand Vihar',
        bestStation: 'Anand Vihar',
        dominantPollutant: 'pm25',
      },
    };

    const req = new NextRequest('http://localhost:3000/api/brief', {
      method: 'POST',
      body: JSON.stringify({ stats, persona: 'ward_officer' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.brief.findings.length).toBeGreaterThan(0);
    expect(json.brief.actions.length).toBeGreaterThan(0);
    expect(json.validation).toBeDefined();
    expect(json.isFallback).toBe(true); // Since no real API key in test env
  });
});
