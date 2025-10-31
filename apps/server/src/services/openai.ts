// apps/server/src/services/openai.ts
import OpenAI from 'openai';
import { env } from '../env';

let _client: OpenAI | null = null;

export function getOpenAI(): OpenAI {
  if (!_client) {
    if (!env.OPENAI_API_KEY) {
      // Throw esplicito e leggibile se manca la chiave
      throw new Error('OPENAI_API_KEY is missing (apps/server/.env)');
    }
    _client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return _client;
}

export const OPENAI_MODEL = env.OPENAI_MODEL;
