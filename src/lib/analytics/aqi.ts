import { SubIndex, StationAQI } from './types';
import { BREAKPOINTS, getCategory, Breakpoint } from './breakpoints';

/**
 * Calculate CPCB sub-index for a single pollutant concentration.
 * Uses linear interpolation:
 * Ip = ((Ihi - Ilo) / (Bhi - Blo)) * (Cp - Blo) + Ilo
 */
export function calculateSubIndex(
  concentration: number,
  pollutant: string,
): SubIndex | null {
  if (concentration < 0 || isNaN(concentration)) return null;

  const key = pollutant.toLowerCase().replace(/[^a-z0-9]/g, '');

  for (const row of BREAKPOINTS) {
    let bp: Breakpoint | undefined;

    switch (key) {
      case 'pm25':
      case 'pm2_5':
      case 'pm2.5':
        bp = row.pm25;
        break;
      case 'pm10':
        bp = row.pm10;
        break;
      case 'no2':
        bp = row.no2;
        break;
      case 'so2':
        bp = row.so2;
        break;
      case 'co':
        bp = row.co;
        break;
      case 'o3':
        bp = row.o3;
        break;
      case 'nh3':
        bp = row.nh3;
        break;
      case 'pb':
        bp = row.pb;
        break;
      default:
        return null;
    }

    if (!bp) continue;

    // Check if concentration falls within this breakpoint bracket
    // Or if it's the last bracket (Severe) and concentration exceeds the high
    const isLastRow = row === BREAKPOINTS[BREAKPOINTS.length - 1];
    if (
      (concentration >= bp.low && concentration <= bp.high) ||
      (isLastRow && concentration > bp.high)
    ) {
      const clampedConc = isLastRow ? Math.min(concentration, bp.high * 1.5) : concentration;
      const subIndexValue =
        ((row.aqiHigh - row.aqiLow) / (bp.high - bp.low)) *
          (clampedConc - bp.low) +
        row.aqiLow;

      const rounded = Math.round(subIndexValue);
      const capped = Math.min(500, Math.max(0, rounded));

      return {
        pollutant: key,
        value: capped,
        concentration,
        category: getCategory(capped),
      };
    }
  }

  return null;
}

/**
 * Calculates station AQI based on CPCB rules:
 * - Station AQI = maximum of sub-indices
 * - Prerequisite: at least 3 pollutants, at least 1 must be PM2.5 or PM10
 * - If prerequisite not met: provisional AQI with low confidence
 */
export function calculateStationAQI(
  pollutantAverages: Record<string, number>,
  stationId: string,
): StationAQI {
  const subIndices: SubIndex[] = [];
  let hasPM = false;

  for (const [pollutant, conc] of Object.entries(pollutantAverages)) {
    if (conc === null || conc === undefined || isNaN(conc)) continue;
    const sub = calculateSubIndex(conc, pollutant);
    if (sub) {
      subIndices.push(sub);
      if (sub.pollutant === 'pm25' || sub.pollutant === 'pm10') {
        hasPM = true;
      }
    }
  }

  if (subIndices.length === 0) {
    return {
      stationId,
      overall: 0,
      category: 'Good',
      dominant: 'none',
      subIndices: [],
      isProvisional: true,
      pollutantCount: 0,
      hasPM: false,
    };
  }

  // Sort sub-indices descending to find worst pollutant
  subIndices.sort((a, b) => b.value - a.value);
  const worst = subIndices[0];

  const pollutantCount = subIndices.length;
  const isProvisional = pollutantCount < 3 || !hasPM;

  return {
    stationId,
    overall: worst.value,
    category: getCategory(worst.value),
    dominant: worst.pollutant,
    subIndices,
    isProvisional,
    pollutantCount,
    hasPM,
  };
}
