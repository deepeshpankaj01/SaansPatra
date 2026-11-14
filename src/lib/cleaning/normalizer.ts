/**
 * Header synonym map — canonical name → known variations (all lowercase).
 */
export const HEADER_SYNONYMS: Record<string, string[]> = {
  pm25: ['pm2.5', 'pm_2.5', 'pm25', 'particulate_matter_2.5', 'fine_particulate', 'pm2_5'],
  pm10: ['pm10', 'pm_10', 'particulate_matter_10', 'coarse_particulate'],
  no2: ['no2', 'nitrogen_dioxide', 'no_2'],
  so2: ['so2', 'sulfur_dioxide', 'sulphur_dioxide', 'so_2'],
  co: ['co', 'carbon_monoxide'],
  o3: ['o3', 'ozone'],
  nh3: ['nh3', 'ammonia'],
  pb: ['pb', 'lead'],
  station: [
    'station', 'station_id', 'station_name', 'site', 'location',
    'monitoring_station', 'site_id',
  ],
  timestamp: [
    'date', 'time', 'datetime', 'timestamp', 'date_time',
    'sampling_date', 'recorded_at', 'observation_time',
  ],
};

// Build a reverse lookup: variation → canonical name
const _reverseLookup = new Map<string, string>();
for (const [canonical, variations] of Object.entries(HEADER_SYNONYMS)) {
  for (const v of variations) {
    _reverseLookup.set(v, canonical);
  }
}

/**
 * Normalize a single header string to its canonical name. Returns the original
 * (lowercased, trimmed) string if no synonym match is found.
 */
export function normalizeHeader(header: string): string {
  const cleaned = header.trim().toLowerCase().replace(/[\s-]+/g, '_');
  return _reverseLookup.get(cleaned) ?? cleaned;
}

/**
 * Normalize an array of raw headers. Returns a mapping from raw → canonical and
 * a list of headers that could not be mapped to any known synonym.
 */
export function normalizeHeaders(headers: string[]): { mapping: Record<string, string>; unmapped: string[] } {
  const mapping: Record<string, string> = {};
  const unmapped: string[] = [];

  for (const h of headers) {
    const canonical = normalizeHeader(h);
    mapping[h] = canonical;
    const cleaned = h.trim().toLowerCase().replace(/[\s-]+/g, '_');
    if (!_reverseLookup.has(cleaned)) {
      unmapped.push(h);
    }
  }

  return { mapping, unmapped };
}

// ---------------------------------------------------------------------------
// Unit normalisation
// ---------------------------------------------------------------------------

/** Molar masses used for ppb → µg/m³ conversion (g/mol). */
export const MOLAR_MASSES: Record<string, number> = {
  no2: 46.01,
  so2: 64.07,
  co: 28.01,
  o3: 48.00,
  nh3: 17.03,
};

/**
 * Convert a concentration from ppb to µg/m³ at 25 °C / 1 atm.
 * Formula: µg/m³ = ppb × molarMass / 24.45
 */
export function ppbToUgm3(ppb: number, molarMass: number): number {
  return (ppb * molarMass) / 24.45;
}

/**
 * Convert milligrams to micrograms.
 */
export function mgToUg(mg: number): number {
  return mg * 1000;
}

/**
 * Normalize a pollutant value to the standard unit.
 *  - Most pollutants → µg/m³
 *  - CO → mg/m³
 *
 * Supported `fromUnit` values (case-insensitive):
 *  ppb, ppm, mg/m3, mg/m³, ug/m3, ug/m³, µg/m³, µg/m3
 */
export function normalizeUnit(
  value: number,
  fromUnit: string,
  pollutant: string,
): { value: number; unit: string } {
  const unit = fromUnit.trim().toLowerCase().replace('µ', 'u').replace('³', '3');
  const pol = pollutant.trim().toLowerCase();
  const targetUnit = pol === 'co' ? 'mg/m3' : 'ug/m3';

  // Already in the target unit
  if (unit === targetUnit) {
    return { value, unit: targetUnit };
  }

  // ug/m3 → mg/m3  (for CO)
  if ((unit === 'ug/m3') && targetUnit === 'mg/m3') {
    return { value: value / 1000, unit: targetUnit };
  }

  // mg/m3 → ug/m3  (for non-CO pollutants)
  if ((unit === 'mg/m3') && targetUnit === 'ug/m3') {
    return { value: mgToUg(value), unit: targetUnit };
  }

  // ppb conversion
  if (unit === 'ppb') {
    const molarMass = MOLAR_MASSES[pol];
    if (molarMass == null) {
      // No molar mass available (pm25, pm10, pb) – assume already µg/m³
      return { value, unit: targetUnit };
    }
    let ugm3 = ppbToUgm3(value, molarMass);
    if (targetUnit === 'mg/m3') {
      ugm3 = ugm3 / 1000;
    }
    return { value: ugm3, unit: targetUnit };
  }

  // ppm conversion (1 ppm = 1000 ppb)
  if (unit === 'ppm') {
    const molarMass = MOLAR_MASSES[pol];
    if (molarMass == null) {
      return { value: value * 1000, unit: targetUnit };
    }
    let ugm3 = ppbToUgm3(value * 1000, molarMass);
    if (targetUnit === 'mg/m3') {
      ugm3 = ugm3 / 1000;
    }
    return { value: ugm3, unit: targetUnit };
  }

  // Unknown unit – return as-is with the target label
  return { value, unit: targetUnit };
}
