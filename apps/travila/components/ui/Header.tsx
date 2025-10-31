// apps/travila/components/ui/Header.tsx
import { View, Image, Text } from "react-native";
import logo from "../../assets/logo.png";

export default function Header(){
  return (
    <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        <Image source={logo} style={{ width: 28, height: 28 }} />
        <Text className="text-xl font-semibold">Travila</Text>
      </View>
    </View>
  );
}
