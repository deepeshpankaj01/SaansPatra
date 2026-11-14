import { getGeminiClient, getModelName, isGeminiAvailable } from './client';
import {
  ComparisonNarration,
  comparisonNarrationSchema,
  GEMINI_COMPARISON_SCHEMA,
} from './schemas';
import { DiffResult } from '../compare/types';

/**
 * Generates an executive narration of "what changed" between two brief snapshots.
 */
export async function narrateChanges(
  diff: DiffResult,
): Promise<ComparisonNarration> {
  if (!isGeminiAvailable()) {
    return generateFallbackNarration(diff);
  }

  const client = getGeminiClient();
  if (!client) {
    return generateFallbackNarration(diff);
  }

  const model = getModelName();

  const prompt = [
    'You are a senior environmental intelligence officer.',
    'Review the following deterministic delta between two air quality monitoring cycles.',
    'Provide a concise summary, key highlights (improving or worsening stations), and primary concerns.',
    '',
    JSON.stringify(diff, null, 2),
  ].join('\n\n');

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_COMPARISON_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return comparisonNarrationSchema.parse(parsed);
  } catch (err) {
    console.warn('Gemini comparison narration failed; using fallback:', err);
    return generateFallbackNarration(diff);
  }
}

function generateFallbackNarration(diff: DiffResult): ComparisonNarration {
  const worsened = diff.stationDeltas.filter((d) => d.delta > 5);
  const improved = diff.stationDeltas.filter((d) => d.delta < -5);

  const summary = `Compared to the previous cycle, ${worsened.length} stations worsened, ${improved.length} stations improved, and ${diff.newHotspots.length} new hotspots emerged.`;

  const highlights = [];
  if (improved.length > 0) {
    highlights.push(
      `Notable improvement at: ${improved.map((s) => `${s.stationId} (${s.delta} AQI)`).join(', ')}.`,
    );
  }
  if (diff.resolvedHotspots.length > 0) {
    highlights.push(`Resolved hotspots: ${diff.resolvedHotspots.join(', ')}.`);
  }

  const concerns = [];
  if (worsened.length > 0) {
    concerns.push(
      `Deterioration observed at: ${worsened.map((s) => `${s.stationId} (+${s.delta} AQI)`).join(', ')}.`,
    );
  }
  if (diff.newHotspots.length > 0) {
    concerns.push(`New high-priority hotspots: ${diff.newHotspots.join(', ')}.`);
  }

  return {
    summary,
    highlights: highlights.length > 0 ? highlights : ['Regional conditions remained generally stable.'],
    concerns: concerns.length > 0 ? concerns : ['No new emerging critical hotspots.'],
  };
}
