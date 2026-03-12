import { Platform, StyleSheet } from "react-native";
import { colors } from "./colors";

export const getGlobalStyles = () =>
  StyleSheet.create({
    background: {
      flex: 1,
      width: "100%",
    },
    mainContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    iconTitleContainer: {
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      color: "#F1F5F9",
      fontWeight: "600",
      fontSize: 22,
      letterSpacing: 0.5,
    },
    menuOption: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: 20,
      borderRadius: 12,
      gap: 12,
      ...Platform.select({
        web: {
          transitionDuration: "150ms",
        },
      }),
    },
    inputGroup: {
      width: "100%",
      marginBottom: 18,
    },
    label: {
      fontSize: 13,
      marginBottom: 6,
      color: "#cbd5e1",
      fontWeight: "500",
    },
    input: {
      width: "100%",
      height: 48,
      borderRadius: 14,
      paddingHorizontal: 14,
      fontSize: 16,
      backgroundColor: "#0f172a",
      color: "#ffffff",
      borderWidth: 1,
      borderColor: "#334155",
      outlineStyle: "none" as any,
    },
    passwordContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#0f172a",
      borderRadius: 14,
      borderWidth: 1,
      borderColor: "#334155",
      height: 48,
    },
    passwordInput: {
      flex: 1,
      height: "100%",
      color: "#ffffff",
      fontSize: 16,
      outlineStyle: "none" as any,
      borderRadius: 14,
      paddingHorizontal: 14,
    },
    button: {
      flex: 1,
      backgroundColor: colors.lightBlue,
      height: 50,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    buttonText: {
      color: "#0f172a",
      fontSize: 15,
      fontWeight: "bold",
    },
    secondaryButton: {
      flex: 1,
      borderWidth: 1,
      borderColor: colors.lightBlue,
      height: 50,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    secondaryButtonText: {
      color: colors.lightBlue,
      fontSize: 15,
      fontWeight: "bold",
    },
    dangerButton: {
      backgroundColor: "#ef4444",
      height: 50,
      borderRadius: 18,
      justifyContent: "center",
      alignItems: "center",
      marginTop: 12,
    },
    dangerButtonText: {
      color: "#ffffff",
      fontSize: 15,
      fontWeight: "bold",
    },
    errorText: {
      color: "red",
      fontSize: 18,
      marginTop: 4,
    },
  });
