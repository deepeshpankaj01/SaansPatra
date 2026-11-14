import { z } from 'zod';

export const analyzeInputSchema = z.object({
  data: z
    .string()
    .min(1, 'Input data cannot be empty')
    .max(1_048_576, 'File/Input size exceeds 1 MB limit'),
  format: z.enum(['auto', 'csv', 'tsv', 'json']).default('auto'),
});

export const personaEnum = z.enum([
  'ward_officer',
  'rwa',
  'school',
  'citizen',
]);

export const briefInputSchema = z.object({
  stats: z.object({
    stations: z.array(z.any()),
    hotspots: z.array(z.any()),
    evidence: z.array(z.any()),
    overallAQI: z.object({
      value: z.number(),
      category: z.string(),
      isProvisional: z.boolean(),
      dominantStation: z.string(),
      dominantPollutant: z.string(),
    }),
    summary: z.object({
      totalStations: z.number(),
      totalReadings: z.number(),
      worstStation: z.string(),
      bestStation: z.string(),
      dominantPollutant: z.string(),
    }),
  }),
  persona: personaEnum.default('ward_officer'),
});

export const translateInputSchema = z.object({
  text: z.string().min(1).max(50_000, 'Advisory text exceeds 50 KB limit'),
  language: z.enum(['en', 'hi', 'mr', 'bn', 'ta', 'te']),
  readingLevel: z.enum(['simple', 'general', 'technical']).default('general'),
});

export const compareInputSchema = z.object({
  currentSnapshot: z.any(),
  previousSnapshot: z.any(),
});

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  error: string;
}

export function validateInput<T>(
  schema: z.ZodSchema<T>,
  input: unknown,
): ValidationSuccess<T> | ValidationFailure {
  const result = schema.safeParse(input);
  if (!result.success) {
    const message = result.error.issues
      .map((issue) => `${issue.path.join('.') || 'root'}: ${issue.message}`)
      .join(', ');
    return { success: false, error: message };
  }
  return { success: true, data: result.data };
}
