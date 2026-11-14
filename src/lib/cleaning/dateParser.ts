const MONTH_NAMES: Record<string, number> = {
  jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
  jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
};

function isValidDate(d: Date): boolean {
  return d instanceof Date && !isNaN(d.getTime());
}

function buildDate(year: number, month: number, day: number): Date | null {
  if (year < 100) {
    year += year < 50 ? 2000 : 1900;
  }
  if (month < 0 || month > 11 || day < 1 || day > 31) return null;
  const d = new Date(year, month, day);
  // Validate that the date didn't roll over (e.g. Feb 30 → Mar 2)
  if (d.getFullYear() !== year || d.getMonth() !== month || d.getDate() !== day) {
    return null;
  }
  return d;
}

/**
 * Attempt to parse a date string in many common formats.
 *
 * Supported formats:
 *  - ISO 8601  (2024-03-15, 2024-03-15T10:30:00Z, etc.)
 *  - DD/MM/YYYY or DD-MM-YYYY  (Indian convention, default)
 *  - MM/DD/YYYY – only when the day part > 12 (unambiguous)
 *  - DD-Mon-YYYY or DD-Mon-YY  (15-Jan-2024, 15-Jan-24)
 *  - YYYY/MM/DD
 *  - Epoch seconds  (10-digit number)
 *  - Epoch milliseconds  (13-digit number)
 *
 * Returns null for unparseable values.
 */
export function tryParseDate(value: string): Date | null {
  if (value == null) return null;
  const v = value.trim();
  if (v.length === 0) return null;

  // --- Epoch numbers ---
  if (/^\d{13}$/.test(v)) {
    const d = new Date(parseInt(v, 10));
    return isValidDate(d) ? d : null;
  }
  if (/^\d{10}$/.test(v)) {
    const d = new Date(parseInt(v, 10) * 1000);
    return isValidDate(d) ? d : null;
  }

  // --- ISO 8601 ---
  // Matches YYYY-MM-DD with optional time component
  if (/^\d{4}-\d{2}-\d{2}/.test(v)) {
    const d = new Date(v);
    return isValidDate(d) ? d : null;
  }

  // --- YYYY/MM/DD ---
  const ymdSlash = v.match(/^(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (ymdSlash) {
    const [, ys, ms, ds] = ymdSlash;
    const d = buildDate(parseInt(ys, 10), parseInt(ms, 10) - 1, parseInt(ds, 10));
    if (d) return d;
  }

  // --- DD-Mon-YYYY or DD-Mon-YY ---
  const dmy_mon = v.match(/^(\d{1,2})[\s/-]([A-Za-z]{3})[\s/-](\d{2,4})/);
  if (dmy_mon) {
    const [, ds, monStr, ys] = dmy_mon;
    const monthIdx = MONTH_NAMES[monStr.toLowerCase()];
    if (monthIdx !== undefined) {
      const d = buildDate(parseInt(ys, 10), monthIdx, parseInt(ds, 10));
      if (d) return d;
    }
  }

  // --- DD/MM/YYYY or DD-MM-YYYY  (with optional time) ---
  const dmySep = v.match(/^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})(?:[\sT](\d{1,2}):(\d{2})(?::(\d{2}))?)?/);
  if (dmySep) {
    const [, p1, p2, ys, hh, mm, ss] = dmySep;
    const a = parseInt(p1, 10);
    const b = parseInt(p2, 10);
    const year = parseInt(ys, 10);

    let day: number;
    let month: number;

    if (a > 12 && b <= 12) {
      // a must be day  → DD/MM/YYYY
      day = a;
      month = b - 1;
    } else if (b > 12 && a <= 12) {
      // b must be day  → MM/DD/YYYY
      day = b;
      month = a - 1;
    } else {
      // Ambiguous – default to DD/MM/YYYY (Indian convention)
      day = a;
      month = b - 1;
    }

    const d = buildDate(year, month, day);
    if (d) {
      if (hh !== undefined) {
        d.setHours(parseInt(hh, 10), parseInt(mm, 10), ss ? parseInt(ss, 10) : 0);
      }
      return d;
    }
  }

  // --- Fallback: native Date.parse ---
  const fallback = new Date(v);
  return isValidDate(fallback) ? fallback : null;
}
