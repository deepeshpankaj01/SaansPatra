import { StationStats, HotspotEntry, Evidence } from './types';
import { CleanedRow } from '../cleaning/types';

export function generateEvidence(
  stations: StationStats[],
  hotspots: HotspotEntry[],
  rows: CleanedRow[],
): Evidence[] {
  const evidenceList: Evidence[] = [];
  let seq = 1;

  const nextId = () => `E${seq++}`;

  // Helper to find sample row IDs for a station
  const getStationRowIds = (stationId: string, limit = 5): string[] => {
    return rows
      .filter((r) => r.stationId === stationId)
      .slice(0, limit)
      .map((r) => r.id);
  };

  // 1. Overall worst station & AQI
  if (stations.length > 0) {
    const sorted = [...stations].sort((a, b) => b.aqi.overall - a.aqi.overall);
    const worst = sorted[0];
    evidenceList.push({
      id: nextId(),
      type: 'stat',
      description: `Worst station AQI is ${worst.aqi.overall} (${worst.aqi.category}) at ${worst.stationId}, driven by ${worst.aqi.dominant.toUpperCase()}`,
      stationId: worst.stationId,
      rowIds: getStationRowIds(worst.stationId),
      value: worst.aqi.overall,
      pollutant: worst.aqi.dominant,
    });
  }

  // 2. Per-station AQI evidence
  for (const st of stations) {
    evidenceList.push({
      id: nextId(),
      type: 'stat',
      description: `Station ${st.stationId} reported AQI ${st.aqi.overall} (${st.aqi.category}) with ${st.readingCount} readings. Dominant pollutant: ${st.aqi.dominant.toUpperCase()}${st.aqi.isProvisional ? ' [PROVISIONAL]' : ''}`,
      stationId: st.stationId,
      rowIds: getStationRowIds(st.stationId),
      value: st.aqi.overall,
      pollutant: st.aqi.dominant,
    });

    // PM2.5 mean if available
    if (st.pollutantStats['pm25']) {
      const pm = st.pollutantStats['pm25'];
      evidenceList.push({
        id: nextId(),
        type: 'stat',
        description: `Station ${st.stationId} PM2.5 mean: ${pm.mean} µg/m³, max: ${pm.max} µg/m³, count: ${pm.count}`,
        stationId: st.stationId,
        rowIds: getStationRowIds(st.stationId),
        value: pm.mean,
        pollutant: 'pm25',
      });
    }

    // Trend evidence
    if (st.trend !== 'insufficient') {
      evidenceList.push({
        id: nextId(),
        type: 'trend',
        description: `Station ${st.stationId} air quality trend is ${st.trend} based on linear regression over time-series data`,
        stationId: st.stationId,
        rowIds: getStationRowIds(st.stationId),
        value: st.trend,
      });
    }
  }

  // 3. Hotspot evidence
  if (hotspots.length > 0) {
    const top = hotspots[0];
    evidenceList.push({
      id: nextId(),
      type: 'hotspot',
      description: `Primary air quality hotspot identified at ${top.stationId} with priority score ${top.score} (AQI ${top.aqi}, confidence ${Math.round(top.dataConfidence * 100)}%)`,
      stationId: top.stationId,
      rowIds: getStationRowIds(top.stationId),
      value: top.score,
    });
  }

  return evidenceList;
}
