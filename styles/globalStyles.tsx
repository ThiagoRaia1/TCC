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
      width: "100%",
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
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 8,
      fontSize: 14,
      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
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
    confirmButton: {
      borderRadius: 10,
      backgroundColor: colors.lightBlue,
      alignItems: "center",
      justifyContent: "center",
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    confirmButtonText: {
      color: "white",
      fontWeight: 400,
      fontSize: 14,
      textAlign: "center",
    },
    secondaryButton: {
      borderRadius: 8,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: 20,
      paddingVertical: 8,
      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
    },
    secondaryButtonText: {
      color: "black",
      fontWeight: 600,
      fontSize: 14,
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
    actionButton: {
      backgroundColor: colors.green,
      height: 55,
      width: 55,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 10,
    },
    errorText: {
      color: "red",
      fontSize: 18,
      marginTop: 4,
    },
  });
