import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Singleton Client for Google Generative AI (Gemini) SDK
 */
let genAIInstance: GoogleGenerativeAI | null = null;

export function getGenerativeAIClient(): GoogleGenerativeAI {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY || '';
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

export function isGeminiAPIKeyConfigured(): boolean {
  const apiKey = process.env.GEMINI_API_KEY;
  return Boolean(apiKey && apiKey !== 'AIzaSy_demo_placeholder_or_real_key');
}
