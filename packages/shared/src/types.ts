export type ItineraryMode = 'FAST' | 'PRO';

export type LanguageCode = 'it' | 'en';

export interface FastItinerary {
  schemaVersion: '1.0';
  locale: LanguageCode;
  city: string;
  country: string;
  days: number;
  summary: string; // 1-2 frasi
  highlights: Array<{
    title: string;
    description: string; // max 2 frasi
    coords?: { lat: number; lon: number } | null;
    imageHint?: string; // stringa breve per cercare immagini
  }>;
  typicalDishes: Array<{
    name: string;
    description: string;
  }>; // almeno 2
  weather: {
    bestMonthsHint: string;     // es. "Apr–Jun & Sep–Oct"
    temperatureHint: string;    // es. "Milde 12–22°C"
    rainHint: string;           // es. "Piogge leggere in primavera"
  };
  practicalTips: string[]; // 3–5 bullet
}

export type FastItineraryRequest = {
  locale: LanguageCode;
  city: string;
  days: number;
};
