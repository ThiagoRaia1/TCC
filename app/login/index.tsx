import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import { router } from "expo-router";

export default function Login() {
  const globalStyles = getGlobalStyles();
  const styles = StyleSheet.create({
    loginContainer: {
      width: "30%",
      minWidth: 400,
      height: "70%",
      backgroundColor: "white",
      borderRadius: 20,
      justifyContent: "center",
      padding: 24,
      gap: 24,
      boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.4)",
    },
    labelInputContainer: {
      width: "100%",
      gap: 5,
    },
  });

  return (
    <View style={globalStyles.mainContainer}>
      <View style={styles.loginContainer}>
        <View style={[styles.labelInputContainer, { marginTop: "auto" }]}>
          <Text>Email</Text>
          <TextInput style={globalStyles.input} />
        </View>

        <View style={[styles.labelInputContainer, { marginBottom: -30 }]}>
          <Text>Senha</Text>
          <TextInput style={globalStyles.input} secureTextEntry />
        </View>

        <TouchableOpacity
          style={[globalStyles.button, { marginTop: "auto" }]}
          onPress={() =>
            router.push({
              pathname: "/main",
              params: { mainPage: "CriarRoadmap" },
            })
          }
        >
          <Text style={globalStyles.buttonText}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
