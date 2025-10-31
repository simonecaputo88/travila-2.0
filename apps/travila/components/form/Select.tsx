import { View, Text, Picker } from "react-native";

export default function Select({
  label, value, onChange, options
}: {
  label: string;
  value: string;
  onChange: (v: string)=>void;
  options: { label: string; value: string }[];
}) {
  return (
    <View className="mb-3">
      <Text className="mb-1 font-medium">{label}</Text>
      {/* @ts-ignore - web compat with RN Picker polyfill (Expo) */}
      <Picker selectedValue={value} onValueChange={onChange}>
        {options.map(o => <Picker.Item key={o.value} label={o.label} value={o.value} />)}
      </Picker>
    </View>
  );
}
