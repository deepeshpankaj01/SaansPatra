import { describe, it, expect } from 'vitest';
import {
  formatAQI,
  formatDelta,
  formatPollutant,
  formatDate,
} from '@/lib/utils/formatting';

describe('Formatting Utils', () => {
  it('formats AQI numbers', () => {
    expect(formatAQI(152.4)).toBe('152');
    expect(formatAQI(NaN)).toBe('--');
  });

  it('formats delta numbers with explicit sign', () => {
    expect(formatDelta(15)).toBe('+15');
    expect(formatDelta(-8)).toBe('-8');
    expect(formatDelta(0)).toBe('0');
  });

  it('formats pollutant names with standard subscripts/capitalization', () => {
    expect(formatPollutant('pm25')).toBe('PM2.5');
    expect(formatPollutant('pm10')).toBe('PM10');
    expect(formatPollutant('no2')).toBe('NO2');
    expect(formatPollutant('co')).toBe('CO');
  });

  it('formats dates consistently', () => {
    const d = new Date('2025-01-15T08:30:00Z');
    const formatted = formatDate(d);
    expect(formatted).toContain('2025');
    expect(formatted).toContain('Jan');
    expect(formatDate(null)).toBe('--');
  });
});
