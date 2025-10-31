import { View, Text, ViewProps } from "react-native";
export default function Card({ title, children, className }: ViewProps & { title?: string; className?: string }) {
  return (
    <View className={`rounded-2xl p-4 shadow-lg bg-white/90 ${className || ""}`}>
      {title ? <Text className="text-lg font-semibold mb-2">{title}</Text> : null}
      {children}
    </View>
  );
}
