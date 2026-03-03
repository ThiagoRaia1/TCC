import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { AntDesign, FontAwesome6 } from "@expo/vector-icons";
import { pageNames } from "../../utils/pageNames";
import { GradientScreen } from "../_components/GradientBackground";
import { useAuth } from "../../context/auth";
import { useLoading } from "../../context/providers/loading";

export default function Login() {
  const { login, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(false);

  const senhaRef = useRef<TextInput>(null);

  useEffect(() => {
    logout();
  }, []);

  const handleLogin = async () => {
    try {
      showLoading();

      const usuarioLogado = await login({ email, senha });

      router.push({
        pathname: "/main",
        params: {
          pageName: pageNames.roadmap.main,
          subPage: pageNames.roadmap.criarRoadmap,
        },
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <GradientScreen>
      <TouchableOpacity
        style={{ position: "absolute", left: 30, top: 30 }}
        onPress={() => router.push("/")}
      >
        <FontAwesome6 name="circle-chevron-left" size={48} color="white" />
      </TouchableOpacity>
      <View style={styles.card}>
        <Text style={styles.title}>AI Teacher</Text>
        <Text style={styles.subtitle}>
          Entre para continuar sua jornada de aprendizado
        </Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#94a3b8"
            onChangeText={(text) => setEmail(text)}
            onSubmitEditing={() => senhaRef.current?.focus()}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              ref={senhaRef}
              style={styles.passwordInput}
              secureTextEntry={!isSenhaVisible}
              placeholder="Digite sua senha"
              placeholderTextColor="#94a3b8"
              onChangeText={(text) => setSenha(text)}
              onSubmitEditing={handleLogin}
            />
            <TouchableOpacity
              style={{ position: "absolute", right: 12 }}
              onPress={() => setIsSenhaVisible(!isSenhaVisible)}
            >
              <AntDesign
                name={isSenhaVisible ? "eye" : "eye-invisible"}
                size={24}
                color="#38bdf8"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.85}
          onPress={handleLogin}
        >
          <Text style={styles.primaryButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: "/cadastrar" })}
        >
          <Text style={styles.secondaryButtonText}>Criar Conta</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          © 2026 AI Teacher — Todos os direitos reservados
        </Text>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    color: "#cbd5e1",
    fontWeight: "500",
  },
  input: {
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

  primaryButton: {
    backgroundColor: "#38bdf8",
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  primaryButtonText: {
    color: "#0f172a",
    fontSize: 15,
    fontWeight: "bold",
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: "#38bdf8",
    height: 50,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },

  secondaryButtonText: {
    color: "#38bdf8",
    fontSize: 15,
    fontWeight: "bold",
  },

  footerText: {
    marginTop: 24,
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
});
