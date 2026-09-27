import { GoogleGenAI } from '@google/genai';

export type LayoutSuggestion = {
  headlineScale: number;
  photoScale: number;
  accentPosition: 'top' | 'bottom' | 'both';
  decoration: 'dove' | 'floral' | 'rice-paddy' | 'flag-ribbon' | 'none';
  rationale: string;
};

const fallback: LayoutSuggestion = {
  headlineScale: 1,
  photoScale: 1,
  accentPosition: 'both',
  decoration: 'floral',
  rationale: 'Balanced headline, photo and footer spacing for a print-ready composition.'
};

export async function suggestLayout(input: {
  occasion: string;
  headline: string;
  photoCount: number;
  templateTitle: string;
}) {
  if (!process.env.GEMINI_API_KEY) return { suggestion: fallback, prompt: 'fallback-layout' };

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `You are a poster layout assistant. Return JSON only. Do not write campaign slogans or persuasive political messaging.\nTemplate: ${input.templateTitle}\nOccasion: ${input.occasion}\nBangla headline: ${input.headline}\nPhoto count: ${input.photoCount}\nReturn: {headlineScale:number,photoScale:number,accentPosition:"top"|"bottom"|"both",decoration:"dove"|"floral"|"rice-paddy"|"flag-ribbon"|"none",rationale:string}. Keep values between 0.8 and 1.25.`;
  const response = await ai.models.generateContent({ model: process.env.GEMINI_MODEL || 'gemini-2.5-flash', contents: prompt });
  const text = response.text?.trim() || '';
  try {
    const parsed = JSON.parse(text.replace(/^```json\s*|\s*```$/g, '')) as LayoutSuggestion;
    return { suggestion: { ...fallback, ...parsed }, prompt };
  } catch {
    return { suggestion: fallback, prompt };
  }
}
