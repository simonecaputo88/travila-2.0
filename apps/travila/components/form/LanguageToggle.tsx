import { View, Text, Pressable } from "react-native";
import { theme } from "../../theme";

export default function LanguageToggle({
  label, value, onChange
}: {
  label: string;
  value: 'it' | 'en';
  onChange: (v: 'it' | 'en') => void;
}) {
  const pill = (active: boolean) => ({
    paddingHorizontal: theme.spacing(1.5),
    paddingVertical: theme.spacing(1),
    borderRadius: 999,
    backgroundColor: active ? theme.colors.blue : theme.colors.white,
    borderWidth: 1,
    borderColor: theme.colors.border,
  });

  return (
    <View style={{ marginBottom: theme.spacing(2) }}>
      <Text style={{ marginBottom: 6, fontWeight: "600", color: theme.colors.text }}>{label}</Text>
      <View style={{ flexDirection: "row", gap: theme.spacing(1) }}>
        <Pressable onPress={() => onChange('it')} style={pill(value === 'it')}>
          <Text style={{ color: value === 'it' ? theme.colors.white : theme.colors.text }}>Italiano</Text>
        </Pressable>
        <Pressable onPress={() => onChange('en')} style={pill(value === 'en')}>
          <Text style={{ color: value === 'en' ? theme.colors.white : theme.colors.text }}>English</Text>
        </Pressable>
      </View>
    </View>
  );
}
