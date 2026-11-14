import { CleanedRow } from '../cleaning/types';
import { StationStats, PollutantStat, TrendDirection } from './types';
import { calculateStationAQI } from './aqi';
import { computeHourlyPattern } from './patterns';

interface PollutantAccumulator {
  count: number;
  sum: number;
  min: number;
  max: number;
  values: number[];
}

/**
 * Single-pass statistical aggregation for CAAQMS monitoring stations.
 * Computes mean, min, max, standard deviation, AQI, and linear trend in O(N) time.
 */
export function computeStationStats(
  rows: CleanedRow[],
  stationId: string,
): StationStats {
  const stationRows: CleanedRow[] = [];
  let flaggedCount = 0;
  const accumulators: Record<string, PollutantAccumulator> = {};

  // Single-pass filter, flagged row tally, and pollutant metric accumulation
  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.stationId !== stationId) continue;

    stationRows.push(r);
    if (r.flags.length > 0) {
      flaggedCount++;
    }

    const pollutants = r.pollutants;
    for (const pol in pollutants) {
      const val = pollutants[pol];
      if (val !== null && val !== undefined && !isNaN(val)) {
        let acc = accumulators[pol];
        if (!acc) {
          acc = {
            count: 1,
            sum: val,
            min: val,
            max: val,
            values: [val],
          };
          accumulators[pol] = acc;
        } else {
          acc.count++;
          acc.sum += val;
          if (val < acc.min) acc.min = val;
          if (val > acc.max) acc.max = val;
          acc.values.push(val);
        }
      }
    }
  }

  const readingCount = stationRows.length;
  const pollutantStats: Record<string, PollutantStat> = {};
  const pollutantMeans: Record<string, number> = {};

  for (const pol in accumulators) {
    const acc = accumulators[pol];
    if (acc.count === 0) continue;

    const mean = acc.sum / acc.count;

    // Fast single-pass standard deviation
    let varianceSum = 0;
    const vals = acc.values;
    for (let j = 0; j < vals.length; j++) {
      const diff = vals[j] - mean;
      varianceSum += diff * diff;
    }
    const stdDev = Math.sqrt(varianceSum / acc.count);

    pollutantStats[pol] = {
      mean: Math.round(mean * 10) / 10,
      max: Math.round(acc.max * 10) / 10,
      min: Math.round(acc.min * 10) / 10,
      count: acc.count,
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
 * Detect trend using linear regression on chronological pollutant values.
 * Employs monotonic timestamp verification to skip redundant sorting in O(N).
 */
function detectTrend(rows: CleanedRow[]): TrendDirection {
  if (rows.length < 5) {
    return 'insufficient';
  }

  // Extract dated rows and verify timestamp order in single pass
  const validRows: CleanedRow[] = [];
  let isMonotonic = true;
  let lastTime = -Infinity;

  for (let i = 0; i < rows.length; i++) {
    const r = rows[i];
    if (r.timestamp !== null) {
      const t = r.timestamp.getTime();
      if (t < lastTime) {
        isMonotonic = false;
      }
      lastTime = t;
      validRows.push(r);
    }
  }

  if (validRows.length < 5) {
    return 'insufficient';
  }

  // Sort only if timestamps arrived out of chronological order
  if (!isMonotonic) {
    validRows.sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());
  }

  const startTime = validRows[0].timestamp!.getTime();
  let n = 0;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumX2 = 0;

  // Single-pass accumulation for linear regression slope without point allocations
  for (let i = 0; i < validRows.length; i++) {
    const row = validRows[i];
    const val = row.pollutants['pm25'] ?? row.pollutants['pm10'] ?? Object.values(row.pollutants)[0];
    if (val !== null && val !== undefined && !isNaN(val)) {
      const x = (row.timestamp!.getTime() - startTime) / (1000 * 60 * 60);
      n++;
      sumX += x;
      sumY += val;
      sumXY += x * val;
      sumX2 += x * x;
    }
  }

  if (n < 5) return 'insufficient';

  const denominator = n * sumX2 - sumX * sumX;
  if (Math.abs(denominator) < 1e-9) return 'stable';

  const slope = (n * sumXY - sumX * sumY) / denominator;

  // Slope threshold: > 0.5 ug/m3 per hour is worsening, < -0.5 is improving
  if (slope > 0.5) return 'worsening';
  if (slope < -0.5) return 'improving';
  return 'stable';
}
