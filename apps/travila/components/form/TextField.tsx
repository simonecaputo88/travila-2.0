import { TextInput, View, Text } from "react-native";
import { theme } from "../../theme";

export default function TextField({
  label, value, onChangeText, keyboardType = 'default', placeholder
}: {
  label: string;
  value: string;
  onChangeText: (t: string)=>void;
  keyboardType?: 'default' | 'numeric';
  placeholder?: string;
}) {
  return (
    <View style={{ marginBottom: theme.spacing(2) }}>
      <Text style={{ marginBottom: 6, fontWeight: "600", color: theme.colors.text }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.gray}
        style={{
          backgroundColor: theme.colors.white,
          borderWidth: 1, borderColor: theme.colors.border,
          borderRadius: theme.radius.lg,
          paddingHorizontal: theme.spacing(2),
          paddingVertical: 12,
          color: theme.colors.text,
        }}
      />
    </View>
  );
}
