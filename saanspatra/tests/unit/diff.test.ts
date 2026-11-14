import { describe, it, expect } from 'vitest';
import { computeDiff } from '@/lib/compare/diff';
import { BriefSnapshot } from '@/lib/compare/types';

describe('Deterministic Diff engine', () => {
  const prevSnapshot: BriefSnapshot = {
    id: 'snap-1',
    createdAt: '2025-01-14T08:00:00Z',
    statsHash: 'hash-1',
    persona: 'ward_officer',
    checkedActionIds: ['Deploy mechanical sweepers'],
    analytics: {
      stations: [
        {
          stationId: 'Anand Vihar',
          aqi: {
            stationId: 'Anand Vihar',
            overall: 300,
            category: 'Poor',
            dominant: 'pm25',
            subIndices: [],
            isProvisional: false,
            pollutantCount: 3,
            hasPM: true,
          },
          pollutantStats: {},
          trend: 'stable',
          hourlyPattern: {},
          readingCount: 10,
          flaggedCount: 0,
        },
      ],
      hotspots: [
        {
          stationId: 'Anand Vihar',
          score: 300,
          aqi: 300,
          category: 'Poor',
          dominant: 'pm25',
          duration: 0.2,
          dataConfidence: 1,
        },
      ],
      evidence: [],
      overallAQI: {
        value: 300,
        category: 'Poor',
        isProvisional: false,
        dominantStation: 'Anand Vihar',
        dominantPollutant: 'pm25',
      },
      summary: {
        totalStations: 1,
        totalReadings: 10,
        worstStation: 'Anand Vihar',
        bestStation: 'Anand Vihar',
        dominantPollutant: 'pm25',
      },
    },
    briefing: {
      findings: [],
      hotspots: ['Anand Vihar'],
      actions: [
        {
          priority: 'P1',
          action: 'Deploy mechanical sweepers',
          owner: 'Sanitation',
          effort: 'medium',
          timeframe: 'Immediate',
          rationale: 'Dust suppression',
          evidenceRefs: ['E1'],
        },
      ],
      dataGaps: [],
    },
  };

  const curSnapshot: BriefSnapshot = {
    ...prevSnapshot,
    id: 'snap-2',
    createdAt: '2025-01-14T12:00:00Z',
    analytics: {
      ...prevSnapshot.analytics,
      stations: [
        {
          ...prevSnapshot.analytics.stations[0],
          aqi: {
            ...prevSnapshot.analytics.stations[0].aqi,
            overall: 340,
            category: 'Very Poor',
          },
        },
      ],
      overallAQI: {
        ...prevSnapshot.analytics.overallAQI,
        value: 340,
        category: 'Very Poor',
      },
    },
  };

  it('computes AQI delta accurately', () => {
    const diff = computeDiff(curSnapshot, prevSnapshot);
    expect(diff.stationDeltas[0].delta).toBe(40);
    expect(diff.stationDeltas[0].previousAQI).toBe(300);
    expect(diff.stationDeltas[0].currentAQI).toBe(340);
    expect(diff.overallAQIDelta).toBe(40);
  });

  it('carries over action check status from previous snapshot', () => {
    const diff = computeDiff(curSnapshot, prevSnapshot);
    expect(diff.actionCarryOver[0].wasChecked).toBe(true);
    expect(diff.actionCarryOver[0].action).toBe('Deploy mechanical sweepers');
  });
});
