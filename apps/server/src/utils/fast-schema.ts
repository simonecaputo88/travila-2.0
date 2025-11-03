// apps/server/src/utils/fast-schema.ts
import { z } from "zod";

export const MonthlyClimateSchema = z.object({
  month: z.string(),              // "January", "Feb", o "Gennaio" in base a locale
  tMinC: z.number(),              // temperatura media minima (°C)
  tMaxC: z.number(),              // temperatura media massima (°C)
  precipitationMm: z.number(),    // piovosità media (mm)
});

export const CoupleDayPlanSchema = z.object({
  day: z.number().int().min(1),
  morning: z.string(),
  lunch: z.string(),
  afternoon: z.string(),
  dinner: z.string(),
  night: z.string(),
  notes: z.string().optional(),
});

export const FastItinerarySchema = z.object({
  schemaVersion: z.literal("2.0"),
  locale: z.union([z.literal("it"), z.literal("en")]),
  city: z.string().min(1),
  country: z.string().min(1),

  // riepilogo + highlight (compat per UI attuale)
  summary: z.string(),
  highlights: z.array(z.object({
    title: z.string(),
    description: z.string(),
    coords: z.object({ lat: z.number(), lon: z.number() }).nullable().optional(),
    imageHint: z.string().optional()
  })).min(3),

  // piatti tipici (compat)
  typicalDishes: z.array(z.object({
    name: z.string(),
    description: z.string(),
  })).min(2),

  // consigli pratici (compat)
  practicalTips: z.array(z.string()).min(3),

  // meteo mensile nuovo (dettagliato)
  monthlyClimate: z.array(MonthlyClimateSchema).length(12),

  // valuta
  currency: z.object({
    name: z.string(),   // "Euro", "US Dollar"
    code: z.string(),   // "EUR", "USD"
    symbol: z.string(), // "€", "$"
    fxHint: z.string().optional(), // "Currency is widely accepted by cards" etc.
  }),

  // requisiti d’ingresso
  entryRequirements: z.object({
    passportRequired: z.boolean(),
    visaRequired: z.boolean(),
    eVisaAvailable: z.boolean().optional(),
    stayWithoutVisaDays: z.number().int().optional(), // es. 90
    notes: z.string().optional(),
    sources: z.array(z.string().url()).optional(),    // link a fonti ufficiali
  }),

  // salute/vaccini
  health: z.object({
    vaccines: z.array(z.object({
      name: z.string(),            // "Tetanus", "Hepatitis A"
      required: z.boolean(),       // true/false
      recommendation: z.string(),  // breve nota (quando, per chi)
    })).optional().default([]),
    travelAdvisories: z.array(z.string()).optional().default([]),
    sources: z.array(z.string().url()).optional(),    // link a Ministero Salute / WHO / CDC
  }),

  // siti ufficiali utili
  officialSites: z.array(z.object({
    label: z.string(),             // "Tourism Board", "Government Visa Portal"
    url: z.string().url(),
  })).optional().default([]),

  // itinerario di coppia (nuovo)
  coupleItinerary: z.object({
    days: z.number().int().min(1),
    plan: z.array(CoupleDayPlanSchema).min(1),
  }),

  // giorni consigliati per la città
  recommendedDays: z.number().int().min(1).max(21),

  // ancora presenti per retrocompat (non più usati in UI, ma li manteniamo)
  weather: z.object({
    bestMonthsHint: z.string(),
    temperatureHint: z.string(),
    rainHint: z.string(),
  }),
});

export type FastItinerary = z.infer<typeof FastItinerarySchema>;
