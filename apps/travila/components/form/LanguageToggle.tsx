import { View, Text, Pressable } from "react-native";

export default function LanguageToggle({
  label, value, onChange
}: {
  label: string;
  value: 'it' | 'en';
  onChange: (v: 'it' | 'en') => void;
}) {
  const base = "flex-1 rounded-2xl px-3 py-2 border border-black/10 items-center";
  const active = "bg-black/5";
  return (
    <View className="mb-3">
      <Text className="mb-1 font-medium">{label}</Text>
      <View className="flex-row gap-2">
        <Pressable
          className={`${base} ${value === 'it' ? active : ''}`}
          onPress={() => onChange('it')}
        >
          <Text>Italiano</Text>
        </Pressable>
        <Pressable
          className={`${base} ${value === 'en' ? active : ''}`}
          onPress={() => onChange('en')}
        >
          <Text>English</Text>
        </Pressable>
      </View>
    </View>
  );
}
