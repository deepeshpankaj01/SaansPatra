import { describe, it, expect } from 'vitest';
import {
  checkMissing,
  checkSentinel,
  checkNegative,
  checkOutOfRange,
  checkStuckSensor,
  checkSpike,
  checkDuplicate,
  checkBadDate,
  checkTimeGap,
  flagAllRows,
} from '@/lib/cleaning/flagger';
import { CleanedRow, FlagReason } from '@/lib/cleaning/types';

function createMockRow(overrides: Partial<CleanedRow> = {}): CleanedRow {
  return {
    id: 'R1',
    stationId: 'Anand Vihar',
    timestamp: new Date('2025-01-15T10:00:00Z'),
    pollutants: { pm25: 120, pm10: 250, no2: 50 },
    units: { pm25: 'ug/m3', pm10: 'ug/m3', no2: 'ug/m3' },
    flags: [],
    originalIndex: 0,
    ...overrides,
  };
}

describe('Flagger reason codes', () => {
  it('flags MISSING for null pollutant', () => {
    const row = createMockRow({ pollutants: { pm25: null } });
    const flags = checkMissing(row);
    expect(flags.some((f) => f.reason === FlagReason.MISSING)).toBe(true);
  });

  it('flags SENTINEL for -999 and -1 values', () => {
    const row = createMockRow({ pollutants: { pm25: -999, no2: 9999 } });
    const flags = checkSentinel(row);
    expect(flags.filter((f) => f.reason === FlagReason.SENTINEL).length).toBe(2);
  });

  it('flags NEGATIVE for negative values not recognized as sentinel', () => {
    const row = createMockRow({ pollutants: { pm25: -25 } });
    const flags = checkNegative(row);
    expect(flags.some((f) => f.reason === FlagReason.NEGATIVE)).toBe(true);
  });

  it('flags OUT_OF_RANGE for physically impossible values', () => {
    const row = createMockRow({ pollutants: { pm25: 1500, co: 250 } });
    const flags = checkOutOfRange(row);
    expect(flags.filter((f) => f.reason === FlagReason.OUT_OF_RANGE).length).toBe(2);
  });

  it('flags STUCK_SENSOR when >= 5 consecutive identical readings occur', () => {
    const rows: CleanedRow[] = [];
    for (let i = 0; i < 7; i++) {
      rows.push(
        createMockRow({
          id: `R${i}`,
          timestamp: new Date(Date.now() + i * 3600000),
          pollutants: { pm25: 85.5 },
        }),
      );
    }
    const flags = checkStuckSensor(rows, 'Anand Vihar');
    expect(flags.some((f) => f.reason === FlagReason.STUCK_SENSOR)).toBe(true);
  });

  it('flags SPIKE for sudden values > 3x median', () => {
    const rows = [
      createMockRow({ pollutants: { pm25: 50 } }),
      createMockRow({ pollutants: { pm25: 52 } }),
      createMockRow({ pollutants: { pm25: 48 } }),
      createMockRow({ pollutants: { pm25: 51 } }),
      createMockRow({ pollutants: { pm25: 400 } }), // 8x spike
    ];
    const flags = checkSpike(rows, 'Anand Vihar');
    expect(flags.some((f) => f.reason === FlagReason.SPIKE)).toBe(true);
  });

  it('flags DUPLICATE when same station and timestamp appear', () => {
    const ts = new Date('2025-01-15T12:00:00Z');
    const rows = [
      createMockRow({ id: 'R1', timestamp: ts }),
      createMockRow({ id: 'R2', timestamp: ts }),
    ];
    const flags = checkDuplicate(rows);
    expect(flags.some((f) => f.reason === FlagReason.DUPLICATE)).toBe(true);
  });

  it('flags BAD_DATE for null or future timestamps', () => {
    const row = createMockRow({ timestamp: null });
    const flags = checkBadDate(row);
    expect(flags.some((f) => f.reason === FlagReason.BAD_DATE)).toBe(true);
  });

  it('flags TIME_GAP when interval exceeds 6 hours', () => {
    const rows = [
      createMockRow({ timestamp: new Date('2025-01-15T00:00:00Z') }),
      createMockRow({ timestamp: new Date('2025-01-15T08:00:00Z') }), // 8hr gap
    ];
    const flags = checkTimeGap(rows, 'Anand Vihar');
    expect(flags.some((f) => f.reason === FlagReason.TIME_GAP)).toBe(true);
  });

  it('flagAllRows accumulates flags on rows', () => {
    const rows = [
      createMockRow({ pollutants: { pm25: -999, co: 500 } }),
    ];
    const flagged = flagAllRows(rows);
    expect(flagged[0].flags.length).toBeGreaterThanOrEqual(2);
  });
});
