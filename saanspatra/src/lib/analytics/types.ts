export type AQICategory =
  | 'Good'
  | 'Satisfactory'
  | 'Moderate'
  | 'Poor'
  | 'Very Poor'
  | 'Severe';

export interface SubIndex {
  pollutant: string;
  value: number;
  concentration: number;
  category: AQICategory;
}

export interface StationAQI {
  stationId: string;
  overall: number;
  category: AQICategory;
  dominant: string;
  subIndices: SubIndex[];
  isProvisional: boolean;
  pollutantCount: number;
  hasPM: boolean;
}

export interface PollutantStat {
  mean: number;
  max: number;
  min: number;
  count: number;
  stdDev: number;
}

export type TrendDirection = 'improving' | 'worsening' | 'stable' | 'insufficient';

export interface StationStats {
  stationId: string;
  aqi: StationAQI;
  pollutantStats: Record<string, PollutantStat>;
  trend: TrendDirection;
  hourlyPattern: Record<number, number>;
  readingCount: number;
  flaggedCount: number;
}

export interface HotspotEntry {
  stationId: string;
  score: number;
  aqi: number;
  category: AQICategory;
  dominant: string;
  duration: number;
  dataConfidence: number;
}

export interface Evidence {
  id: string;
  type: 'stat' | 'hotspot' | 'trend' | 'pattern' | 'quality';
  description: string;
  stationId?: string;
  rowIds: string[];
  value: number | string;
  pollutant?: string;
}

export interface OverallAQI {
  value: number;
  category: AQICategory;
  isProvisional: boolean;
  dominantStation: string;
  dominantPollutant: string;
}

export interface AnalyticsSummary {
  totalStations: number;
  totalReadings: number;
  worstStation: string;
  bestStation: string;
  dominantPollutant: string;
}

export interface AnalyticsResult {
  stations: StationStats[];
  hotspots: HotspotEntry[];
  evidence: Evidence[];
  overallAQI: OverallAQI;
  summary: AnalyticsSummary;
}
