import { describe, it, expect } from 'vitest';
import {
  normalizeHeader,
  normalizeHeaders,
  ppbToUgm3,
  normalizeUnit,
} from '@/lib/cleaning/normalizer';

describe('Header normalization', () => {
  it('maps variations of PM2.5 to canonical pm25', () => {
    expect(normalizeHeader('PM2.5')).toBe('pm25');
    expect(normalizeHeader('pm_2.5')).toBe('pm25');
    expect(normalizeHeader('PM_2.5')).toBe('pm25');
    expect(normalizeHeader('pm25')).toBe('pm25');
    expect(normalizeHeader('particulate_matter_2.5')).toBe('pm25');
  });

  it('maps variations of PM10 to pm10', () => {
    expect(normalizeHeader('PM10')).toBe('pm10');
    expect(normalizeHeader('pm_10')).toBe('pm10');
    expect(normalizeHeader('coarse_particulate')).toBe('pm10');
  });

  it('maps variations of stations and timestamps', () => {
    expect(normalizeHeader('station_name')).toBe('station');
    expect(normalizeHeader('Site')).toBe('station');
    expect(normalizeHeader('date_time')).toBe('timestamp');
    expect(normalizeHeader('sampling_date')).toBe('timestamp');
  });

  it('normalizes multiple headers and flags unmapped ones', () => {
    const raw = ['Station', 'Sampling_Date', 'PM_2.5', 'NO2', 'RandomColumn_XYZ'];
    const { mapping, unmapped } = normalizeHeaders(raw);
    expect(mapping['Station']).toBe('station');
    expect(mapping['Sampling_Date']).toBe('timestamp');
    expect(mapping['PM_2.5']).toBe('pm25');
    expect(mapping['NO2']).toBe('no2');
    expect(unmapped).toContain('RandomColumn_XYZ');
  });
});

describe('Unit normalization', () => {
  it('converts ppb to ug/m3 for NO2 (molar mass 46.01 at 25C)', () => {
    // ppbToUgm3 = ppb * 46.01 / 24.45
    // 50 ppb NO2 => 50 * 46.01 / 24.45 = 94.089...
    const converted = ppbToUgm3(50, 46.01);
    expect(Math.round(converted)).toBe(94);
  });

  it('converts mg/m3 to ug/m3 for PM2.5', () => {
    const res = normalizeUnit(0.15, 'mg/m3', 'pm25');
    expect(res.value).toBe(150);
    expect(res.unit).toBe('ug/m3');
  });

  it('keeps CO in mg/m3 as per CPCB standard', () => {
    const res = normalizeUnit(2.5, 'mg/m3', 'co');
    expect(res.value).toBe(2.5);
    expect(res.unit).toBe('mg/m3');
  });
});
