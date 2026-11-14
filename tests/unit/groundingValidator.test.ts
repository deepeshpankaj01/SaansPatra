import { describe, it, expect } from 'vitest';
import { validateBriefing } from '@/lib/grounding/validator';
import { BriefingResponse } from '@/lib/gemini/schemas';
import { AnalyticsResult, Evidence } from '@/lib/analytics/types';

describe('Grounding Validator', () => {
  const mockEvidence: Evidence[] = [
    {
      id: 'E1',
      type: 'stat',
      description: 'Worst station AQI is 320 at Anand Vihar',
      stationId: 'Anand Vihar',
      rowIds: ['R1'],
      value: 320,
    },
    {
      id: 'E2',
      type: 'stat',
      description: 'Station ITO AQI is 190',
      stationId: 'ITO',
      rowIds: ['R2'],
      value: 190,
    },
  ];

  const mockStats: AnalyticsResult = {
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
          pm25: { mean: 240, max: 320, min: 180, count: 10, stdDev: 40 },
        },
        trend: 'worsening',
        hourlyPattern: {},
        readingCount: 10,
        flaggedCount: 0,
      },
    ],
    hotspots: [],
    evidence: mockEvidence,
    overallAQI: {
      value: 320,
      category: 'Very Poor',
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
  };

  it('marks claim verified when evidenceRef exists and numbers match computed stats', () => {
    const briefing: BriefingResponse = {
      findings: [
        {
          id: 'F1',
          claim: 'Regional AQI reaches 320 driven by Anand Vihar.',
          evidenceRefs: ['E1'],
          severity: 'critical',
          confidence: 'high',
        },
      ],
      hotspots: ['Anand Vihar'],
      actions: [],
      dataGaps: [],
    };

    const result = validateBriefing(briefing, mockEvidence, mockStats);
    expect(result.verifiedClaims).toBe(1);
    expect(result.totalClaims).toBe(1);
    expect(result.badgeText).toBe('Verified 1 of 1 claims');
    expect(result.findingResults['F1'].isVerified).toBe(true);
  });

  it('flags unverified when evidenceRef does not exist in evidence array', () => {
    const briefing: BriefingResponse = {
      findings: [
        {
          id: 'F2',
          claim: 'Station ITO shows high values.',
          evidenceRefs: ['E99_NON_EXISTENT'],
          severity: 'moderate',
          confidence: 'high',
        },
      ],
      hotspots: [],
      actions: [],
      dataGaps: [],
    };

    const result = validateBriefing(briefing, mockEvidence, mockStats);
    expect(result.verifiedClaims).toBe(0);
    expect(result.findingResults['F2'].isVerified).toBe(false);
    expect(result.findingResults['F2'].missingRefs).toContain('E99_NON_EXISTENT');
  });

  it('flags unverified when claim contains hallucinated numbers not in stats', () => {
    const briefing: BriefingResponse = {
      findings: [
        {
          id: 'F3',
          claim: 'Station Anand Vihar spiked to 888 µg/m³ unexpectedly.',
          evidenceRefs: ['E1'],
          severity: 'high',
          confidence: 'high',
        },
      ],
      hotspots: [],
      actions: [],
      dataGaps: [],
    };

    const result = validateBriefing(briefing, mockEvidence, mockStats);
    expect(result.findingResults['F3'].isVerified).toBe(false);
    expect(result.findingResults['F3'].unmatchedNumbers).toContain(888);
  });
});
