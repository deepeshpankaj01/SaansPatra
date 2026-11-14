import type { RawRow } from './types';

/**
 * Count occurrences of candidate delimiters in the first 5 lines and return the
 * most common one.
 */
export function detectDelimiter(text: string): string {
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0).slice(0, 5);
  const candidates: Record<string, number> = { ',': 0, '\t': 0, ';': 0, '|': 0 };

  for (const line of lines) {
    for (const ch of Object.keys(candidates)) {
      // Count occurrences outside quoted fields
      let inQuote = false;
      for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
          inQuote = !inQuote;
        } else if (!inQuote && line[i] === ch) {
          candidates[ch]++;
        }
      }
    }
  }

  let best = ',';
  let bestCount = 0;
  for (const [ch, count] of Object.entries(candidates)) {
    if (count > bestCount) {
      bestCount = count;
      best = ch;
    }
  }
  return best;
}

/**
 * Split a single CSV/TSV line into fields, respecting double-quoted values that
 * may contain the delimiter or newlines.
 */
function splitLine(line: string, delimiter: string): string[] {
  const fields: string[] = [];
  let current = '';
  let inQuote = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuote) {
      if (ch === '"') {
        if (i + 1 < line.length && line[i + 1] === '"') {
          current += '"';
          i++; // skip escaped quote
        } else {
          inQuote = false;
        }
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuote = true;
      } else if (ch === delimiter) {
        fields.push(current);
        current = '';
      } else {
        current += ch;
      }
    }
  }
  fields.push(current);
  return fields;
}

/**
 * Parse a delimited text (CSV / TSV / etc.) into an array of RawRow objects.
 * The first non-empty line is treated as the header row.
 */
export function parseCSV(text: string, delimiter?: string): RawRow[] {
  const delim = delimiter ?? detectDelimiter(text);
  const lines = text.split(/\r?\n/);
  const nonEmpty = lines.filter((l) => l.trim().length > 0);
  if (nonEmpty.length === 0) return [];

  const headers = splitLine(nonEmpty[0], delim).map((h) => h.trim());
  const rows: RawRow[] = [];

  for (let i = 1; i < nonEmpty.length; i++) {
    const values = splitLine(nonEmpty[i], delim);
    const row: RawRow = {};
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = (values[j] ?? '').trim();
    }
    rows.push(row);
  }
  return rows;
}

/**
 * Parse a JSON string that is expected to be an array of objects. All values
 * are converted to strings so the downstream pipeline has a uniform type.
 */
export function parseJSON(text: string): RawRow[] {
  const parsed = JSON.parse(text);
  if (!Array.isArray(parsed)) {
    throw new Error('Expected a JSON array');
  }
  return parsed.map((item: Record<string, unknown>) => {
    const row: RawRow = {};
    for (const [key, val] of Object.entries(item)) {
      row[key] = val == null ? '' : String(val);
    }
    return row;
  });
}

/**
 * Auto-detect the format of the input text and parse it.
 */
export function parseInput(text: string): { rows: RawRow[]; format: 'csv' | 'tsv' | 'json'; delimiter?: string } {
  const trimmed = text.trim();

  // Try JSON first
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    try {
      const rows = parseJSON(trimmed);
      return { rows, format: 'json' };
    } catch {
      // fall through to delimiter-based parsing
    }
  }

  const delimiter = detectDelimiter(trimmed);
  const format = delimiter === '\t' ? 'tsv' : 'csv';
  const rows = parseCSV(trimmed, delimiter);
  return { rows, format, delimiter };
}
