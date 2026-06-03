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
import { criarConta } from "../../services/usuario";

export default function Login() {
  const { login, logout } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState<string>("");

  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(false);
  const [estaLogando, setEstaLogando] = useState<boolean>(true);

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const confirmarSenhaRef = useRef<TextInput>(null);

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

  const handleCriarConta = async () => {
    try {
      showLoading();

      if (!nome || !email || !senha || !senhaConfirmacao) {
        alert("Preencha todos os campos.");
        return;
      }

      if (senha !== senhaConfirmacao) {
        alert("As senhas não coincidem.");
        return;
      }

      const resultCriarConta = await criarConta({
        email,
        senha,
        nome,
      });

      const resultLogin = await login({ email, senha });

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
          <View>
            <Text style={styles.title}>
              {estaLogando ? "Bem-vindo de volta" : "Seja bem-vindo!"}
            </Text>
            <Text style={styles.subtitle}>
              {estaLogando
                ? "Realize o login para acessar seus Roadmaps"
                : "Cadastre-se e crie seu primeiro roadmap!"}
            </Text>
          </View>

          {!estaLogando && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Digite seu nome"
                placeholderTextColor="#94a3b8"
                onChangeText={(text) => setNome(text)}
                onSubmitEditing={() => senhaRef.current?.focus()}
              />
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              style={globalStyles.input}
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
                placeholderTextColor={colors.placeholderTextColor}
                onChangeText={(text) => setSenha(text)}
                onSubmitEditing={
                  estaLogando
                    ? handleLogin
                    : () => confirmarSenhaRef.current?.focus()
                }
              />
              <TouchableOpacity
                onPress={() => setIsSenhaVisible(!isSenhaVisible)}
              >
                <AntDesign
                  name={isSenhaVisible ? "eye-invisible" : "eye"}
                  size={24}
                  color={colors.lightBlue}
                />
              </TouchableOpacity>
            </View>
          </View>

          {!estaLogando && (
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={confirmarSenhaRef}
                  style={styles.passwordInput}
                  secureTextEntry={!isSenhaVisible}
                  placeholder="Confirme sua senha"
                  placeholderTextColor={colors.placeholderTextColor}
                  onChangeText={(text) => setSenhaConfirmacao(text)}
                  onSubmitEditing={handleLogin}
                />
              </View>
            </View>
          )}

          <View>
            <TouchableOpacity
              style={globalStyles.confirmButton}
              activeOpacity={0.85}
              onPress={estaLogando ? handleLogin : handleCriarConta}
            >
              <Text style={globalStyles.confirmButtonText}>
                {estaLogando ? "Entrar" : "Cadastrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={() => {
                setEstaLogando(!estaLogando);
              }}
            >
              <Text style={styles.cadastreText}>
                {estaLogando
                  ? "Não tem uma conta? Cadastre-se"
                  : "Já possui uma conta? Entre aqui"}
              </Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: "space-between",
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
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    gap: 12,
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
    marginTop: 24,
  },
});
