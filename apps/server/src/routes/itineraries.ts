// apps/server/src/routes/itineraries.ts
import { FastifyPluginCallback } from 'fastify';
import { z } from 'zod';
import { getOpenAI, OPENAI_MODEL } from '../services/openai';
import { FastItinerarySchema } from '../utils/fast-schema';

const bodySchema = z.object({
  locale: z.union([z.literal('it'), z.literal('en')]).default('it'),
  city: z.string().trim().min(1, 'city required'),
  days: z.coerce.number().int().min(1, 'days must be >= 1').max(21, 'days must be <= 21'),
});

const SYSTEM = `You are a senior travel planner that outputs ONLY strict JSON. 
Do not include any prose, code fences, or explanations outside JSON.`;

// Prompt “binari” che chiede JSON 2.0 con le nuove sezioni
function makePrompt(locale: 'it' | 'en', city: string, days: number) {
  const schema = {
    schemaVersion: '2.0',
    locale: 'string (it|en)',
    city: 'string',
    country: 'string',
    summary: 'string (1-2 sentences, localized)',
    highlights: [
      {
        title: 'string',
        description: 'string (<=2 sentences)',
        coords: 'object { lat:number, lon:number } OR null',
        imageHint: 'string (short)',
      },
    ],
    typicalDishes: [{ name: 'string', description: 'string' }],
    practicalTips: ['string (min 3 items)'],
    monthlyClimate: [
      {
        month: 'string (localized month name)',
        tMinC: 'number',
        tMaxC: 'number',
        precipitationMm: 'number',
      },
    ], // array MUST contain 12 entries (one per month)
    currency: {
      name: 'string',
      code: 'string',
      symbol: 'string',
      fxHint: 'string (optional)',
    },
    entryRequirements: {
      passportRequired: 'boolean',
      visaRequired: 'boolean',
      eVisaAvailable: 'boolean (optional)',
      stayWithoutVisaDays: 'number (optional)',
      notes: 'string (optional)',
      sources: ['url (optional)'],
    },
    health: {
      vaccines: [{ name: 'string', required: 'boolean', recommendation: 'string' }],
      travelAdvisories: ['string'],
      sources: ['url (optional)'],
    },
    officialSites: [{ label: 'string', url: 'url' }],
    coupleItinerary: {
      days: 'number (>=1)',
      plan: [
        {
          day: 'number (>=1)',
          morning: 'string',
          lunch: 'string',
          afternoon: 'string',
          dinner: 'string',
          night: 'string',
          notes: 'string (optional)',
        },
      ],
    },
    recommendedDays: 'number (1-21)',
    weather: {
      bestMonthsHint: 'string',
      temperatureHint: 'string',
      rainHint: 'string',
    },
  };

  const baseRules = `
- Output language: ${locale}.
- Return ONLY a valid JSON object conforming to the schema provided (no extra text).
- "schemaVersion" MUST be "2.0".
- "locale" MUST be "${locale}".
- "country" MUST be the real country for "${city}".
- "monthlyClimate" MUST contain 12 entries (one per month) with average min/max temperatures (°C) and precipitation (mm).
- "practicalTips" MUST contain at least 3 concise travel tips.
- "recommendedDays": base it on city size and density of points of interest.
- "coupleItinerary.days": choose a number consistent with "recommendedDays" (not necessarily equal to requested ${days}); 
  the itinerary MUST have exactly "days" items in "plan".
- If not confident about coordinates for a highlight, set "coords" to null.
- For "entryRequirements", if uncertain, set conservative hints and include official sources in "sources" if you know them.
- For "health.sources", prefer WHO/CDC/Ministero if you know them.
`;

  const it = `Genera un itinerario FAST esteso per "${city}" (richiesta utente: ${days} giorni).
${baseRules}

Schema di riferimento (descrittivo, NON copiarlo letteralmente):
${JSON.stringify(schema, null, 2)}
`;

  const en = `Generate an extended FAST itinerary for "${city}" (user requested: ${days} days).
${baseRules}

Reference schema (descriptive, DO NOT copy it literally):
${JSON.stringify(schema, null, 2)}
`;

  return locale === 'it' ? it : en;
}

const plugin: FastifyPluginCallback = (app, _opts, done) => {
  app.post('/itineraries/fast', async (req, reply) => {
    const parsed = bodySchema.safeParse(req.body);
    if (!parsed.success) {
      reply.code(400);
      return { error: 'BAD_REQUEST', issues: parsed.error.format() };
    }
    const { locale, city, days } = parsed.data;

    const openai = getOpenAI();
    let raw = '';

    try {
      // Primo tentativo: JSON mode
      try {
        const completion = await openai.chat.completions.create({
          model: OPENAI_MODEL,
          response_format: { type: 'json_object' },
          messages: [
            { role: 'system', content: SYSTEM },
            { role: 'user', content: makePrompt(locale, city, days) },
          ],
          temperature: 0.6,
        });
        raw = completion.choices[0]?.message?.content?.trim() ?? '';
      } catch {
        // Fallback: senza JSON mode
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

      // Parse JSON
      let parsedJson: any;
      try {
        parsedJson = JSON.parse(raw);
      } catch {
        reply.code(502);
        return { error: 'LLM_JSON_INVALID', message: 'Output non JSON', raw };
      }

      // ✅ Normalizzazione "practicalTips": garantiamo almeno 3 elementi
      if (parsedJson && Array.isArray(parsedJson.practicalTips)) {
        const fillers = [
          'Acquista un’assicurazione di viaggio adeguata.',
          'Tieni copie digitali di documenti importanti (passaporto, biglietti).',
          'Controlla orari e biglietti in anticipo per le principali attrazioni.',
          'Porta una power bank e una bottiglia riutilizzabile.',
        ];
        while (parsedJson.practicalTips.length < 3) {
          parsedJson.practicalTips.push(fillers[parsedJson.practicalTips.length % fillers.length]);
        }
      }

      // Validazione schema
      const validated = FastItinerarySchema.safeParse(parsedJson);
      if (!validated.success) {
        reply.code(502);
        return { error: 'LLM_SCHEMA_MISMATCH', issues: validated.error.format(), raw };
      }

      return validated.data;
    } catch (err: any) {
      app.log.error({ err }, 'OPENAI_ERROR');
      reply.code(502);
      return { error: 'OPENAI_ERROR', message: err?.message ?? 'Unknown error' };
    }
  });

  // Stub PRO per uso futuro
  app.post('/itineraries/pro', async (_req, _reply) => {
    return { content: 'TODO: PRO' };
  });

  done();
};

export default plugin;
