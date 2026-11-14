import { CleanedRow } from '../cleaning/types';

/**
 * Computes average hourly concentration for a given pollutant at a station.
 * Returns record of hour (0-23) -> average value.
 */
export function computeHourlyPattern(
  rows: CleanedRow[],
  stationId: string,
  pollutant: string,
): Record<number, number> {
  const hourlyValues: Record<number, number[]> = {};

  for (let h = 0; h < 24; h++) {
    hourlyValues[h] = [];
  }

  const polKey = pollutant.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const row of rows) {
    if (row.stationId !== stationId || !row.timestamp) continue;

    const hour = row.timestamp.getHours();
    const val = row.pollutants[polKey];

    if (val !== null && val !== undefined && !isNaN(val)) {
      hourlyValues[hour].push(val);
    }
  }

  const result: Record<number, number> = {};
  for (let h = 0; h < 24; h++) {
    const vals = hourlyValues[h];
    if (vals.length > 0) {
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      result[h] = Math.round(avg * 10) / 10;
    }
  }

  return result;
}
