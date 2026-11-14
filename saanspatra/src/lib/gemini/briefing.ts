import { AnalyticsResult } from '../analytics/types';
import { getGeminiClient, getModelName, isGeminiAvailable } from './client';
import {
  BriefingResponse,
  briefingResponseSchema,
  GEMINI_BRIEFING_SCHEMA,
} from './schemas';
import {
  buildHardenedSystemInstruction,
  wrapUntrustedData,
} from '../security/promptDefense';
import { generateFallbackBrief } from './fallback';

/**
 * Builds compact aggregated statistics payload.
 * Strictly sends only summary stats and evidence IDs to save tokens and prevent raw data exposure.
 */
export function buildCompactStatsPayload(stats: AnalyticsResult): string {
  const compact = {
    overallAQI: stats.overallAQI,
    summary: stats.summary,
    hotspots: stats.hotspots.map((h) => ({
      station: h.stationId,
      aqi: h.aqi,
      category: h.category,
      score: h.score,
      dominant: h.dominant,
      confidence: h.dataConfidence,
    })),
    stations: stats.stations.map((s) => ({
      station: s.stationId,
      aqi: s.aqi.overall,
      category: s.aqi.category,
      dominant: s.aqi.dominant,
      trend: s.trend,
      pm25Mean: s.pollutantStats['pm25']?.mean,
      pm10Mean: s.pollutantStats['pm10']?.mean,
      readings: s.readingCount,
      flags: s.flaggedCount,
      isProvisional: s.aqi.isProvisional,
    })),
    evidenceList: stats.evidence.map((e) => ({
      id: e.id,
      description: e.description,
      station: e.stationId,
      value: e.value,
    })),
  };

  return JSON.stringify(compact, null, 2);
}

/**
 * Generates an executive briefing note with Gemini.
 * Uses structured output JSON schema with grounding constraints.
 * Gracefully falls back to deterministic brief if API fails or key is missing.
 */
export async function generateBriefing(
  stats: AnalyticsResult,
  persona = 'ward_officer',
): Promise<{ brief: BriefingResponse; isFallback: boolean }> {
  if (!isGeminiAvailable()) {
    return {
      brief: generateFallbackBrief(stats, persona),
      isFallback: true,
    };
  }

  const client = getGeminiClient();
  if (!client) {
    return {
      brief: generateFallbackBrief(stats, persona),
      isFallback: true,
    };
  }

  const model = getModelName();
  const systemInstruction = buildHardenedSystemInstruction(persona);
  const compactPayload = buildCompactStatsPayload(stats);
  const userPrompt = [
    `Analyze the following verified air quality monitoring statistics for a ${persona.replace('_', ' ')}.`,
    'Generate findings (with evidenceRefs), identify hotspot names, prioritized actions (P1-P3), and note data gaps.',
    wrapUntrustedData(compactPayload),
  ].join('\n\n');

  try {
    const response = await client.models.generateContent({
      model,
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: GEMINI_BRIEFING_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('Empty response from Gemini');
    }

    const parsed = JSON.parse(text);
    const validated = briefingResponseSchema.parse(parsed);

    return {
      brief: validated,
      isFallback: false,
    };
  } catch (err) {
    console.warn('Gemini briefing generation failed; falling back to deterministic template:', err);
    return {
      brief: generateFallbackBrief(stats, persona),
      isFallback: true,
    };
  }
}
