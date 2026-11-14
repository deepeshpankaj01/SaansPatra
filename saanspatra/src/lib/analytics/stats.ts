import { CleanedRow } from '../cleaning/types';
import { StationStats, PollutantStat, TrendDirection } from './types';
import { calculateStationAQI } from './aqi';
import { computeHourlyPattern } from './patterns';

export function computeStationStats(
  rows: CleanedRow[],
  stationId: string,
): StationStats {
  const stationRows = rows.filter((r) => r.stationId === stationId);
  const readingCount = stationRows.length;
  const flaggedCount = stationRows.filter((r) => r.flags.length > 0).length;

  // Aggregate concentrations per pollutant
  const pollutantValues: Record<string, number[]> = {};

  for (const row of stationRows) {
    for (const [pol, val] of Object.entries(row.pollutants)) {
      if (val !== null && val !== undefined && !isNaN(val)) {
        if (!pollutantValues[pol]) pollutantValues[pol] = [];
        pollutantValues[pol].push(val);
      }
    }
  }

  const pollutantStats: Record<string, PollutantStat> = {};
  const pollutantMeans: Record<string, number> = {};

  for (const [pol, vals] of Object.entries(pollutantValues)) {
    if (vals.length === 0) continue;

    const count = vals.length;
    const sum = vals.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    const max = Math.max(...vals);
    const min = Math.min(...vals);

    // Standard deviation
    const variance =
      vals.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);

    pollutantStats[pol] = {
      mean: Math.round(mean * 10) / 10,
      max: Math.round(max * 10) / 10,
      min: Math.round(min * 10) / 10,
      count,
      stdDev: Math.round(stdDev * 10) / 10,
    };

    pollutantMeans[pol] = mean;
  }

  // Calculate AQI from averages
  const aqi = calculateStationAQI(pollutantMeans, stationId);

  // Compute trend using linear regression over chronological readings
  const trend = detectTrend(stationRows);

  // Compute hourly pattern for dominant pollutant or PM2.5
  const dominantOrPM = aqi.dominant !== 'none' ? aqi.dominant : 'pm25';
  const hourlyPattern = computeHourlyPattern(stationRows, stationId, dominantOrPM);

  return {
    stationId,
    aqi,
    pollutantStats,
    trend,
    hourlyPattern,
    readingCount,
    flaggedCount,
  };
}

/**
 * Detect trend using linear regression on time-ordered pollutant values
 */
function detectTrend(rows: CleanedRow[]): TrendDirection {
  // Sort rows chronologically if timestamp exists
  const validRows = rows
    .filter((r) => r.timestamp !== null)
    .sort((a, b) => (a.timestamp!.getTime() - b.timestamp!.getTime()));

  if (validRows.length < 5) {
    return 'insufficient';
  }

  // Extract PM2.5 or PM10 or any primary pollutant values over time
  const points: { x: number; y: number }[] = [];
  const startTime = validRows[0].timestamp!.getTime();

  for (const row of validRows) {
    const val = row.pollutants['pm25'] ?? row.pollutants['pm10'] ?? Object.values(row.pollutants)[0];
    if (val !== null && val !== undefined && !isNaN(val)) {
      // x in hours from start
      const x = (row.timestamp!.getTime() - startTime) / (1000 * 60 * 60);
      points.push({ x, y: val });
    }
  }

  if (points.length < 5) return 'insufficient';

  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
  }

  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-9) return 'stable';

  const slope = (n * sumXY - sumX * sumY) / denominator;

  // Slope threshold: > 0.5 ug/m3 per hour is worsening, < -0.5 is improving
  if (slope > 0.5) return 'worsening';
  if (slope < -0.5) return 'improving';
  return 'stable';
}
