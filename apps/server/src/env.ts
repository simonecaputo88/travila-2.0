// apps/server/src/env.ts
import { config } from 'dotenv';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Carica sempre l'.env di apps/server, indipendentemente dalla CWD
const envPath = resolve(__dirname, '../.env');
const result = config({ path: envPath });

export const env = {
  PORT: Number(process.env.PORT || 3333),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/travila',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY || '',
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};

// Log diagnostici (dev)
console.log('[ENV] Loaded from:', envPath);
console.log('[ENV] dotenv parse keys:', result.parsed ? Object.keys(result.parsed) : '(none)');
console.log('[ENV] OPENAI_API_KEY:', env.OPENAI_API_KEY ? '✅ Present' : '❌ Missing');
