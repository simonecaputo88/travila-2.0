import { Link } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { cardClass, primaryBtn } from "../lib/theme";

export default function Home() {
  return (
    <View className="flex-1 px-4 py-6 gap-4">
      <View className={cardClass}>
        <Text className="text-2xl font-semibold mb-2">Benvenuto su Travila 2.0</Text>
        <Text className="opacity-70">Il tuo travel planner AI personalizzato per Web, iOS e Android.</Text>
      </View>

      <View className="flex-row gap-3">
        <Link href="/fast" asChild>
          <Pressable className={primaryBtn}>
            <Text className="text-white font-semibold">Itinerario Fast</Text>
          </Pressable>
        </Link>

        <Link href="/pro" asChild>
          <Pressable className="rounded-2xl px-4 py-3 border border-black/10 bg-white">
            <Text className="font-semibold">Itinerario PRO</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}
