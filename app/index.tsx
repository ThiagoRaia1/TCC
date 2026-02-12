import { StyleSheet, TextInput, View, Text, TouchableOpacity } from "react-native"
import { getGlobalStyles } from "../globalStyles"

export default function LandingPage() {
    const globalStyles = getGlobalStyles()
    const styles = StyleSheet.create({
        loginContainer: {
            width: "30%",
            height: "70%",
            backgroundColor: "white",
            borderRadius: 20,
            justifyContent: "center",
            padding: 24,
            gap: 24,
            boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)"
        },
        labelInputContainer: {
            width: "100%",
            gap: 5
        },
        input: {
            borderWidth: 1,
            borderRadius: 5,
            height: 30,
            padding: 5
        },
        button: {
            marginTop: "auto",
            height: 30,
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 20,
            width: "100%",
            maxWidth: 200,
            alignSelf: "center"
        },
        buttonText: {
            color: "white",
            fontSize: 16,
            fontWeight: 600
        }
    })

    return (
        <View style={globalStyles.mainContainer}>
            <View style={styles.loginContainer}>
                <View style={[styles.labelInputContainer, { marginTop: "auto" }]}>
                    <Text>Email</Text>
                    <TextInput style={styles.input} />
                </View>

                <View style={[styles.labelInputContainer, {marginBottom: -30}]}>
                    <Text>Senha</Text>
                    <TextInput style={styles.input} secureTextEntry />
                </View>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Entrar</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}