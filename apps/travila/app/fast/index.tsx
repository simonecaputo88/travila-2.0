// apps/travila/app/fast/index.tsx
import { useMemo, useState } from "react";
import { View, Text, TextInput, ScrollView, ActivityIndicator } from "react-native";
import { Card } from "../../components/ui/Card";
import { PrimaryButton } from "../../components/ui/PrimaryButton";
import { theme } from "../../theme";

const API_BASE = process.env.EXPO_PUBLIC_API_BASE_URL || "http://localhost:3333";
type LanguageCode = "it" | "en";

type MonthlyClimate = { month: string; tMinC: number; tMaxC: number; precipitationMm: number };
type CouplePlan = { day: number; morning: string; lunch: string; afternoon: string; dinner: string; night: string; notes?: string };

type FastV2 = {
  schemaVersion: "2.0";
  locale: LanguageCode;
  city: string;
  country: string;
  summary: string;
  highlights: { title: string; description: string; coords?: { lat: number; lon: number } | null; imageHint?: string }[];
  typicalDishes: { name: string; description: string }[];
  practicalTips: string[];
  monthlyClimate: MonthlyClimate[];
  currency: { name: string; code: string; symbol: string; fxHint?: string };
  entryRequirements: {
    passportRequired: boolean;
    visaRequired: boolean;
    eVisaAvailable?: boolean;
    stayWithoutVisaDays?: number;
    notes?: string;
    sources?: string[];
  };
  health: {
    vaccines?: { name: string; required: boolean; recommendation: string }[];
    travelAdvisories?: string[];
    sources?: string[];
  };
  officialSites?: { label: string; url: string }[];
  coupleItinerary: { days: number; plan: CouplePlan[] };
  recommendedDays: number;
  weather: { bestMonthsHint: string; temperatureHint: string; rainHint: string };
};

export default function FastV2Page() {
  const [city, setCity] = useState("Roma");
  const [days, setDays] = useState("3");
  const [locale, setLocale] = useState<LanguageCode>("it");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<FastV2 | null>(null);
  const [error, setError] = useState<string | null>(null);

  const valid = useMemo(() => city.trim().length >= 1 && Number(days) >= 1, [city, days]);

  async function onGenerate() {
    if (!valid) {
      setError("Inserisci una città e giorni (>=1).");
      return;
    }
    setLoading(true); setError(null); setData(null);
    try {
      const res = await fetch(`${API_BASE}/api/itineraries/fast`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, city: city.trim(), days: Number(days) }),
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`HTTP ${res.status}: ${txt}`);
      }
      const json = (await res.json()) as FastV2;
      setData(json);
    } catch (e: any) {
      setError(e?.message ?? "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: theme.spacing(2), gap: theme.spacing(2) }}>
      {/* Hero */}
      <Card>
        <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.text }}>Itinerario Fast</Text>
        <Text style={{ color: "#394046", marginTop: 6 }}>
          Genera un itinerario base con info essenziali sulla destinazione.
        </Text>
      </Card>

      {/* Form */}
      <Card>
        <View style={{ gap: theme.spacing(2) }}>
          <View>
            <Text style={{ color: "#394046", marginBottom: 6 }}>Città</Text>
            <TextInput
              placeholder="Roma"
              placeholderTextColor={theme.colors.gray}
              value={city}
              onChangeText={setCity}
              style={{
                backgroundColor: theme.colors.white,
                borderWidth: 1, borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
                paddingHorizontal: theme.spacing(2),
                paddingVertical: 12,
                color: theme.colors.text,
              }}
            />
          </View>

          <View>
            <Text style={{ color: "#394046", marginBottom: 6 }}>Giorni</Text>
            <TextInput
              placeholder="3"
              placeholderTextColor={theme.colors.gray}
              value={days}
              onChangeText={setDays}
              keyboardType="numeric"
              style={{
                backgroundColor: theme.colors.white,
                borderWidth: 1, borderColor: theme.colors.border,
                borderRadius: theme.radius.lg,
                paddingHorizontal: theme.spacing(2),
                paddingVertical: 12,
                color: theme.colors.text,
              }}
            />
          </View>

          <View>
            <Text style={{ color: "#394046", marginBottom: 6 }}>Lingua</Text>
            <View style={{ flexDirection: "row", gap: theme.spacing(1) }}>
              <View
                style={{
                  paddingHorizontal: theme.spacing(1.5),
                  paddingVertical: theme.spacing(1),
                  borderRadius: 999,
                  backgroundColor: locale === "it" ? theme.colors.blue : theme.colors.white,
                  borderWidth: 1, borderColor: theme.colors.border,
                }}
              >
                <Text
                  onPress={() => setLocale("it")}
                  style={{ color: locale === "it" ? theme.colors.white : theme.colors.text }}
                >
                  Italiano
                </Text>
              </View>

              <View
                style={{
                  paddingHorizontal: theme.spacing(1.5),
                  paddingVertical: theme.spacing(1),
                  borderRadius: 999,
                  backgroundColor: locale === "en" ? theme.colors.blue : theme.colors.white,
                  borderWidth: 1, borderColor: theme.colors.border,
                }}
              >
                <Text
                  onPress={() => setLocale("en")}
                  style={{ color: locale === "en" ? theme.colors.white : theme.colors.text }}
                >
                  English
                </Text>
              </View>
            </View>
          </View>

          <PrimaryButton title="Genera Itinerario" onPress={onGenerate} disabled={!valid || loading} />
          {error && <Text style={{ color: theme.colors.danger }}>{error}</Text>}
          {loading && (
            <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing(1) }}>
              <ActivityIndicator />
              <Text style={{ color: "#394046" }}>Caricamento…</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Risultato */}
      {data && (
        <Card>
          <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.text }}>
            {data.city}, {data.country} • consigliati {data.recommendedDays} giorni
          </Text>
          <Text style={{ color: "#394046", marginTop: 6 }}>{data.summary}</Text>

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>Highlights</Text>
          {data.highlights.map((h, i) => (
            <View key={i} style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "600", color: theme.colors.text }}>{h.title}</Text>
              <Text style={{ color: "#394046" }}>{h.description}</Text>
            </View>
          ))}

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>Clima mensile</Text>
          {data.monthlyClimate.map((m, i) => (
            <Text key={i} style={{ color: "#394046", marginTop: 4 }}>
              • {m.month}: {m.tMinC}–{m.tMaxC}°C, {m.precipitationMm} mm
            </Text>
          ))}

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>Valuta</Text>
          <Text style={{ color: "#394046" }}>
            {data.currency.name} ({data.currency.code}) {data.currency.symbol}
            {data.currency.fxHint ? ` — ${data.currency.fxHint}` : ""}
          </Text>

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>
            Ingresso (passaporto/visto)
          </Text>
          <Text style={{ color: "#394046" }}>
            Passaporto: {data.entryRequirements.passportRequired ? "obbligatorio" : "non richiesto"} • Visto:{" "}
            {data.entryRequirements.visaRequired ? "obbligatorio" : "non richiesto"}
            {data.entryRequirements.eVisaAvailable !== undefined ? ` • eVisa: ${data.entryRequirements.eVisaAvailable ? "disponibile" : "no"}` : ""}
            {data.entryRequirements.stayWithoutVisaDays ? ` • Soggiorno senza visto: ${data.entryRequirements.stayWithoutVisaDays}gg` : ""}
          </Text>
          {data.entryRequirements.notes ? <Text style={{ color: "#394046" }}>{data.entryRequirements.notes}</Text> : null}
          {data.entryRequirements.sources?.length ? (
            <View style={{ marginTop: 6 }}>
              {data.entryRequirements.sources.map((s, i) => (
                <Text key={i} style={{ color: "#394046" }}>• {s}</Text>
              ))}
            </View>
          ) : null}

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>
            Salute e vaccini
          </Text>
          {data.health?.vaccines?.length
            ? data.health.vaccines.map((v, i) => (
                <Text key={i} style={{ color: "#394046" }}>
                  • {v.name} — {v.required ? "richiesto" : "consigliato"}: {v.recommendation}
                </Text>
              ))
            : <Text style={{ color: "#394046" }}>—</Text>}
          {data.health?.travelAdvisories?.length
            ? data.health.travelAdvisories.map((t, i) => (
                <Text key={i} style={{ color: "#394046" }}>• {t}</Text>
              ))
            : null}
          {data.health?.sources?.length
            ? data.health.sources.map((s, i) => (
                <Text key={i} style={{ color: "#394046" }}>• {s}</Text>
              ))
            : null}

          {!!data.officialSites?.length && (
            <>
              <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>
                Siti ufficiali
              </Text>
              {data.officialSites.map((o, i) => (
                <Text key={i} style={{ color: "#394046" }}>• {o.label}: {o.url}</Text>
              ))}
            </>
          )}

          <Text style={{ marginTop: theme.spacing(2), fontWeight: "700", color: theme.colors.text }}>
            Itinerario di coppia ({data.coupleItinerary.days} giorni)
          </Text>
          {data.coupleItinerary.plan.map((d) => (
            <View key={d.day} style={{ marginTop: 8 }}>
              <Text style={{ fontWeight: "600", color: theme.colors.text }}>Giorno {d.day}</Text>
              <Text style={{ color: "#394046" }}>Mattina: {d.morning}</Text>
              <Text style={{ color: "#394046" }}>Pranzo: {d.lunch}</Text>
              <Text style={{ color: "#394046" }}>Pomeriggio: {d.afternoon}</Text>
              <Text style={{ color: "#394046" }}>Cena: {d.dinner}</Text>
              <Text style={{ color: "#394046" }}>Sera: {d.night}</Text>
              {d.notes ? <Text style={{ color: "#394046" }}>Note: {d.notes}</Text> : null}
            </View>
          ))}

          <Text style={{ marginTop: theme.spacing(2), fontSize: 12, color: "#6b7280" }}>
            Nota: visti, passaporti e vaccini possono cambiare. Verifica sempre sui siti ufficiali prima di viaggiare.
          </Text>
        </Card>
      )}
    </ScrollView>
  );
}
