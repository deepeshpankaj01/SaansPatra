import { AnalyticsResult, AQICategory } from '../analytics/types';
import { BriefingResponse } from '../gemini/schemas';
import { PersonaId } from '../persona/types';

export interface BriefSnapshot {
  id: string;
  createdAt: string;
  label?: string;
  statsHash: string;
  analytics: AnalyticsResult;
  briefing: BriefingResponse;
  persona: PersonaId;
  checkedActionIds: string[];
}

export interface StationDelta {
  stationId: string;
  previousAQI: number;
  currentAQI: number;
  delta: number;
  previousCategory: AQICategory;
  currentCategory: AQICategory;
}

export interface ActionCarryOverItem {
  actionId: string;
  action: string;
  wasChecked: boolean;
}

export interface DiffResult {
  stationDeltas: StationDelta[];
  newHotspots: string[];
  resolvedHotspots: string[];
  overallAQIDelta: number;
  qualityChange: {
    previousOverallAQI: number;
    currentOverallAQI: number;
  };
  actionCarryOver: ActionCarryOverItem[];
  timestamps: {
    previous: string;
    current: string;
  };
}
