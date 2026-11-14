import { StationStats, HotspotEntry } from './types';

export function rankHotspots(stations: StationStats[]): HotspotEntry[] {
  const entries: HotspotEntry[] = stations.map((st) => {
    const aqi = st.aqi.overall;
    const category = st.aqi.category;
    const readingCount = Math.max(1, st.readingCount);
    const dataConfidence = Math.max(0.1, 1 - st.flaggedCount / readingCount);

    // Duration factor based on category severity
    let severityWeight = 0;
    if (category === 'Severe') severityWeight = 0.5;
    else if (category === 'Very Poor') severityWeight = 0.35;
    else if (category === 'Poor') severityWeight = 0.2;
    else if (category === 'Moderate') severityWeight = 0.1;

    // Trend weight: worsening adds to hotspot urgency
    const trendWeight = st.trend === 'worsening' ? 0.15 : 0;

    const duration = severityWeight + trendWeight;
    const score = Math.round(aqi * (1 + duration) * dataConfidence);

    return {
      stationId: st.stationId,
      score,
      aqi,
      category,
      dominant: st.aqi.dominant,
      duration: Math.round(duration * 100) / 100,
      dataConfidence: Math.round(dataConfidence * 100) / 100,
    };
  });

  // Sort descending by score
  return entries.sort((a, b) => b.score - a.score);
}
