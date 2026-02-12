import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import { getGlobalStyles } from "../globalStyles"
import { router } from "expo-router"

export default function LandingPage() {
    const globalStyles = getGlobalStyles()

    return (
        <View style={globalStyles.mainContainer}>
            <TouchableOpacity style={globalStyles.button} onPress={() => router.push("/login")}>
                <Text style={globalStyles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </View>
    )
}