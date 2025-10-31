// apps/travila/app/_layout.tsx
import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View } from "react-native";

// Se avevi import di i18n/provider lasciali pure, ma non sono necessari per questo test
// import i18n from "../lib/i18n";
// import { I18nextProvider } from "react-i18next";

export default function RootLayout() {
  return (
    // <I18nextProvider i18n={i18n}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </SafeAreaView>
    // </I18nextProvider>
  );
}
