// apps/travila/app/_layout.tsx
import { Stack } from "expo-router";
import { View, StatusBar, Platform } from "react-native";

export default function RootLayout() {
  return (
    <View
      // niente "100vh": RN vuole numeri o '%'
      style={{
        flex: 1,
        backgroundColor: "#fff",
        // su web permettiamo esplicitamente overflow visibile
        ...(Platform.OS === "web" ? { overflow: "visible" } : null),
      }}
    >
      <StatusBar barStyle="dark-content" />
      <Stack
        screenOptions={{
          headerShown: false,
          // "sceneStyle" NON esiste: usa solo contentStyle
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </View>
  );
}
