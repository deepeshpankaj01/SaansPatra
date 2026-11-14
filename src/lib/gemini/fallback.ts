import { AnalyticsResult } from '../analytics/types';
import { BriefingResponse, BriefingFinding, TranslationResponse } from './schemas';

/**
 * Deterministic fallback brief generated without LLM.
 * Ensures the demo works 100% offline or when GEMINI_API_KEY is unset.
 */
export function generateFallbackBrief(
  stats: AnalyticsResult,
  persona: string,
): BriefingResponse {
  const { overallAQI, summary, stations, hotspots, evidence } = stats;

  const findings: BriefingFinding[] = [
    {
      id: 'F1',
      claim: `Overall regional air quality stands at ${overallAQI.value} (${overallAQI.category})${overallAQI.isProvisional ? ' [Provisional calculation due to limited pollutants]' : ''}, driven primarily by ${overallAQI.dominantPollutant.toUpperCase()} at ${overallAQI.dominantStation}.`,
      evidenceRefs: ['E1'],
      severity:
        overallAQI.value > 300
          ? ('critical' as const)
          : overallAQI.value > 200
            ? ('high' as const)
            : ('moderate' as const),
      confidence: overallAQI.isProvisional ? ('medium' as const) : ('high' as const),
    },
  ];

  // Add finding for worst hotspot
  if (hotspots.length > 0) {
    const top = hotspots[0];
    findings.push({
      id: 'F2',
      claim: `Primary local pollution hotspot identified at ${top.stationId} with severe index score ${top.score} (AQI ${top.aqi}). Sustained high levels observed.`,
      evidenceRefs: evidence.filter((e) => e.stationId === top.stationId).map((e) => e.id).slice(0, 2),
      severity: 'high' as const,
      confidence: 'high' as const,
    });
  }

  // Add finding for best station
  if (stations.length > 1 && summary.bestStation !== 'none') {
    const best = stations.find((s) => s.stationId === summary.bestStation);
    if (best) {
      findings.push({
        id: 'F3',
        claim: `Lowest observed concentrations recorded at ${best.stationId} (AQI ${best.aqi.overall}, ${best.aqi.category}).`,
        evidenceRefs: evidence.filter((e) => e.stationId === best.stationId).map((e) => e.id).slice(0, 1),
        severity: 'low' as const,
        confidence: 'high' as const,
      });
    }
  }

  // Persona-specific actions
  let actions = [];

  if (persona === 'ward_officer') {
    actions = [
      {
        priority: 'P1' as const,
        action: `Deploy mechanical sweeping and mist-cannon dust suppression along major corridors near ${overallAQI.dominantStation}.`,
        owner: 'Sanitation & Roads Wing',
        effort: 'medium' as const,
        timeframe: 'Immediate (within 4 hours)',
        rationale: `Directly targets suspended particulate matter (${overallAQI.dominantPollutant.toUpperCase()}) during peak exposure window.`,
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P1' as const,
        action: 'Activate mobile patrol flying squads to enforce zero open waste and biomass burning.',
        owner: 'Enforcement Wing',
        effort: 'low' as const,
        timeframe: 'Immediate',
        rationale: 'Open burning significantly exacerbates toxic fine particulate pollution in localized pockets.',
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P2' as const,
        action: 'Mandate wet-suppression and green netting compliance audits on all construction sites > 500 sq m.',
        owner: 'Building & Planning Department',
        effort: 'medium' as const,
        timeframe: '24 hours',
        rationale: 'Fugitive dust emissions constitute up to 30% of ambient coarse particulates in urban wards.',
        evidenceRefs: ['E2'],
      },
    ];
  } else if (persona === 'rwa') {
    actions = [
      {
        priority: 'P1' as const,
        action: 'Enforce strict ban on diesel generator (DG) set operations for non-emergency backup during peak hours.',
        owner: 'Estate Management Committee',
        effort: 'low' as const,
        timeframe: 'Immediate',
        rationale: 'Unfiltered DG exhaust contributes intense local spikes in NO2 and toxic ultrafine particles.',
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P1' as const,
        action: 'Prohibit security guards and sweepers from open biomass, leaf, or plastic burning for heating.',
        owner: 'Security & Housekeeping',
        effort: 'low' as const,
        timeframe: 'Immediate',
        rationale: 'Ground-level smoke creates trapped nighttime inversion plumes affecting ground and first-floor residents.',
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P2' as const,
        action: 'Broadcast citizen advisory via society WhatsApp / intercom warning vulnerable residents to restrict morning jogs.',
        owner: 'RWA Executive Board',
        effort: 'low' as const,
        timeframe: 'Within 2 hours',
        rationale: 'Early morning hours exhibit peak particulate settling and thermal inversion.',
        evidenceRefs: ['E1'],
      },
    ];
  } else if (persona === 'school') {
    actions = [
      {
        priority: 'P1' as const,
        action: 'Cancel all outdoor sports, physical education classes, and outdoor morning assemblies.',
        owner: 'Sports & Academic Coordinator',
        effort: 'low' as const,
        timeframe: 'Immediate',
        rationale: `Air quality category is ${overallAQI.category}. Heavy aerobic exertion causes deep alveolar deposition of ${overallAQI.dominantPollutant.toUpperCase()} in children.`,
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P1' as const,
        action: 'Advise all students and staff commuting on open two-wheelers/bicycles to wear well-fitted N95 masks.',
        owner: 'Principal & Health Office',
        effort: 'low' as const,
        timeframe: 'Today',
        rationale: 'Commute-hour exposure along traffic corridors can be 2-3x higher than indoor ambient levels.',
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P2' as const,
        action: 'Keep classroom windows closed during peak morning traffic (07:30 - 10:30) and run HEPA purifiers where installed.',
        owner: 'Facilities Supervisor',
        effort: 'low' as const,
        timeframe: 'Daily',
        rationale: 'Reduces indoor infiltration of roadside particulate matter.',
        evidenceRefs: ['E1'],
      },
    ];
  } else {
    // Citizen
    actions = [
      {
        priority: 'P1' as const,
        action: 'Avoid morning outdoor exercise, running, or strenuous physical work until air quality improves.',
        owner: 'Individual / Household',
        effort: 'low' as const,
        timeframe: 'Immediate',
        rationale: 'Elevated particulate levels enter the bloodstream and trigger bronchial inflammation.',
        evidenceRefs: ['E1'],
      },
      {
        priority: 'P2' as const,
        action: 'Keep doors and windows sealed during morning and late evening rush hours; ventilate only during sunny afternoons.',
        owner: 'Household',
        effort: 'low' as const,
        timeframe: 'Daily routine',
        rationale: 'Afternoon solar heating disperses the ground-level inversion layer.',
        evidenceRefs: ['E1'],
      },
    ];
  }

  const hotspotNames = hotspots.map((h) => h.stationId);
  const dataGaps = [];
  if (overallAQI.isProvisional) {
    dataGaps.push('Fewer than 3 CPCB criteria pollutants monitored; calculated index is provisional.');
  }
  const flaggedStations = stations.filter((s) => s.flaggedCount > 0);
  if (flaggedStations.length > 0) {
    dataGaps.push(
      `Anomalies or sensor flags detected at: ${flaggedStations.map((s) => `${s.stationId} (${s.flaggedCount} flags)`).join(', ')}.`,
    );
  }

  return {
    findings,
    hotspots: hotspotNames,
    actions,
    dataGaps,
  };
}

/**
 * Deterministic fallback citizen advisory in English.
 */
export function generateFallbackAdvisory(stats: AnalyticsResult): string {
  const { overallAQI, summary } = stats;

  return [
    `SAANSPATRA CIVIC AIR QUALITY ADVISORY`,
    `Current Regional Air Quality: ${overallAQI.category.toUpperCase()} (AQI ${overallAQI.value})`,
    `Primary Pollutant: ${overallAQI.dominantPollutant.toUpperCase()} | Monitored Stations: ${summary.totalStations}`,
    '',
    `HEALTH GUIDANCE:`,
    `- General Public: Current air quality poses noticeable discomfort to sensitive individuals. Reduce prolonged outdoor exertion.`,
    `- Children: Keep indoor activities prioritized. Postpone outdoor sports matches and athletic practice.`,
    `- Senior Citizens & Heart/Lung Patients: Remain indoors in well-ventilated rooms. Keep prescribed inhalers and medicines accessible.`,
    `- Commuters: Wear N95/FFP2 masks during peak traffic hours.`,
    '',
    `NOTE: This advisory is generated from civic air monitoring data for public awareness and does not constitute individual medical advice.`,
  ].join('\n');
}

/**
 * Deterministic static translations for key languages when offline.
 */
export function getStaticFallbackTranslation(
  language: string,
  readingLevel: string,
  stats: AnalyticsResult,
): TranslationResponse {
  const { overallAQI } = stats;

  const hindiSimple = `सांसपत्र - वायु गुणवत्ता सूचना:
आज हमारे क्षेत्र की हवा "${overallAQI.category}" श्रेणी (AQI ${overallAQI.value}) में है।
मुख्य प्रदूषक ${overallAQI.dominantPollutant.toUpperCase()} है।

सावधानियाँ:
1. बच्चे और बुजुर्ग सुबह की सैर या खेलकूद से बचें।
2. सांस या दमे के मरीज अपनी दवाएं साथ रखें और घर के अंदर रहें।
3. बाहर जाते समय मास्क का प्रयोग करें।
यह जानकारी नागरिक सुरक्षा के लिए है, चिकित्सीय सलाह नहीं।`;

  const marathiSimple = `श्वासपत्र - हवा गुणवत्ता सूचना:
आज आपल्या भागातील हवा "${overallAQI.category}" पातळीवर (AQI ${overallAQI.value}) आहे.
मुख्य प्रदूषक ${overallAQI.dominantPollutant.toUpperCase()} आहे.

काळजी घ्या:
१. लहान मुले आणि ज्येष्ठ नागरिकांनी मैदानी खेळ किंवा सकाळचा फिरणे टाळावे.
२. दमा किंवा हृदयविकार असणाऱ्यांनी घरातच राहावे व औषधे जवळ ठेवावीत.
३. बाहेर पडताना मास्कचा वापर करा.`;

  let text = generateFallbackAdvisory(stats);
  if (language === 'hi') text = hindiSimple;
  else if (language === 'mr') text = marathiSimple;

  return {
    translation: text,
    language,
    readingLevel,
  };
}
