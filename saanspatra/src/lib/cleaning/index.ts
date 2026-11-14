import { sanitizeInput } from './sanitizer';
import { parseInput } from './parser';
import { normalizeHeaders, normalizeUnit } from './normalizer';
import { tryParseDate } from './dateParser';
import { generateRowId } from './stableId';
import { flagAllRows } from './flagger';
import { KNOWN_POLLUTANTS } from './types';
import type { CleanedRow, ParsedDataset, QualityReport } from './types';

/**
 * Full cleaning pipeline: sanitize → parse → normalize → flag.
 */
export function cleanDataset(rawText: string): ParsedDataset {
  // 1. Sanitize input
  const sanitized = sanitizeInput(rawText);

  // 2. Parse input
  const { rows: rawRows, format } = parseInput(sanitized);
  if (rawRows.length === 0) {
    return {
      rows: [],
      headers: [],
      rawHeaders: [],
      format,
      rowCount: 0,
      stationIds: [],
    };
  }

  // 3. Normalize headers
  const rawHeaders = Object.keys(rawRows[0]);
  const { mapping } = normalizeHeaders(rawHeaders);

  // Invert the mapping so we can look up canonical → raw
  const canonicalToRaw: Record<string, string> = {};
  for (const [raw, canonical] of Object.entries(mapping)) {
    canonicalToRaw[canonical] = raw;
  }

  // Detect if any column has a unit suffix like "(ppb)" or "(mg/m3)"
  const unitHints: Record<string, string> = {};
  for (const rawH of rawHeaders) {
    const unitMatch = rawH.match(/\(([^)]+)\)\s*$/);
    if (unitMatch) {
      const canonical = mapping[rawH];
      unitHints[canonical] = unitMatch[1].trim();
    }
  }

  // 4. Build CleanedRow objects
  const cleanedRows: CleanedRow[] = rawRows.map((raw, index) => {
    // Station ID
    const stationRaw = canonicalToRaw['station'];
    const stationId = stationRaw ? (raw[stationRaw] ?? 'unknown').trim() : 'unknown';

    // Timestamp
    const tsRaw = canonicalToRaw['timestamp'];
    const tsString = tsRaw ? (raw[tsRaw] ?? '').trim() : '';
    const timestamp = tsString ? tryParseDate(tsString) : null;

    // Pollutants
    const pollutants: Record<string, number | null> = {};
    const units: Record<string, string> = {};

    for (const pol of KNOWN_POLLUTANTS) {
      const rawHeader = canonicalToRaw[pol];
      if (rawHeader === undefined) continue;

      const rawVal = (raw[rawHeader] ?? '').trim();
      if (rawVal === '' || rawVal.toLowerCase() === 'na' || rawVal.toLowerCase() === 'n/a' || rawVal === '-' || rawVal === '--') {
        pollutants[pol] = null;
        units[pol] = pol === 'co' ? 'mg/m3' : 'ug/m3';
        continue;
      }

      const parsed = parseFloat(rawVal);
      if (isNaN(parsed)) {
        pollutants[pol] = null;
        units[pol] = pol === 'co' ? 'mg/m3' : 'ug/m3';
        continue;
      }

      // Normalize units if a hint is available
      const hint = unitHints[pol];
      if (hint) {
        const normalized = normalizeUnit(parsed, hint, pol);
        pollutants[pol] = normalized.value;
        units[pol] = normalized.unit;
      } else {
        pollutants[pol] = parsed;
        units[pol] = pol === 'co' ? 'mg/m3' : 'ug/m3';
      }
    }

    // Stable ID
    const id = generateRowId(stationId, tsString || null, index);

    return {
      id,
      stationId,
      timestamp,
      pollutants,
      units,
      flags: [],
      originalIndex: index,
    } satisfies CleanedRow;
  });

  // 5. Flag all rows
  flagAllRows(cleanedRows);

  // 6. Build result
  const stationIds = [...new Set(cleanedRows.map((r) => r.stationId))];
  const headers = Object.values(mapping);

  return {
    rows: cleanedRows,
    headers,
    rawHeaders,
    format,
    rowCount: cleanedRows.length,
    stationIds,
  };
}

/**
 * Produce a quality summary for an already-cleaned dataset.
 */
export function generateQualityReport(dataset: ParsedDataset): QualityReport {
  const totalRows = dataset.rows.length;
  let flaggedRows = 0;
  const flagCounts: Record<string, number> = {};

  // Per-station flag tracking
  const stationTotal: Record<string, number> = {};
  const stationFlagged: Record<string, number> = {};

  for (const row of dataset.rows) {
    stationTotal[row.stationId] = (stationTotal[row.stationId] ?? 0) + 1;

    if (row.flags.length > 0) {
      flaggedRows++;
      stationFlagged[row.stationId] = (stationFlagged[row.stationId] ?? 0) + 1;

      for (const flag of row.flags) {
        flagCounts[flag.reason] = (flagCounts[flag.reason] ?? 0) + 1;
      }
    }
  }

  // Station reliability: fraction of rows without flags
  const stationReliability: Record<string, number> = {};
  for (const sid of dataset.stationIds) {
    const total = stationTotal[sid] ?? 0;
    const flagged = stationFlagged[sid] ?? 0;
    stationReliability[sid] = total > 0 ? (total - flagged) / total : 1;
  }

  const overallReliability = totalRows > 0 ? (totalRows - flaggedRows) / totalRows : 1;

  return {
    totalRows,
    flaggedRows,
    flagCounts,
    stationReliability,
    overallReliability,
  };
}
