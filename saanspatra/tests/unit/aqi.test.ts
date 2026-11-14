import { describe, it, expect } from 'vitest';
import { calculateSubIndex, calculateStationAQI } from '@/lib/analytics/aqi';
import { getCategory } from '@/lib/analytics/breakpoints';

describe('CPCB AQI Sub-index calculation', () => {
  it('calculates PM2.5 = 45 µg/m³ correctly as 75 (Satisfactory)', () => {
    // Formula: ((100 - 50) / (60 - 30)) * (45 - 30) + 50 = (50/30) * 15 + 50 = 25 + 50 = 75
    const res = calculateSubIndex(45, 'pm25');
    expect(res).not.toBeNull();
    expect(res?.value).toBe(75);
    expect(res?.category).toBe('Satisfactory');
  });

  it('calculates PM2.5 = 15 µg/m³ correctly as 25 (Good)', () => {
    // Range 0-30 => AQI 0-50: (50/30) * 15 = 25
    const res = calculateSubIndex(15, 'pm25');
    expect(res).not.toBeNull();
    expect(res?.value).toBe(25);
    expect(res?.category).toBe('Good');
  });

  it('calculates PM10 = 175 µg/m³ correctly (Moderate)', () => {
    // Range 101-250 => AQI 101-200
    // ((200 - 101) / (250 - 101)) * (175 - 101) + 101 = (99 / 149) * 74 + 101 = 49.16 + 101 = 150
    const res = calculateSubIndex(175, 'pm10');
    expect(res).not.toBeNull();
    expect(res?.category).toBe('Moderate');
    expect(res?.value).toBeGreaterThanOrEqual(149);
    expect(res?.value).toBeLessThanOrEqual(151);
  });

  it('calculates Severe category for PM2.5 > 250 µg/m³', () => {
    const res = calculateSubIndex(320, 'pm25');
    expect(res).not.toBeNull();
    expect(res?.category).toBe('Severe');
    expect(res?.value).toBeGreaterThan(400);
  });

  it('returns null for negative or NaN concentrations', () => {
    expect(calculateSubIndex(-10, 'pm25')).toBeNull();
    expect(calculateSubIndex(NaN, 'pm25')).toBeNull();
  });
});

describe('calculateStationAQI', () => {
  it('selects worst pollutant sub-index as overall AQI', () => {
    const averages = {
      pm25: 45, // sub-index 75
      pm10: 280, // sub-index 230 (Poor)
      no2: 30, // sub-index ~38 (Good)
    };
    const res = calculateStationAQI(averages, 'Anand Vihar');
    expect(res.overall).toBe(230);
    expect(res.category).toBe('Poor');
    expect(res.dominant).toBe('pm10');
    expect(res.isProvisional).toBe(false);
  });

  it('marks AQI as provisional when fewer than 3 pollutants are present', () => {
    const averages = {
      pm25: 80,
      pm10: 150,
    };
    const res = calculateStationAQI(averages, 'ITO');
    expect(res.isProvisional).toBe(true);
  });

  it('marks AQI as provisional when no particulate matter (PM2.5 or PM10) is present', () => {
    const averages = {
      no2: 60,
      so2: 40,
      co: 1.5,
    };
    const res = calculateStationAQI(averages, 'Connaught Place');
    expect(res.hasPM).toBe(false);
    expect(res.isProvisional).toBe(true);
  });
});

describe('getCategory', () => {
  it('maps numbers to official CPCB categories', () => {
    expect(getCategory(40)).toBe('Good');
    expect(getCategory(80)).toBe('Satisfactory');
    expect(getCategory(150)).toBe('Moderate');
    expect(getCategory(250)).toBe('Poor');
    expect(getCategory(350)).toBe('Very Poor');
    expect(getCategory(450)).toBe('Severe');
  });
});
