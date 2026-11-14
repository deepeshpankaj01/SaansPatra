import { AQICategory } from './types';

export interface Breakpoint {
  low: number;
  high: number;
}

export interface BreakpointRow {
  category: AQICategory;
  aqiLow: number;
  aqiHigh: number;
  pm25: Breakpoint;
  pm10: Breakpoint;
  no2: Breakpoint;
  so2: Breakpoint;
  co: Breakpoint;
  o3: Breakpoint;
  nh3?: Breakpoint;
  pb?: Breakpoint;
}

export const BREAKPOINTS: BreakpointRow[] = [
  {
    category: 'Good',
    aqiLow: 0,
    aqiHigh: 50,
    pm25: { low: 0, high: 30 },
    pm10: { low: 0, high: 50 },
    no2: { low: 0, high: 40 },
    so2: { low: 0, high: 40 },
    co: { low: 0, high: 1.0 },
    o3: { low: 0, high: 50 },
    nh3: { low: 0, high: 200 },
    pb: { low: 0, high: 0.5 },
  },
  {
    category: 'Satisfactory',
    aqiLow: 51,
    aqiHigh: 100,
    pm25: { low: 31, high: 60 },
    pm10: { low: 51, high: 100 },
    no2: { low: 41, high: 80 },
    so2: { low: 41, high: 80 },
    co: { low: 1.1, high: 2.0 },
    o3: { low: 51, high: 100 },
    nh3: { low: 201, high: 400 },
    pb: { low: 0.6, high: 1.0 },
  },
  {
    category: 'Moderate',
    aqiLow: 101,
    aqiHigh: 200,
    pm25: { low: 61, high: 90 },
    pm10: { low: 101, high: 250 },
    no2: { low: 81, high: 180 },
    so2: { low: 81, high: 380 },
    co: { low: 2.1, high: 10.0 },
    o3: { low: 101, high: 168 },
    nh3: { low: 401, high: 800 },
    pb: { low: 1.1, high: 2.0 },
  },
  {
    category: 'Poor',
    aqiLow: 201,
    aqiHigh: 300,
    pm25: { low: 91, high: 120 },
    pm10: { low: 251, high: 350 },
    no2: { low: 181, high: 280 },
    so2: { low: 381, high: 800 },
    co: { low: 10.1, high: 17.0 },
    o3: { low: 169, high: 208 },
    nh3: { low: 801, high: 1200 },
    pb: { low: 2.1, high: 3.0 },
  },
  {
    category: 'Very Poor',
    aqiLow: 301,
    aqiHigh: 400,
    pm25: { low: 121, high: 250 },
    pm10: { low: 351, high: 430 },
    no2: { low: 281, high: 400 },
    so2: { low: 801, high: 1600 },
    co: { low: 17.1, high: 34.0 },
    o3: { low: 209, high: 748 },
    nh3: { low: 1201, high: 1800 },
    pb: { low: 3.1, high: 3.5 },
  },
  {
    category: 'Severe',
    aqiLow: 401,
    aqiHigh: 500,
    pm25: { low: 251, high: 500 },
    pm10: { low: 431, high: 600 },
    no2: { low: 401, high: 800 },
    so2: { low: 1601, high: 2400 },
    co: { low: 34.1, high: 50.0 },
    o3: { low: 749, high: 1200 },
    nh3: { low: 1801, high: 2400 },
    pb: { low: 3.6, high: 5.0 },
  },
];

export function getCategory(aqi: number): AQICategory {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Satisfactory';
  if (aqi <= 200) return 'Moderate';
  if (aqi <= 300) return 'Poor';
  if (aqi <= 400) return 'Very Poor';
  return 'Severe';
}

/**
 * Sequential haze ramp colors:
 * pale sage, sand, amber, burnt orange, brick, aubergine-black
 */
export const AQI_COLORS: Record<AQICategory, string> = {
  Good: '#10B981',
  Satisfactory: '#84CC16',
  Moderate: '#EAB308',
  Poor: '#F97316',
  'Very Poor': '#EF4444',
  Severe: '#7F1D1D',
};

export const AQI_TEXT_COLORS: Record<AQICategory, string> = {
  Good: '#14213D',
  Satisfactory: '#14213D',
  Moderate: '#14213D',
  Poor: '#FFFFFF',
  'Very Poor': '#FFFFFF',
  Severe: '#FFFFFF',
};

export const AQI_PATTERNS: Record<AQICategory, string> = {
  Good: 'aqi-pattern-good',
  Satisfactory: 'aqi-pattern-satisfactory',
  Moderate: 'aqi-pattern-moderate',
  Poor: 'aqi-pattern-poor',
  'Very Poor': 'aqi-pattern-verypoor',
  Severe: 'aqi-pattern-severe',
};
