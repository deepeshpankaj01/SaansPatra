import { getGeminiClient, getModelName, isGeminiAvailable } from './client';
import {
  TranslationResponse,
  translationResponseSchema,
  GEMINI_TRANSLATION_SCHEMA,
} from './schemas';
import { AnalyticsResult } from '../analytics/types';
import { getStaticFallbackTranslation } from './fallback';

export interface LanguageMeta {
  code: string;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
];

export type ReadingLevel = 'simple' | 'general' | 'technical';

export const READING_LEVEL_DESCRIPTIONS: Record<ReadingLevel, string> = {
  simple: 'Class-5 simple: Very short sentences, no jargon, easy everyday words for children and neo-literates.',
  general: 'General: Clear public civic advisory for residents, parents, and commuters.',
  technical: 'Technical: Includes precise pollutant concentrations (µg/m³), legal CPCB limits, and meteorological terms.',
};

/**
 * Translates an air quality advisory to a target Indian language and reading level.
 */
export async function translateAdvisory(
  text: string,
  language: string,
  readingLevel: ReadingLevel = 'general',
  statsFallback?: AnalyticsResult,
): Promise<TranslationResponse> {
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language);
  const targetLang = langMeta ? `${langMeta.name} (${langMeta.nativeName})` : language;

  if (!isGeminiAvailable() || language === 'en') {
    if (language === 'en') {
      return {
        translation: text,
        language: 'en',
        readingLevel,
      };
    }
    if (statsFallback) {
      return getStaticFallbackTranslation(language, readingLevel, statsFallback);
    }
    return {
      translation: text,
      language,
      readingLevel,
    };
  }

  const client = getGeminiClient();
  if (!client) {
    if (statsFallback) {
      return getStaticFallbackTranslation(language, readingLevel, statsFallback);
    }
    return { translation: text, language, readingLevel };
  }

  const model = getModelName();
  const levelInstruction = READING_LEVEL_DESCRIPTIONS[readingLevel];

  const prompt = [
    `Translate and adapt the following civic air quality advisory into ${targetLang}.`,
    `Reading level requirement: ${levelInstruction}`,
    'Maintain civic clarity, warm empathetic tone, and accurate public health precautions.',
    'Do NOT invent new numerical figures.',
    '',
    'Text to adapt:',
    text,
  ].join('\n\n');

  try {
    const response = await client.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: GEMINI_TRANSLATION_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    return translationResponseSchema.parse(parsed);
  } catch (err) {
    console.warn(`Translation to ${language} failed; using fallback:`, err);
    if (statsFallback) {
      return getStaticFallbackTranslation(language, readingLevel, statsFallback);
    }
    return {
      translation: text,
      language,
      readingLevel,
    };
  }
}

/**
 * Translates advisory across multiple languages in parallel.
 */
export async function translateAllParallel(
  text: string,
  languages: string[],
  readingLevel: ReadingLevel = 'general',
  statsFallback?: AnalyticsResult,
): Promise<Record<string, string>> {
  const promises = languages.map(async (lang) => {
    const result = await translateAdvisory(text, lang, readingLevel, statsFallback);
    return { lang, text: result.translation };
  });

  const results = await Promise.all(promises);
  const translationMap: Record<string, string> = {};
  for (const r of results) {
    translationMap[r.lang] = r.text;
  }
  return translationMap;
}
