import { z } from 'zod';

export const LanguageCode = z.union([z.literal('it'), z.literal('en')]);

export const FastItinerarySchema = z.object({
  schemaVersion: z.literal('1.0'),
  locale: LanguageCode,
  city: z.string().min(1),
  country: z.string().min(1),
  days: z.number().int().min(1).max(14),
  summary: z.string().min(10).max(400),
  highlights: z.array(z.object({
    title: z.string().min(1),
    description: z.string().min(5).max(400),
    coords: z.object({ lat: z.number(), lon: z.number() }).nullable().optional(),
    imageHint: z.string().max(120).optional(),
  })).min(3).max(12),
  typicalDishes: z.array(z.object({
    name: z.string().min(1),
    description: z.string().min(5).max(200),
  })).min(2).max(6),
  weather: z.object({
    bestMonthsHint: z.string().min(2).max(80),
    temperatureHint: z.string().min(2).max(80),
    rainHint: z.string().min(2).max(80),
  }),
  practicalTips: z.array(z.string().min(3).max(140)).min(3).max(6)
});

export type FastItinerary = z.infer<typeof FastItinerarySchema>;
