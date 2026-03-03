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
    },
    input: {
      borderWidth: 1,
      borderRadius: 5,
      height: 30,
      padding: 10,
    },
    button: {
      height: 30,
      backgroundColor: colors.lightBlue,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 20,
      width: "100%",
      maxWidth: 150,
      alignSelf: "center",
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: 600,
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
  });
