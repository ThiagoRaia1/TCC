import React, { useRef, useState } from "react";
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
import { useLoading } from "../../context/providers/loading";
import { criarConta } from "../../services/usuario";
import { useAuth } from "../../context/auth";
import { getGlobalStyles } from "../../styles/globalStyles";

export default function cadastrar() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();
  const { login } = useAuth();

  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(false);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [senhaConfirmacao, setSenhaConfirmacao] = useState<string>("");

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const senhaConfirmacaoRef = useRef<TextInput>(null);
  const criarContaButtonRef = useRef<View>(null);

  const handleCriarConta = async () => {
    try {
      showLoading();

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
          Aprimore seu aprendizado criando uma conta!
        </Text>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Nome</Text>
          <TextInput
            style={globalStyles.input}
            placeholder="Digite seu nome"
            placeholderTextColor="#94a3b8"
            onChangeText={(text) => setNome(text.trim())}
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Email</Text>
          <TextInput
            ref={emailRef}
            style={globalStyles.input}
            placeholder="Digite seu email"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={(text) => setEmail(text.trim().toLocaleLowerCase())}
            onSubmitEditing={() => senhaRef.current?.focus()}
          />
        </View>

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Senha</Text>
          <View style={globalStyles.passwordContainer}>
            <TextInput
              ref={senhaRef}
              style={globalStyles.passwordInput}
              secureTextEntry={!isSenhaVisible}
              placeholder="Digite sua senha"
              placeholderTextColor="#94a3b8"
              value={senha}
              onChangeText={(text) => setSenha(text.trim())}
              onSubmitEditing={() => senhaConfirmacaoRef.current?.focus()}
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

        <View style={globalStyles.inputGroup}>
          <Text style={globalStyles.label}>Confirmar senha</Text>
          <View style={globalStyles.passwordContainer}>
            <TextInput
              ref={senhaConfirmacaoRef}
              style={globalStyles.passwordInput}
              secureTextEntry={!isSenhaVisible}
              placeholder="Confirme sua senha"
              placeholderTextColor="#94a3b8"
              value={senhaConfirmacao}
              onChangeText={(text) => setSenhaConfirmacao(text)}
              onSubmitEditing={() => criarContaButtonRef.current?.focus()}
            />
          </View>
        </View>

        <TouchableOpacity
          ref={criarContaButtonRef}
          style={globalStyles.button}
          activeOpacity={0.85}
          onPress={handleCriarConta}
        >
          <Text style={globalStyles.buttonText}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={globalStyles.secondaryButton}
          activeOpacity={0.85}
          onPress={() => router.push({ pathname: "/login" })}
        >
          <Text style={globalStyles.secondaryButtonText}>
            Já possui uma conta? Clique aqui
          </Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          © 2026 AI Teacher — Todos os direitos reservados
        </Text>
      </View>
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
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
  footerText: {
    marginTop: 24,
    fontSize: 11,
    color: "#64748b",
    textAlign: "center",
  },
});
