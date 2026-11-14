import { BriefSnapshot, DiffResult, StationDelta, ActionCarryOverItem } from './types';

/**
 * Computes a deterministic diff between current brief snapshot and previous snapshot.
 * Runs client-side; no LLM needed.
 */
export function computeDiff(
  current: BriefSnapshot,
  previous: BriefSnapshot,
): DiffResult {
  const previousStationMap = new Map(
    previous.analytics.stations.map((s) => [s.stationId, s]),
  );

  const stationDeltas: StationDelta[] = [];

  for (const curStation of current.analytics.stations) {
    const prev = previousStationMap.get(curStation.stationId);
    if (prev) {
      const curAQI = curStation.aqi.overall;
      const prevAQI = prev.aqi.overall;
      stationDeltas.push({
        stationId: curStation.stationId,
        previousAQI: prevAQI,
        currentAQI: curAQI,
        delta: curAQI - prevAQI,
        previousCategory: prev.aqi.category,
        currentCategory: curStation.aqi.category,
      });
    }
  }

  // Hotspots: new vs resolved
  const prevHotspots = new Set(previous.analytics.hotspots.map((h) => h.stationId));
  const curHotspots = new Set(current.analytics.hotspots.map((h) => h.stationId));

  const newHotspots = [...curHotspots].filter((h) => !prevHotspots.has(h));
  const resolvedHotspots = [...prevHotspots].filter((h) => !curHotspots.has(h));

  // Overall AQI delta
  const overallAQIDelta =
    current.analytics.overallAQI.value - previous.analytics.overallAQI.value;

  // Action carry-over tracking
  const prevCheckedSet = new Set(previous.checkedActionIds || []);
  const actionCarryOver: ActionCarryOverItem[] = [];

  for (const act of previous.briefing.actions) {
    const wasChecked = prevCheckedSet.has(act.action);
    actionCarryOver.push({
      actionId: act.action,
      action: act.action,
      wasChecked,
    });
  }

  return {
    stationDeltas,
    newHotspots,
    resolvedHotspots,
    overallAQIDelta,
    qualityChange: {
      previousOverallAQI: previous.analytics.overallAQI.value,
      currentOverallAQI: current.analytics.overallAQI.value,
    },
    actionCarryOver,
    timestamps: {
      previous: previous.createdAt,
      current: current.createdAt,
    },
  };
}
