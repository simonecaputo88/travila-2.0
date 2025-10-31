// apps/server/src/routes/itineraries.ts
import { FastifyPluginCallback } from 'fastify';
import { z } from 'zod';
import { getOpenAI, OPENAI_MODEL } from '../services/openai';
import { FastItinerarySchema } from '../utils/fast-schema';

/** Validazione del body della richiesta */
const bodySchema = z.object({
  locale: z.union([z.literal('it'), z.literal('en')]).default('it'),
  city: z.string().trim().min(1, 'city required'),
  days: z.coerce.number().int().min(1, 'days must be >= 1').max(14, 'days must be <= 14'),
});

/** Prompt system: forza il modello a restituire SOLO JSON */
const SYSTEM = `You are a senior travel planner that outputs ONLY strict JSON.
Do not include any prose, code fences, or explanations outside JSON.`;

/** Prompt utente “a binari” con descrizione dello schema richiesto */
function makePrompt(locale: 'it' | 'en', city: string, days: number) {
  const schema = {
    schemaVersion: '1.0',
    locale: 'it|en',
    city: 'string',
    country: 'string',
    days: 'number (1-14)',
    summary: 'string (1-2 sentences)',
    highlights: [
      {
        title: 'string',
        description: 'string (max 2 sentences)',
        coords: { lat: 'number', lon: 'number' },
        imageHint: 'string (short)',
      },
    ],
    typicalDishes: [{ name: 'string', description: 'string' }],
    weather: {
      bestMonthsHint: 'string',
      temperatureHint: 'string',
      rainHint: 'string',
    },
    practicalTips: ['string'],
  };

  const it = `Lingua di output: ${locale}.
Genera un itinerario FAST per "${city}" (${days} giorni).
DEVI restituire ESCLUSIVAMENTE un JSON valido e conforme allo schema seguente.
Regole:
- Nessun testo fuori dal JSON.
- "country" deve essere il paese reale della città.
- "highlights": 5–8 punti con descrizioni max 2 frasi.
- "typicalDishes": almeno 2 piatti tipici con breve descrizione.
- "weather": mesi migliori, temperatura e piogge in modo sintetico.
- "practicalTips": 3–5 consigli pratici.
- "coords" metti null se non sei sicuro.
- "locale" deve essere "${locale}".
- "schemaVersion" deve essere "1.0".

Schema di riferimento:
${JSON.stringify(schema, null, 2)}
`;

  const en = `Language: ${locale}.
Generate a FAST itinerary for "${city}" (${days} days).
You MUST return ONLY valid JSON that strictly conforms to the schema below.
Rules:
- No text outside JSON.
- "country" must be the real country for the city.
- "highlights": 5–8 items, each with up to 2-sentence descriptions.
- "typicalDishes": at least 2 local dishes with short descriptions.
- "weather": concise seasonal hints (best months, temperatures, rain).
- "practicalTips": 3–5 practical bullets.
- "coords": set to null if not confident.
- "locale" must be "${locale}".
- "schemaVersion" must be "1.0".

Reference schema:
${JSON.stringify(schema, null, 2)}
`;

  return locale === 'it' ? it : en;
}

const plugin: FastifyPluginCallback = (app, _opts, done) => {
  /**
   * POST /api/itineraries/fast
   * Body: { locale: 'it'|'en', city: string, days: number }
   * Ritorna: JSON conforme a FastItinerarySchema
   */
  app.post('/itineraries/fast', async (req, reply) => {
    // 1) Validazione input (400 in caso di errore)
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'BAD_REQUEST', issues: parsed.error.format() };
    }
    const { locale, city, days } = parsed.data;

    // 2) Ottieni il client OpenAI (lazy init, così .env è già caricato)
    const openai = getOpenAI();

    let raw = '';
    try {
      // 3) Tentativo con JSON mode (modelli che lo supportano)
      try {
        const completion = await openai.chat.completions.create({
          model: OPENAI_MODEL, // es. gpt-4o-mini, configurabile via .env
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: makePrompt(locale, city, days) },
          ],
          temperature: 0.6,
        });
        raw = completion.choices[0]?.message?.content?.trim() ?? '';
      } catch {
        // 4) Fallback: alcuni modelli non supportano response_format
        const completion = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: makePrompt(locale, city, days) },
          ],
          temperature: 0.6,
        });
        raw = completion.choices[0]?.message?.content?.trim() ?? '';
      }

      // 5) Parse JSON (502 se non valido)
      let parsedJson: unknown;
      try {
        parsedJson = JSON.parse(raw);
      } catch {
        reply.code(502);
        return { error: 'LLM_JSON_INVALID', message: 'Output non JSON', raw };
      }

      // 6) Validazione schema (502 se mismatch)
      const validated = FastItinerarySchema.safeParse(parsedJson);
      if (!validated.success) {
        reply.code(502);
        return { error: 'LLM_SCHEMA_MISMATCH', issues: validated.error.format(), raw };
      }

      // 7) OK
      return validated.data;
    } catch (err: any) {
      // 8) Errori rete/LLM
      app.log.error({ err }, 'OPENAI_ERROR');
      reply.code(502);
      return { error: 'OPENAI_ERROR', message: err?.message ?? 'Unknown error' };
    }
  });

  /** Stub PRO (rimane per sviluppo futuro) */
  app.post('/itineraries/pro', async (_req, _reply) => {
    return { content: 'TODO: PRO' };
  });

  done();
};

export default plugin;
