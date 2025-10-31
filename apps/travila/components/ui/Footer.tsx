import { View, Text } from "react-native";
export default function Footer(){
  return (
    <View className="px-4 py-4 opacity-70"><Text>© {new Date().getFullYear()} Travila</Text></View>
  );
}
