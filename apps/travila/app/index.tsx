// apps/travila/app/index.tsx
import { Link } from "expo-router";
import { View, Text } from "react-native";
import { Card } from "../components/ui/Card";
import { PrimaryButton } from "../components/ui/PrimaryButton";
import { theme } from "../theme";

export default function Home() {
  return (
    <View style={{ flex: 1, padding: theme.spacing(2), gap: theme.spacing(2) }}>
      <Card>
        <Text style={{ fontSize: 22, fontWeight: "700", color: theme.colors.text }}>Travila</Text>
        <Text style={{ color: "#394046", marginTop: 6 }}>
          Benvenuto! Questa è la home minimale. Clicca per generare un Itinerario Fast.
        </Text>
        <Link href="/fast" asChild>
          <PrimaryButton title="Vai a Itinerario Fast" style={{ marginTop: theme.spacing(2) }} />
        </Link>
      </Card>
    </View>
  );
}
