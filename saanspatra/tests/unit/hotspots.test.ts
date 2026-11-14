import { describe, it, expect } from 'vitest';
import { rankHotspots } from '@/lib/analytics/hotspots';
import { StationStats } from '@/lib/analytics/types';

describe('Hotspot ranking', () => {
  it('ranks higher AQI and higher confidence stations above low confidence or low AQI', () => {
    const stations: StationStats[] = [
      {
        stationId: 'CleanPark',
        aqi: {
          stationId: 'CleanPark',
          overall: 65,
          category: 'Satisfactory',
          dominant: 'pm25',
          subIndices: [],
          isProvisional: false,
          pollutantCount: 3,
          hasPM: true,
        },
        pollutantStats: {},
        trend: 'stable',
        hourlyPattern: {},
        readingCount: 50,
        flaggedCount: 1,
      },
      {
        stationId: 'IndustrialArea',
        aqi: {
          stationId: 'IndustrialArea',
          overall: 380,
          category: 'Very Poor',
          dominant: 'pm25',
          subIndices: [],
          isProvisional: false,
          pollutantCount: 4,
          hasPM: true,
        },
        pollutantStats: {},
        trend: 'worsening',
        hourlyPattern: {},
        readingCount: 50,
        flaggedCount: 2,
      },
    ];

    const hotspots = rankHotspots(stations);
    expect(hotspots[0].stationId).toBe('IndustrialArea');
    expect(hotspots[0].score).toBeGreaterThan(hotspots[1].score);
  });
});
