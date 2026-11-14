import { z } from 'zod';
import { Type } from '@google/genai';

// --- Zod Schemas ---

export const briefingFindingSchema = z.object({
  id: z.string(),
  claim: z.string(),
  evidenceRefs: z.array(z.string()),
  severity: z.enum(['critical', 'high', 'moderate', 'low']),
  confidence: z.enum(['high', 'medium', 'low']),
});

export const briefingActionSchema = z.object({
  priority: z.enum(['P1', 'P2', 'P3']),
  action: z.string(),
  owner: z.string(),
  effort: z.enum(['low', 'medium', 'high']),
  timeframe: z.string(),
  rationale: z.string(),
  evidenceRefs: z.array(z.string()),
});

export const briefingResponseSchema = z.object({
  findings: z.array(briefingFindingSchema),
  hotspots: z.array(z.string()),
  actions: z.array(briefingActionSchema),
  dataGaps: z.array(z.string()),
});

export const translationResponseSchema = z.object({
  translation: z.string(),
  language: z.string(),
  readingLevel: z.string(),
});

export const comparisonNarrationSchema = z.object({
  summary: z.string(),
  highlights: z.array(z.string()),
  concerns: z.array(z.string()),
});

export const columnMappingSchema = z.object({
  mappings: z.array(
    z.object({
      original: z.string(),
      normalized: z.string(),
      unit: z.string(),
      confidence: z.number(),
    }),
  ),
});

export type BriefingFinding = z.infer<typeof briefingFindingSchema>;
export type BriefingAction = z.infer<typeof briefingActionSchema>;
export type BriefingResponse = z.infer<typeof briefingResponseSchema>;
export type TranslationResponse = z.infer<typeof translationResponseSchema>;
export type ComparisonNarration = z.infer<typeof comparisonNarrationSchema>;
export type ColumnMapping = z.infer<typeof columnMappingSchema>;

// --- Gemini SDK Structured Output Schemas ---

export const GEMINI_BRIEFING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    findings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          claim: { type: Type.STRING },
          evidenceRefs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
          severity: {
            type: Type.STRING,
            enum: ['critical', 'high', 'moderate', 'low'],
          },
          confidence: {
            type: Type.STRING,
            enum: ['high', 'medium', 'low'],
          },
        },
        required: ['id', 'claim', 'evidenceRefs', 'severity', 'confidence'],
      },
    },
    hotspots: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    actions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          priority: {
            type: Type.STRING,
            enum: ['P1', 'P2', 'P3'],
          },
          action: { type: Type.STRING },
          owner: { type: Type.STRING },
          effort: {
            type: Type.STRING,
            enum: ['low', 'medium', 'high'],
          },
          timeframe: { type: Type.STRING },
          rationale: { type: Type.STRING },
          evidenceRefs: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
          },
        },
        required: [
          'priority',
          'action',
          'owner',
          'effort',
          'timeframe',
          'rationale',
          'evidenceRefs',
        ],
      },
    },
    dataGaps: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['findings', 'hotspots', 'actions', 'dataGaps'],
};

export const GEMINI_TRANSLATION_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    translation: { type: Type.STRING },
    language: { type: Type.STRING },
    readingLevel: { type: Type.STRING },
  },
  required: ['translation', 'language', 'readingLevel'],
};

export const GEMINI_COMPARISON_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    summary: { type: Type.STRING },
    highlights: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
    concerns: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
    },
  },
  required: ['summary', 'highlights', 'concerns'],
};

export const GEMINI_COLUMN_MAPPING_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    mappings: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          normalized: { type: Type.STRING },
          unit: { type: Type.STRING },
          confidence: { type: Type.NUMBER },
        },
        required: ['original', 'normalized', 'unit', 'confidence'],
      },
    },
  },
  required: ['mappings'],
};
