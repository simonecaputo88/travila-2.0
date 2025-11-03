import { View, Text } from "react-native";
// Nota: se vuoi compat perfetta, valuta @react-native-picker/picker
// Per ora manteniamo il Picker RN (Expo polyfill) come nel tuo codice:
import { Picker } from "@react-native-picker/picker";
import { theme } from "../../theme";

export default function Select({
  label, value, onChange, options
}: {
  label: string;
  value: string;
  onChange: (v: string)=>void;
  options: { label: string; value: string }[];
}) {
  return (
    <View style={{ marginBottom: theme.spacing(2) }}>
      <Text style={{ marginBottom: 6, fontWeight: "600", color: theme.colors.text }}>{label}</Text>
      <View style={{
        backgroundColor: theme.colors.white,
        borderWidth: 1, borderColor: theme.colors.border,
        borderRadius: theme.radius.lg,
        overflow: "hidden",
      }}>
        <Picker selectedValue={value} onValueChange={onChange}>
          {options.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
        </Picker>
      </View>
    </View>
  );
}
