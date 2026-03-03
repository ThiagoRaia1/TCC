import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useState } from "react";
import { colors } from "../../colors";

export default function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.headerBar} />

        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Informe suas credenciais para continuar
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#9aa0a6"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={[styles.input, { flexDirection: "row" }]}>
            <TextInput
              style={{ flex: 1, outlineStyle: "none" as any }}
              secureTextEntry={isPasswordVisible}
              placeholder="Digite sua senha"
              placeholderTextColor="#9aa0a6"
            />
            <TouchableOpacity
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <AntDesign
                name={isPasswordVisible ? "eye" : "eye-invisible"}
                size={24}
                color="black"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.85}
          onPress={() =>
            router.push({
              pathname: "/main",
              params: { mainPage: "CriarRoadmap" },
            })
          }
        >
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#9aa0a6" }]}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: "/cadastro" })}
        >
          <Text style={styles.buttonText}>Cadastre-se</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>© 2026 Sistema Corporativo</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#eef1f4",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 460,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 36,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },

  headerBar: {
    width: 50,
    height: 4,
    backgroundColor: "#1f2937",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 25,
  },

  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 22,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#374151",
    fontWeight: "500",
  },
  input: {
    height: 46,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 14,
    fontSize: 14,
    backgroundColor: "#f9fafb",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    height: 48,
    backgroundColor: colors.black,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  footerText: {
    marginTop: 30,
    fontSize: 12,
    color: "#9ca3af",
    textAlign: "center",
  },
});
