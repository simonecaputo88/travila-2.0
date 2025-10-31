import 'dotenv/config';
export const env = {
  PORT: Number(process.env.PORT || 3333),
  MONGODB_URI: process.env.MONGODB_URI!,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
  OPENAI_MODEL: process.env.OPENAI_MODEL || 'gpt-4o-mini',
  AMADEUS_API_KEY: process.env.AMADEUS_API_KEY || '',
  AMADEUS_API_SECRET: process.env.AMADEUS_API_SECRET || '',
  CORS_ORIGIN: process.env.CORS_ORIGIN || '*',
};
