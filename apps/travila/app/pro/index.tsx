import { View, Text } from "react-native";
import { Card } from "../../components/ui/Card";
import { theme } from "../../theme";

export default function Pro() {
  return (
    <View style={{ flex: 1, paddingHorizontal: theme.spacing(2), paddingVertical: theme.spacing(3), gap: theme.spacing(2) }}>
      <Card>
        <Text style={{ fontSize: 20, fontWeight: "700", color: theme.colors.text }}>Pro</Text>
        <Text style={{ color: "#394046", marginTop: 6 }}>Pagina pro in preparazione.</Text>
      </Card>
    </View>
  );
}
