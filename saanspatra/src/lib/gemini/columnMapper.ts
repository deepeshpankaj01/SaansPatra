import { getGeminiClient, getModelName, isGeminiAvailable } from './client';
import {
  ColumnMapping,
  columnMappingSchema,
  GEMINI_COLUMN_MAPPING_SCHEMA,
} from './schemas';

/**
 * Resolves ambiguous headers or units using Gemini when deterministic synonym lookup fails.
 * Constrained by structured JSON schema.
 */
export async function mapAmbiguousColumns(
  unmappedHeaders: string[],
  sampleRows: Record<string, string>[],
): Promise<ColumnMapping> {
  if (!isGeminiAvailable() || unmappedHeaders.length === 0) {
    return { mappings: [] };
  }

  const client = getGeminiClient();
  if (!client) {
    return { mappings: [] };
  }

  const model = getModelName();

  const samples = sampleRows.slice(0, 3).map((row) => {
    const picked: Record<string, string> = {};
    for (const h of unmappedHeaders) {
      picked[h] = row[h] || '';
    }
    return picked;
  });

  const prompt = [
    'You are an expert environmental data engineer.',
    'Map the following unrecognized column headers to standard air quality pollutants or metadata.',
    'Allowed normalized targets: pm25, pm10, no2, so2, co, o3, nh3, pb, station, timestamp, ignore.',
    'Common units: ug/m3, mg/m3, ppb, ppm.',
    '',
    `Headers to map: ${JSON.stringify(unmappedHeaders)}`,
    `Sample row values: ${JSON.stringify(samples)}`,
  ].join('\n\n');

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_COLUMN_MAPPING_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return columnMappingSchema.parse(parsed);
  } catch (err) {
    console.warn('Gemini column mapping failed:', err);
    return { mappings: [] };
  }
}
