// apps/travila/app/_layout.tsx
import { Stack } from "expo-router";
import { View, StatusBar } from "react-native";
import { theme } from "../theme";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: theme.colors.bg },
          headerTitleStyle: { color: theme.colors.text, fontWeight: "700" },
          contentStyle: { backgroundColor: theme.colors.bg },
        }}
      />
    </View>
  );
}
