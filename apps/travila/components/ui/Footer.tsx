import { View, Text } from "react-native";
import { theme } from "../../theme";

export default function Footer() {
  return (
    <View style={{ paddingHorizontal: theme.spacing(2), paddingVertical: theme.spacing(2), opacity: 0.7 }}>
      <Text style={{ color: "#394046" }}>© {new Date().getFullYear()} Travila</Text>
    </View>
  );
}
