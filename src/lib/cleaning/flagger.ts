import { FlagReason, KNOWN_POLLUTANTS } from './types';
import type { DataFlag, CleanedRow } from './types';

// ── Upper bounds for out-of-range checks (µg/m³ except CO in mg/m³) ─────────
const RANGE_LIMITS: Record<string, number> = {
  pm25: 1000,
  pm10: 2000,
  no2: 2000,
  so2: 2000,
  co: 100,
  o3: 1000,
};

const SENTINEL_VALUES = new Set([-999, -1, 9999]);

// ── Per-row checks ──────────────────────────────────────────────────────────

export function checkMissing(row: CleanedRow): DataFlag[] {
  const flags: DataFlag[] = [];
  for (const pol of KNOWN_POLLUTANTS) {
    if (row.pollutants[pol] === null || row.pollutants[pol] === undefined) {
      if (pol in row.pollutants) {
        flags.push({ column: pol, reason: FlagReason.MISSING, detail: `${pol} value is missing` });
      }
    }
  }
  return flags;
}

export function checkSentinel(row: CleanedRow): DataFlag[] {
  const flags: DataFlag[] = [];
  for (const [col, val] of Object.entries(row.pollutants)) {
    if (val !== null && SENTINEL_VALUES.has(val)) {
      flags.push({ column: col, reason: FlagReason.SENTINEL, detail: `${col} has sentinel value ${val}` });
    }
  }
  return flags;
}

export function checkNegative(row: CleanedRow): DataFlag[] {
  const flags: DataFlag[] = [];
  for (const [col, val] of Object.entries(row.pollutants)) {
    if (val !== null && val < 0) {
      flags.push({ column: col, reason: FlagReason.NEGATIVE, detail: `${col} is negative (${val})` });
    }
  }
  return flags;
}

export function checkOutOfRange(row: CleanedRow): DataFlag[] {
  const flags: DataFlag[] = [];
  for (const [col, val] of Object.entries(row.pollutants)) {
    const limit = RANGE_LIMITS[col];
    if (limit !== undefined && val !== null && val > limit) {
      flags.push({
        column: col,
        reason: FlagReason.OUT_OF_RANGE,
        detail: `${col} value ${val} exceeds limit ${limit}`,
      });
    }
  }
  return flags;
}

export function checkBadDate(row: CleanedRow): DataFlag[] {
  if (row.timestamp === null) {
    return [{ column: 'timestamp', reason: FlagReason.BAD_DATE, detail: 'Timestamp could not be parsed' }];
  }
  const now = new Date();
  if (row.timestamp.getTime() > now.getTime() + 86400000) {
    return [{ column: 'timestamp', reason: FlagReason.BAD_DATE, detail: 'Timestamp is in the future' }];
  }
  if (row.timestamp.getFullYear() < 1900) {
    return [{ column: 'timestamp', reason: FlagReason.BAD_DATE, detail: 'Timestamp year is before 1900' }];
  }
  return [];
}

// ── Multi-row / station-level checks ────────────────────────────────────────

export function checkStuckSensor(rows: CleanedRow[], stationId: string): DataFlag[] {
  const flags: DataFlag[] = [];
  const stationRows = rows.filter((r) => r.stationId === stationId);
  if (stationRows.length < 6) return flags;

  for (const pol of KNOWN_POLLUTANTS) {
    let runLength = 1;
    for (let i = 1; i < stationRows.length; i++) {
      const cur = stationRows[i].pollutants[pol];
      const prev = stationRows[i - 1].pollutants[pol];
      if (cur !== null && prev !== null && cur === prev) {
        runLength++;
        if (runLength > 5) {
          flags.push({
            column: pol,
            reason: FlagReason.STUCK_SENSOR,
            detail: `${pol} stuck at ${cur} for ${runLength} consecutive readings at station ${stationId} (row index ${stationRows[i].originalIndex})`,
          });
        }
      } else {
        runLength = 1;
      }
    }
  }
  return flags;
}

function median(arr: number[]): number {
  const sorted = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}

export function checkSpike(rows: CleanedRow[], stationId: string): DataFlag[] {
  const flags: DataFlag[] = [];
  const stationRows = rows.filter((r) => r.stationId === stationId);
  if (stationRows.length < 4) return flags;

  for (const pol of KNOWN_POLLUTANTS) {
    for (let i = 3; i < stationRows.length; i++) {
      const cur = stationRows[i].pollutants[pol];
      if (cur === null || cur === 0) continue;

      const window: number[] = [];
      const windowStart = Math.max(0, i - 5);
      for (let j = windowStart; j < i; j++) {
        const v = stationRows[j].pollutants[pol];
        if (v !== null) window.push(v);
      }
      if (window.length < 3) continue;

      const med = median(window);
      if (med > 0 && cur > med * 3) {
        flags.push({
          column: pol,
          reason: FlagReason.SPIKE,
          detail: `${pol} value ${cur} is >3× the rolling median ${med.toFixed(2)} at station ${stationId} (row index ${stationRows[i].originalIndex})`,
        });
      }
    }
  }
  return flags;
}

export function checkDuplicate(rows: CleanedRow[]): DataFlag[] {
  const flags: DataFlag[] = [];
  const seen = new Set<string>();

  for (const row of rows) {
    if (row.timestamp === null) continue;
    const key = `${row.stationId}|${row.timestamp.toISOString()}`;
    if (seen.has(key)) {
      flags.push({
        column: 'timestamp',
        reason: FlagReason.DUPLICATE,
        detail: `Duplicate row for station ${row.stationId} at ${row.timestamp.toISOString()} (row index ${row.originalIndex})`,
      });
    }
    seen.add(key);
  }
  return flags;
}

export function checkTimeGap(rows: CleanedRow[], stationId: string): DataFlag[] {
  const flags: DataFlag[] = [];
  const stationRows = rows
    .filter((r) => r.stationId === stationId && r.timestamp !== null)
    .sort((a, b) => a.timestamp!.getTime() - b.timestamp!.getTime());

  const SIX_HOURS_MS = 6 * 60 * 60 * 1000;

  for (let i = 1; i < stationRows.length; i++) {
    const gap = stationRows[i].timestamp!.getTime() - stationRows[i - 1].timestamp!.getTime();
    if (gap > SIX_HOURS_MS) {
      flags.push({
        column: 'timestamp',
        reason: FlagReason.TIME_GAP,
        detail: `Time gap of ${(gap / 3600000).toFixed(1)}h between rows ${stationRows[i - 1].originalIndex} and ${stationRows[i].originalIndex} at station ${stationId}`,
      });
    }
  }
  return flags;
}

// ── Aggregate ───────────────────────────────────────────────────────────────

/**
 * Run every check on the full set of rows, mutating each row's `flags` array
 * in place. Returns the same array for convenience.
 */
export function flagAllRows(rows: CleanedRow[]): CleanedRow[] {
  // Per-row checks
  for (const row of rows) {
    row.flags.push(...checkMissing(row));
    row.flags.push(...checkSentinel(row));
    row.flags.push(...checkNegative(row));
    row.flags.push(...checkOutOfRange(row));
    row.flags.push(...checkBadDate(row));
  }

  // Station-level checks
  const stationIds = [...new Set(rows.map((r) => r.stationId))];
  for (const sid of stationIds) {
    const stuckFlags = checkStuckSensor(rows, sid);
    const spikeFlags = checkSpike(rows, sid);
    const gapFlags = checkTimeGap(rows, sid);

    // Attach station-level flags to the relevant rows by originalIndex
    const indexToRow = new Map(rows.map((r) => [r.originalIndex, r]));
    for (const f of [...stuckFlags, ...spikeFlags, ...gapFlags]) {
      // Extract row index from the detail string
      const match = f.detail.match(/row index (\d+)/);
      if (match) {
        const idx = parseInt(match[1], 10);
        const row = indexToRow.get(idx);
        if (row) row.flags.push(f);
      }
    }
  }

  // Duplicate check (cross-station)
  const dupFlags = checkDuplicate(rows);
  const indexToRow = new Map(rows.map((r) => [r.originalIndex, r]));
  for (const f of dupFlags) {
    const match = f.detail.match(/row index (\d+)/);
    if (match) {
      const idx = parseInt(match[1], 10);
      const row = indexToRow.get(idx);
      if (row) row.flags.push(f);
    }
  }

  return rows;
}
