/**
 * Formatting helpers for UI presentation.
 */

export function formatAQI(value: number): string {
  if (value === null || value === undefined || isNaN(value)) return '--';
  return Math.round(value).toString();
}

export function formatDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return `${delta}`;
}

export function formatPollutant(key: string): string {
  const map: Record<string, string> = {
    pm25: 'PM2.5',
    pm10: 'PM10',
    no2: 'NO2',
    so2: 'SO2',
    co: 'CO',
    o3: 'O3',
    nh3: 'NH3',
    pb: 'Pb',
  };
  return map[key.toLowerCase()] || key.toUpperCase();
}

export function formatDate(date: Date | string | null): string {
  if (!date) return '--';
  const d = typeof date === 'string' ? new Date(date) : date;
  if (isNaN(d.getTime())) return '--';

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(d);
}
