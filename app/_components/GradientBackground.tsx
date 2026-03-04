import { ReactNode } from "react";
import { StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface GradientScreenProps {
  children?: ReactNode;
  style?: ViewStyle; // opcional para customizar
}

export default function GradientScreen({
  children,
  style,
}: GradientScreenProps) {
  return (
    <LinearGradient
      colors={["#0f172a", "#1e293b"]}
      style={[styles.screen, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
});
