import { ParsedDataset, QualityReport } from '../cleaning/types';
import {
  AnalyticsResult,
  OverallAQI,
  AnalyticsSummary,
  StationStats,
} from './types';
import { computeStationStats } from './stats';
import { rankHotspots } from './hotspots';
import { generateEvidence } from './evidence';

export * from './types';
export * from './breakpoints';
export * from './aqi';
export * from './stats';
export * from './hotspots';
export * from './patterns';
export * from './evidence';

/**
 * Deterministic analytics pipeline:
 * Computes per-station AQI, statistics, trend, hotspot ranking, and evidence trail.
 * Strictly no LLM involved.
 */
export function analyzeDataset(
  dataset: ParsedDataset,
  qualityReport?: QualityReport,
): AnalyticsResult {
  const { rows, stationIds } = dataset;

  if (rows.length === 0 || stationIds.length === 0) {
    return {
      stations: [],
      hotspots: [],
      evidence: [],
      overallAQI: {
        value: 0,
        category: 'Good',
        isProvisional: true,
        dominantStation: 'none',
        dominantPollutant: 'none',
      },
      summary: {
        totalStations: 0,
        totalReadings: 0,
        worstStation: 'none',
        bestStation: 'none',
        dominantPollutant: 'none',
      },
    };
  }

  // Compute stats for each station
  const stations: StationStats[] = stationIds.map((stationId) =>
    computeStationStats(rows, stationId),
  );

  // Rank hotspots
  const hotspots = rankHotspots(stations);

  // Generate evidence trail (E1, E2...)
  const evidence = generateEvidence(stations, hotspots, rows);

  // Overall AQI = worst station AQI (CPCB precautionary principle)
  const sortedByAQI = [...stations].sort(
    (a, b) => b.aqi.overall - a.aqi.overall,
  );
  const worstStation = sortedByAQI[0];
  const bestStation = sortedByAQI[sortedByAQI.length - 1];

  const overallAQI: OverallAQI = {
    value: worstStation.aqi.overall,
    category: worstStation.aqi.category,
    isProvisional: worstStation.aqi.isProvisional,
    dominantStation: worstStation.stationId,
    dominantPollutant: worstStation.aqi.dominant,
  };

  const summary: AnalyticsSummary = {
    totalStations: stations.length,
    totalReadings: rows.length,
    worstStation: worstStation.stationId,
    bestStation: bestStation.stationId,
    dominantPollutant: worstStation.aqi.dominant,
  };

  return {
    stations,
    hotspots,
    evidence,
    overallAQI,
    summary,
  };
}
