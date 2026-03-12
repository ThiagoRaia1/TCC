import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GradientScreen from "../_components/GradientBackground";
import { getGlobalStyles } from "../../styles/globalStyles";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState, useRef } from "react";
import { useAuth } from "../../context/auth";
import { useLoading } from "../../context/providers/loading";
import { deletarConta, updateConta } from "../../services/usuario";
import { colors } from "../../styles/colors";

const styles = StyleSheet.create({
  card: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 28,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    alignItems: "center",
    marginBottom: 28,
  },
  subtitle: {
    color: "#94a3b8",
    marginTop: 4,
    fontSize: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputGroup: {
    width: "45%",
    marginBottom: 18,
  },
  disabledInput: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
    color: "#64748b",
  },
  disabledPasswordContainer: {
    backgroundColor: "#0f172a",
    borderColor: "#334155",
  },
});

export default function MeuPerfil() {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();
  const { login, logout, usuario } = useAuth();

  const [isSenhaVisible, setIsSenhaVisible] = useState<boolean>(false);

  const [form, setForm] = useState<{
    nome: string;
    email: string;
    senhaAtual: string;
    novaSenha: string;
    confirmarNovaSenha: string;
  }>({
    nome: usuario?.nome ?? " ",
    email: usuario?.email ?? " ",
    senhaAtual: "",
    novaSenha: "",
    confirmarNovaSenha: "",
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const emailRef = useRef<TextInput>(null);
  const senhaRef = useRef<TextInput>(null);
  const senhaConfirmacaoRef = useRef<TextInput>(null);
  const criarContaButtonRef = useRef<View>(null);

  const handleDeletarConta = async () => {
    try {
      showLoading();
      if (!usuario) return;
      const resultado = await deletarConta(usuario.sub);
      alert("Conta excluída com sucesso.");
      router.push("/");
    } catch (erro: any) {
      alert(erro);
    } finally {
      hideLoading();
    }
  };

  const [errors, setErrors] = useState<{
    nome?: string;
    email?: string;
    senhaAtual?: string;
    novaSenha?: string;
    confirmarNovaSenha?: string;
  }>({
    nome: " ",
    email: " ",
    senhaAtual: " ",
    novaSenha: " ",
    confirmarNovaSenha: " ",
  });

  const validarFormulario = async () => {
    const novosErros: typeof errors = {};

    if (!form.nome) novosErros.nome = "Nome é obrigatório.";

    if (!form.email.trim()) novosErros.email = "Email é obrigatório.";

    if (!form.senhaAtual.trim()) {
      novosErros.senhaAtual = "Insira a senha atual para alterar seus dados.";
    } else {
      try {
        await login({
          email: usuario?.email ?? "",
          senha: form.senhaAtual,
        });
      } catch (erro: any) {
        novosErros.senhaAtual = "Senha incorreta.";
      }
    }

    if (form.novaSenha.trim() !== form.confirmarNovaSenha.trim())
      novosErros.confirmarNovaSenha = "As senhas não coincidem.";

    setErrors(novosErros);

    return Object.keys(novosErros).length === 0;
  };

  const clearForm = () => {
    setForm({
      nome: usuario?.nome.trim() ?? "",
      email: usuario?.email ?? "",
      senhaAtual: "",
      novaSenha: "",
      confirmarNovaSenha: "",
    });
  };

  const clearErros = () => {
    setErrors({
      nome: " ",
      email: " ",
      senhaAtual: " ",
      novaSenha: " ",
      confirmarNovaSenha: " ",
    });
  };

  async function editarUsuario(form: {
    nome: string;
    email: string;
    senhaAtual: string;
    novaSenha?: string;
  }) {
    try {
      showLoading();
      if (!(await validarFormulario())) return;

      form.nome = form.nome.trim();

      if (usuario) await updateConta(form, usuario?.sub);

      await login({
        email: form.email,
        senha: form.novaSenha ? form.novaSenha : form.senhaAtual,
      });

      setForm((prev) => ({ ...prev, nome: form.nome, email: form.email }));

      alert("Editado");
      setIsEditing(false);
      clearForm()
      clearErros()
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  }

  return (
    <GradientScreen
      style={{ justifyContent: "flex-start", alignItems: "flex-start" }}
    >
      <View style={styles.card}>
        {/* HEADER */}
        <View style={styles.header}>
          <FontAwesome name="user" size={80} color={colors.lightBlue} />
          <Text style={styles.title}>Meu Perfil</Text>
          <Text style={styles.subtitle}>
            Gerencie suas informações da conta
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputGroup}>
            <Text style={globalStyles.label}>Nome</Text>
            <TextInput
              editable={isEditing}
              style={[globalStyles.input, !isEditing && styles.disabledInput]}
              placeholder="Digite seu nome"
              placeholderTextColor="#94a3b8"
              value={form.nome}
              onChangeText={(text) => {
                setForm((prev) => ({ ...prev, nome: text }));
                setErrors((prev) => ({ ...prev, nome: " " }));
              }}
              onSubmitEditing={() => emailRef.current?.focus()}
            />
            <Text style={globalStyles.errorText}>{errors.nome ?? " "}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={globalStyles.label}>Email</Text>
            <TextInput
              ref={emailRef}
              editable={isEditing}
              style={[globalStyles.input, !isEditing && styles.disabledInput]}
              placeholder="Digite seu email"
              placeholderTextColor="#94a3b8"
              value={form.email}
              onChangeText={(text) => {
                setForm((prev) => ({ ...prev, email: text.trim() }));
                setErrors((prev) => ({ ...prev, email: " " }));
              }}
              onSubmitEditing={() => senhaRef.current?.focus()}
            />
            <Text style={globalStyles.errorText}>{errors.email ?? " "}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={globalStyles.label}>Senha Atual</Text>
            <View style={globalStyles.passwordContainer}>
              <TextInput
                ref={senhaRef}
                editable={isEditing}
                style={globalStyles.passwordInput}
                secureTextEntry={!isSenhaVisible}
                placeholder={
                  isEditing
                    ? "Insira a senha atual para poder alterar seus dados"
                    : ""
                }
                placeholderTextColor="#94a3b8"
                value={form.senhaAtual}
                onChangeText={(text) => {
                  setForm((prev) => ({ ...prev, senhaAtual: text.trim() }));
                  setErrors((prev) => ({ ...prev, senhaAtual: " " }));
                }}
                onSubmitEditing={() => senhaConfirmacaoRef.current?.focus()}
              />
              <TouchableOpacity
                style={{ position: "absolute", right: 12 }}
                onPress={() => setIsSenhaVisible(!isSenhaVisible)}
              >
                <AntDesign
                  name={isSenhaVisible ? "eye" : "eye-invisible"}
                  size={24}
                  color={colors.lightBlue}
                />
              </TouchableOpacity>
            </View>
            <Text style={globalStyles.errorText}>
              {errors.senhaAtual ?? " "}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={globalStyles.label}>Nova senha</Text>
            <View style={globalStyles.passwordContainer}>
              <TextInput
                ref={senhaConfirmacaoRef}
                editable={isEditing}
                style={globalStyles.passwordInput}
                secureTextEntry={!isSenhaVisible}
                placeholder={isEditing ? "Digite sua nova senha" : ""}
                placeholderTextColor="#94a3b8"
                value={form.novaSenha}
                onChangeText={(text) => {
                  setForm((prev) => ({
                    ...prev,
                    novaSenha: text.trim(),
                  }));
                  setErrors((prev) => ({ ...prev, novaSenha: " " }));
                }}
                onSubmitEditing={() => criarContaButtonRef.current?.focus()}
              />
            </View>
            <Text style={globalStyles.errorText}>
              {errors.novaSenha ?? " "}
            </Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={globalStyles.label}>Confirmar nova senha</Text>
            <View style={globalStyles.passwordContainer}>
              <TextInput
                ref={senhaConfirmacaoRef}
                editable={isEditing}
                style={globalStyles.passwordInput}
                secureTextEntry={!isSenhaVisible}
                placeholder={isEditing ? "Confirme sua senha" : ""}
                placeholderTextColor="#94a3b8"
                value={form.confirmarNovaSenha}
                onChangeText={(text) => {
                  setForm((prev) => ({
                    ...prev,
                    confirmarNovaSenha: text.trim(),
                  }));
                  setErrors((prev) => ({
                    ...prev,
                    confirmarNovaSenha: undefined,
                  }));
                }}
                onSubmitEditing={() => criarContaButtonRef.current?.focus()}
              />
            </View>
            <Text style={globalStyles.errorText}>
              {errors.confirmarNovaSenha ?? " "}
            </Text>
          </View>
        </View>

        <View style={[styles.inputGroup, { alignSelf: "center" }]}>
          <View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
            <TouchableOpacity
              ref={criarContaButtonRef}
              style={[
                globalStyles.button,
                isEditing && { backgroundColor: colors.green },
                { flex: 1 },
              ]}
              activeOpacity={0.85}
              onPress={async () => {
                !isEditing && setIsEditing(!isEditing);
                if (isEditing) {
                  await editarUsuario(form);
                }
              }}
            >
              <Text
                style={[
                  globalStyles.buttonText,
                  isEditing && { color: "white" },
                ]}
              >
                {!isEditing ? "Editar dados" : "Salvar"}
              </Text>
            </TouchableOpacity>

            {isEditing && (
              <TouchableOpacity
                ref={criarContaButtonRef}
                style={[globalStyles.secondaryButton, { flex: 1 }]}
                activeOpacity={0.85}
                onPress={() => {
                  clearForm();
                  clearErros();

                  setIsEditing(false);
                }}
              >
                <Text
                  style={[
                    globalStyles.buttonText,
                    isEditing && { color: "white" },
                  ]}
                >
                  Cancelar
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={globalStyles.dangerButton}
            activeOpacity={0.85}
            onPress={handleDeletarConta}
          >
            <Text style={globalStyles.dangerButtonText}>Deletar conta</Text>
          </TouchableOpacity>
        </View>

        {/* <Text style={styles.footerText}>
          © 2026 AI Teacher — Todos os direitos reservados
        </Text> */}
      </View>
    </GradientScreen>
  );
}
