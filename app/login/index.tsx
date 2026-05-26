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
import GradientScreen from "../_components/GradientBackground";
import { useAuth } from "../../context/auth";
import { useLoading } from "../../context/providers/loading";
import { colors } from "../../styles/colors";
import { getGlobalStyles } from "../../styles/globalStyles";
import Header from "../_components/Header";

export default function Login() {
  const { login, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();

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
    <>
      <Header />
      <View style={styles.container}>
        <TouchableOpacity
          style={{ position: "absolute", left: 30, top: 30 }}
          onPress={() => router.push("/")}
        >
          <FontAwesome6 name="circle-chevron-left" size={48} color="white" />
        </TouchableOpacity>
        <View style={styles.card}>
          <Text style={styles.title}>Bem-vindo de volta</Text>
          <Text style={styles.subtitle}>
            Realize o login para acessar seus Roadmaps
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
                onPress={() => setIsSenhaVisible(!isSenhaVisible)}
              >
                <AntDesign
                  name={isSenhaVisible ? "eye" : "eye-invisible"}
                  size={24}
                  color={colors.lightBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={globalStyles.button}
            activeOpacity={0.85}
            onPress={handleLogin}
          >
            <Text style={globalStyles.buttonText}>Entrar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: "/cadastrar" })}
          >
            <Text style={styles.cadastreText}>
              Não tem uma conta? Cadastre-se
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "100%",
    maxWidth: 450,
    borderRadius: 12,
    padding: 24,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
  },

  title: {
    fontSize: 28,
    fontWeight: 600,
    color: "black",
    textAlign: "left",
  },

  subtitle: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "left",
    marginTop: 8,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    color: "black",
    fontWeight: "500",
  },
  input: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    fontSize: 16,
    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 12
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    outlineStyle: "none" as any,
  },

  cadastreText: {
    color: colors.lightBlue,
    fontWeight: 600,
    textDecorationLine: "underline",
    textAlign: "center",
    marginTop: 24
  },
});
