import { TextInput, View, Text } from "react-native";

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
    <View className="mb-3">
      <Text className="mb-1 font-medium">{label}</Text>
      <TextInput
        className="rounded-2xl border border-black/10 bg-white px-3 py-2"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder}
      />
    </View>
  );
}
