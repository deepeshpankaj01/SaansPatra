import { describe, it, expect } from 'vitest';
import { generateEvidence } from '@/lib/analytics/evidence';
import { StationStats, HotspotEntry } from '@/lib/analytics/types';
import { CleanedRow } from '@/lib/cleaning/types';

describe('Evidence generation', () => {
  it('generates sequential evidence IDs starting with E1', () => {
    const stations: StationStats[] = [
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
          pm25: { mean: 180, max: 240, min: 120, count: 10, stdDev: 30 },
        },
        trend: 'worsening',
        hourlyPattern: {},
        readingCount: 10,
        flaggedCount: 0,
      },
    ];

    const hotspots: HotspotEntry[] = [
      {
        stationId: 'Anand Vihar',
        score: 450,
        aqi: 320,
        category: 'Very Poor',
        dominant: 'pm25',
        duration: 0.5,
        dataConfidence: 0.95,
      },
    ];

    const rows: CleanedRow[] = [
      {
        id: 'R100',
        stationId: 'Anand Vihar',
        timestamp: new Date(),
        pollutants: { pm25: 180 },
        units: { pm25: 'ug/m3' },
        flags: [],
        originalIndex: 0,
      },
    ];

    const evidence = generateEvidence(stations, hotspots, rows);
    expect(evidence.length).toBeGreaterThanOrEqual(4);
    expect(evidence[0].id).toBe('E1');
    expect(evidence[1].id).toBe('E2');
    expect(evidence[2].id).toBe('E3');
    expect(evidence[0].rowIds).toContain('R100');
  });
});
