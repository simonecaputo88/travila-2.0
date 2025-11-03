// apps/travila/components/ui/Card.tsx
import { View, ViewProps, StyleProp, ViewStyle } from "react-native";
import { theme } from "../../theme";

type CardProps = Omit<ViewProps, "style"> & {
  style?: StyleProp<ViewStyle>;
};

export function Card({ style, ...rest }: CardProps) {
  return (
    <View
      style={[
        {
          backgroundColor: theme.colors.white,
          borderRadius: theme.radius.xl,
          padding: theme.spacing(2),
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadow.card,
        },
        style,
      ]}
      {...rest}
    />
  );
}
