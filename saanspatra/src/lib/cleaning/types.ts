export enum FlagReason {
  MISSING = 'MISSING',
  SENTINEL = 'SENTINEL',
  NEGATIVE = 'NEGATIVE',
  OUT_OF_RANGE = 'OUT_OF_RANGE',
  STUCK_SENSOR = 'STUCK_SENSOR',
  SPIKE = 'SPIKE',
  DUPLICATE = 'DUPLICATE',
  UNIT_AMBIGUOUS = 'UNIT_AMBIGUOUS',
  TIME_GAP = 'TIME_GAP',
  BAD_DATE = 'BAD_DATE',
}

export interface DataFlag {
  column: string;
  reason: FlagReason;
  detail: string;
}

export type RawRow = Record<string, string>;

export interface CleanedRow {
  id: string;
  stationId: string;
  timestamp: Date | null;
  pollutants: Record<string, number | null>;
  units: Record<string, string>;
  flags: DataFlag[];
  originalIndex: number;
}

export interface ParsedDataset {
  rows: CleanedRow[];
  headers: string[];
  rawHeaders: string[];
  format: 'csv' | 'tsv' | 'json';
  rowCount: number;
  stationIds: string[];
}

export interface QualityReport {
  totalRows: number;
  flaggedRows: number;
  flagCounts: Record<string, number>;
  stationReliability: Record<string, number>;
  overallReliability: number;
}

export const KNOWN_POLLUTANTS = ['pm25', 'pm10', 'no2', 'so2', 'co', 'o3', 'nh3', 'pb'] as const;
