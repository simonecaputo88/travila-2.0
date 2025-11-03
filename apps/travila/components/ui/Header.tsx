// apps/travila/components/ui/Header.tsx
import { View, Image, Text } from "react-native";
import { theme } from "../../theme";
import logo from "../../assets/logo.png";

export default function Header() {
  return (
    <View style={{
      paddingHorizontal: theme.spacing(2),
      paddingTop: theme.spacing(1),
      paddingBottom: theme.spacing(1.5),
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: theme.colors.bg,
    }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: theme.spacing(1) }}>
        <Image source={logo} style={{ width: 28, height: 28 }} />
        <Text style={{ fontSize: 18, fontWeight: "700", color: theme.colors.text }}>Travila</Text>
      </View>
      {/* spazio per azioni future */}
      <View />
    </View>
  );
}
