import { describe, it, expect } from 'vitest';
import { computeStationStats } from '@/lib/analytics/stats';
import { CleanedRow } from '@/lib/cleaning/types';

describe('Station statistics', () => {
  it('computes mean, max, min, and count for pollutants', () => {
    const rows: CleanedRow[] = [
      {
        id: 'R1',
        stationId: 'StationA',
        timestamp: new Date('2025-01-15T08:00:00Z'),
        pollutants: { pm25: 100, pm10: 200, no2: 40 },
        units: { pm25: 'ug/m3', pm10: 'ug/m3', no2: 'ug/m3' },
        flags: [],
        originalIndex: 0,
      },
      {
        id: 'R2',
        stationId: 'StationA',
        timestamp: new Date('2025-01-15T09:00:00Z'),
        pollutants: { pm25: 120, pm10: 240, no2: 50 },
        units: { pm25: 'ug/m3', pm10: 'ug/m3', no2: 'ug/m3' },
        flags: [],
        originalIndex: 1,
      },
    ];

    const stats = computeStationStats(rows, 'StationA');
    expect(stats.stationId).toBe('StationA');
    expect(stats.readingCount).toBe(2);
    expect(stats.flaggedCount).toBe(0);

    const pm25Stat = stats.pollutantStats['pm25'];
    expect(pm25Stat.mean).toBe(110);
    expect(pm25Stat.max).toBe(120);
    expect(pm25Stat.min).toBe(100);
    expect(pm25Stat.count).toBe(2);
  });

  it('detects worsening trend when slope is positive and steep', () => {
    const rows: CleanedRow[] = [];
    for (let i = 0; i < 6; i++) {
      rows.push({
        id: `R${i}`,
        stationId: 'StationB',
        timestamp: new Date(1736928000000 + i * 3600000), // 1 hour steps
        pollutants: { pm25: 50 + i * 20 }, // steep increase: 50, 70, 90, 110, 130, 150
        units: { pm25: 'ug/m3' },
        flags: [],
        originalIndex: i,
      });
    }

    const stats = computeStationStats(rows, 'StationB');
    expect(stats.trend).toBe('worsening');
  });

  it('returns insufficient for fewer than 5 readings', () => {
    const rows: CleanedRow[] = [
      {
        id: 'R1',
        stationId: 'StationC',
        timestamp: new Date('2025-01-15T08:00:00Z'),
        pollutants: { pm25: 60 },
        units: { pm25: 'ug/m3' },
        flags: [],
        originalIndex: 0,
      },
    ];
    const stats = computeStationStats(rows, 'StationC');
    expect(stats.trend).toBe('insufficient');
  });
});
