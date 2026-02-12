import { StyleSheet } from "react-native"

export const getGlobalStyles = () =>
    StyleSheet.create({
        mainContainer: {
            flex: 1,
            width: "100%",
            alignItems: "center",
            justifyContent: "center"
        }
    })
