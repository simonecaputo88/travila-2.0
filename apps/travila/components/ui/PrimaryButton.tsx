// apps/travila/components/ui/PrimaryButton.tsx
import { Pressable, Text, PressableProps, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../theme";

type Props = Omit<PressableProps, "children" | "style"> & {
  title: string;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function PrimaryButton({
  title,
  loading,
  disabled,
  style: styleProp,
  ...rest
}: Props) {
  const baseStyle: ViewStyle = {
    height: 48,
    borderRadius: theme.radius.lg,
    backgroundColor: disabled || loading ? "#8ec5ff" : theme.colors.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: theme.spacing(2),
  };

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || loading}
      style={[baseStyle, styleProp]}
      {...rest}
    >
      <Text style={{ color: theme.colors.white, fontWeight: "600" }}>
        {loading ? "Caricamento…" : title}
      </Text>
    </Pressable>
  );
}
