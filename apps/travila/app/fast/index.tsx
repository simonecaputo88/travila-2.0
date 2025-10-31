// apps/travila/app/fast/index.tsx
import { useState, useMemo } from "react";
import { View, Text, TextInput, Pressable, ScrollView, ActivityIndicator } from "react-native";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3333";

type LanguageCode = 'it' | 'en';
type FastItinerary = {
  schemaVersion: '1.0';
  locale: LanguageCode;
  city: string;
  country: string;
  days: number;
  summary: string;
  highlights: { title: string; description: string }[];
  typicalDishes: { name: string; description: string }[];
  weather: { bestMonthsHint: string; temperatureHint: string; rainHint: string };
  practicalTips: string[];
};

export default function FastBare() {
  // ✅ Valori iniziali utili al test
  const [city, setCity] = useState("Roma");
  const [days, setDays] = useState("3");
  const [locale, setLocale] = useState<LanguageCode>("it");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FastItinerary | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => city.trim().length >= 1 && Number(days) >= 1, [city, days]);

  async function onGenerate() {
    // ✅ Guardie lato client
    if (!valid) {
      setError("Inserisci una città e un numero di giorni valido (>=1).");
      return;
    }
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${API_BASE}/api/itineraries/fast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          locale,
          city: city.trim(),
          days: Number(days),
        }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json = (await res.json()) as FastItinerary;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  const btn = `rounded-2xl px-12 py-12 items-center justify-center ${valid ? "bg-blue-600" : "bg-blue-300"}`;
  const btnSm = "rounded-2xl px-3 py-2 items-center justify-center bg-blue-600";
  const btnGhost = "rounded-2xl px-3 py-2 items-center justify-center border border-black/10";
  const input = "rounded-2xl border border-black/10 bg-white px-3 py-2";

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
      <Text style={{ fontSize: 22, fontWeight: "700" }}>Itinerario Fast (bare)</Text>

      <View style={{ gap: 8 }}>
        <Text>Città</Text>
        <TextInput
          className={input}
          placeholder="Roma"
          value={city}
          onChangeText={setCity}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text>Giorni</Text>
        <TextInput
          className={input}
          placeholder="3"
          keyboardType="numeric"
          value={days}
          onChangeText={setDays}
        />
      </View>

      <View style={{ gap: 8 }}>
        <Text>Lingua</Text>
        <View style={{ flexDirection: "row", gap: 8 }}>
          <Pressable className={locale === "it" ? btnSm : btnGhost} onPress={() => setLocale("it")}>
            <Text style={{ color: locale === "it" ? "#fff" : "#000" }}>Italiano</Text>
          </Pressable>
          <Pressable className={locale === "en" ? btnSm : btnGhost} onPress={() => setLocale("en")}>
            <Text style={{ color: locale === "en" ? "#fff" : "#000" }}>English</Text>
          </Pressable>
        </View>
      </View>

      <Pressable className={btn} onPress={onGenerate} disabled={!valid || loading}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Genera Itinerario</Text>
      </Pressable>

      {loading && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <ActivityIndicator />
          <Text>Generazione in corso…</Text>
        </View>
      )}

      {error && <Text style={{ color: "#b91c1c" }}>{error}</Text>}

      {data && (
        <View style={{ gap: 8, padding: 12, borderRadius: 12, backgroundColor: "white" }}>
          <Text style={{ fontWeight: "700" }}>
            {data.city}, {data.country} • {data.days} giorni
          </Text>
          <Text style={{ opacity: 0.8 }}>{data.summary}</Text>

          <Text style={{ fontWeight: "700", marginTop: 8 }}>Highlights</Text>
          {data.highlights?.map((h, i) => (
            <View key={i} style={{ marginBottom: 6 }}>
              <Text style={{ fontWeight: "600" }}>{h.title}</Text>
              <Text style={{ opacity: 0.8 }}>{h.description}</Text>
            </View>
          ))}

          <Text style={{ fontWeight: "700", marginTop: 8 }}>Piatti tipici</Text>
          {data.typicalDishes?.map((d, i) => (
            <Text key={i} style={{ opacity: 0.8 }}>• {d.name}: {d.description}</Text>
          ))}

          <Text style={{ fontWeight: "700", marginTop: 8 }}>Meteo</Text>
          <Text style={{ opacity: 0.8 }}>• {data.weather?.bestMonthsHint}</Text>
          <Text style={{ opacity: 0.8 }}>• {data.weather?.temperatureHint}</Text>
          <Text style={{ opacity: 0.8 }}>• {data.weather?.rainHint}</Text>

          <Text style={{ fontWeight: "700", marginTop: 8 }}>Consigli</Text>
          {data.practicalTips?.map((p, i) => (
            <Text key={i} style={{ opacity: 0.8 }}>• {p}</Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
