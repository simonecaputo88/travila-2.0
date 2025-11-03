// apps/travila/theme.ts
export const theme = {
  colors: {
    bg: "#F7F9FB",
    text: "#1A1A1A",
    blue: "#2B91F0",
    blueLight: "#E8F3FF",
    orange: "#FF7A42",
    orangeLight: "#FFF2EB",
    gray: "#B0B8C1",
    success: "#3BCB8D",
    danger: "#E03E3E",
    white: "#FFFFFF",
    border: "rgba(0,0,0,0.06)",
  },
  radius: {
    lg: 16,
    xl: 20,
  },
  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowOffset: { width: 0, height: 6 },
      shadowRadius: 12,
      elevation: 3,
    },
  },
  spacing: (n: number) => n * 8,
};
