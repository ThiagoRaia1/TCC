import { useEffect, useRef, useState } from "react";

import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { X, ClipboardList, Plus, Check, Layers } from "lucide-react-native";
import { IEtapa } from "../../../../../interfaces/etapa";
import { router } from "expo-router";
import { criarQuiz } from "../../../../../services/quiz/quiz";
import { IQuiz } from "../../../../../interfaces/quiz/quiz";
import { useAuth } from "../../../../../context/auth";
import { IRoadmap } from "../../../../../interfaces/roadmap";

interface CriarQuizModalProps {
  visible: boolean;
  closeModal: () => void;
  roadmap: IRoadmap
}

export default function CriarQuizModal({
  visible,
  closeModal,
  roadmap
}: CriarQuizModalProps) {
  const { usuario } = useAuth();
  const translateY = useRef(new Animated.Value(700)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  // null = roadmap inteiro
  const [etapasSelecionadas, setEtapasSelecionadas] = useState<number[] | null>(
    null,
  );

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),

        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      translateY.setValue(700);
      opacity.setValue(0);
    }
  }, [visible]);

  const fecharModal = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: 700,
        duration: 250,
        useNativeDriver: true,
      }),

      Animated.timing(opacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(({ finished }) => {
      if (finished) {
        closeModal();
      }
    });
  };

  const selecionarRoadmapTodo = () => {
    setEtapasSelecionadas(null);
  };

  const alternarEtapa = (etapaId: number) => {
    setEtapasSelecionadas((atual) => {
      // Se estava selecionado "todo o roadmap",
      // começa uma nova seleção apenas com essa etapa.
      if (atual === null) {
        return [etapaId];
      }

      if (atual.includes(etapaId)) {
        return atual.filter((id) => id !== etapaId);
      }

      return [...atual, etapaId];
    });
  };

  const handleCriarQuiz = async () => {
    const tituloTratado = titulo.trim();
    const descricaoTratada = descricao.trim();

    if (!tituloTratado) {
      alert("Informe um título para o quiz.");
      return;
    }

    if (!usuario) return;

    // Nenhuma etapa selecionada = roadmap inteiro
    const quizDoRoadmap = etapasSelecionadas === null;

    // Etapas selecionadas, mas array vazio
    if (!quizDoRoadmap && etapasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma etapa ou escolha o roadmap inteiro.");
      return;
    }

    const resultado: IQuiz = await criarQuiz({
      titulo: tituloTratado,
      descricao: descricaoTratada,

      // Roadmap inteiro
      roadmapId: quizDoRoadmap ? roadmap.id : undefined,

      // Etapas específicas
      etapaIds: quizDoRoadmap ? undefined : etapasSelecionadas,

      usuarioId: usuario.sub,
    });

    setTitulo("");
    setDescricao("");
    setEtapasSelecionadas(null);

    router.push(`roadmap/visualizar/quiz/${resultado.id}`);

    fecharModal();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={fecharModal}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={fecharModal} />
        </Animated.View>

        <Animated.View
          style={[
            styles.modal,
            {
              transform: [{ translateY }],
            },
          ]}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.headerTituloContainer}>
              <View style={styles.iconContainer}>
                <ClipboardList size={22} color="#2563EB" />
              </View>

              <View>
                <Text style={styles.tituloModal}>Criar Quiz</Text>

                <Text style={styles.subtituloModal}>
                  Crie uma nova avaliação
                </Text>
              </View>
            </View>

            <Pressable onPress={fecharModal} style={styles.botaoFechar}>
              <X size={22} color="#64748B" />
            </Pressable>
          </View>

          {/* CONTEÚDO */}
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.conteudo}
            showsVerticalScrollIndicator={false}
          >
            {/* TÍTULO */}
            <View style={styles.campo}>
              <Text style={styles.label}>Título*</Text>

              <TextInput
                value={titulo}
                onChangeText={setTitulo}
                placeholder="Ex: Fundamentos do Xadrez"
                placeholderTextColor="#94A3B8"
                style={styles.input}
                maxLength={100}
              />
            </View>

            {/* DESCRIÇÃO */}
            <View style={styles.campo}>
              <Text style={styles.label}>Descrição</Text>

              <TextInput
                value={descricao}
                onChangeText={setDescricao}
                placeholder="Descreva o que será avaliado neste quiz..."
                placeholderTextColor="#94A3B8"
                style={[styles.input, styles.textarea]}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>

            {/* ETAPAS */}
            <View style={styles.campo}>
              <View style={styles.etapasTituloContainer}>
                <View>
                  <Text style={styles.label}>Conteúdo relacionado</Text>

                  <Text style={styles.helper}>
                    Escolha quais partes do roadmap serão avaliadas.
                  </Text>
                </View>

                <Layers size={19} color="#2563EB" />
              </View>

              {/* ROADMAP TODO */}
              <Pressable
                onPress={selecionarRoadmapTodo}
                style={[
                  styles.etapaOpcao,
                  etapasSelecionadas === null && styles.etapaSelecionada,
                ]}
              >
                <View
                  style={[
                    styles.etapaIcon,
                    etapasSelecionadas === null && styles.etapaIconSelecionada,
                  ]}
                >
                  <Layers
                    size={18}
                    color={etapasSelecionadas === null ? "#FFFFFF" : "#2563EB"}
                  />
                </View>

                <View style={styles.etapaTextoContainer}>
                  <Text
                    style={[
                      styles.etapaTitulo,
                      etapasSelecionadas === null &&
                        styles.etapaTituloSelecionado,
                    ]}
                  >
                    Todo o roadmap
                  </Text>

                  <Text style={styles.etapaDescricao}>
                    O quiz poderá abordar qualquer etapa.
                  </Text>
                </View>

                {etapasSelecionadas === null && (
                  <View style={styles.checkContainer}>
                    <Check size={17} color="#FFFFFF" />
                  </View>
                )}
              </Pressable>

              {/* ETAPAS */}
              {roadmap.etapas.map((etapa, index) => {
                const selecionada =
                  etapasSelecionadas?.includes(etapa.id) ?? false;

                return (
                  <Pressable
                    key={etapa.id}
                    onPress={() => alternarEtapa(etapa.id)}
                    style={[
                      styles.etapaOpcao,
                      selecionada && styles.etapaSelecionada,
                    ]}
                  >
                    <View
                      style={[
                        styles.numeroEtapa,
                        selecionada && styles.numeroEtapaSelecionada,
                      ]}
                    >
                      <Text
                        style={[
                          styles.numeroEtapaTexto,
                          selecionada && styles.numeroEtapaTextoSelecionado,
                        ]}
                      >
                        {index + 1}
                      </Text>
                    </View>

                    <View style={styles.etapaTextoContainer}>
                      <Text
                        style={[
                          styles.etapaTitulo,
                          selecionada && styles.etapaTituloSelecionado,
                        ]}
                      >
                        {etapa.titulo}
                      </Text>
                    </View>

                    {selecionada && (
                      <View style={styles.checkContainer}>
                        <Check size={17} color="#FFFFFF" />
                      </View>
                    )}
                  </Pressable>
                );
              })}

              {etapasSelecionadas !== null && etapasSelecionadas.length > 0 && (
                <Text style={styles.selecaoInfo}>
                  {etapasSelecionadas.length}{" "}
                  {etapasSelecionadas.length === 1
                    ? "etapa selecionada"
                    : "etapas selecionadas"}
                </Text>
              )}
            </View>
          </ScrollView>

          {/* FOOTER */}
          <View style={styles.footer}>
            <Pressable onPress={fecharModal} style={styles.botaoCancelar}>
              <Text style={styles.textoCancelar}>Cancelar</Text>
            </Pressable>

            <Pressable
              onPress={handleCriarQuiz}
              style={({ pressed }) => [
                styles.botaoCriar,
                pressed && styles.botaoPressionado,
              ]}
            >
              <Plus size={20} color="#FFFFFF" />

              <Text style={styles.textoCriar}>Criar Quiz</Text>
            </Pressable>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
  },

  modal: {
    width: "90%",
    maxWidth: 600,
    maxHeight: "90%",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },

  scroll: {
    width: "100%",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },

  headerTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  tituloModal: {
    fontSize: 21,
    fontWeight: "700",
    color: "#0F172A",
  },

  subtituloModal: {
    marginTop: 2,
    fontSize: 13,
    color: "#64748B",
  },

  botaoFechar: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  conteudo: {
    padding: 24,
    gap: 20,
  },

  campo: {
    gap: 8,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  input: {
    width: "100%",
    minHeight: 46,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    fontSize: 15,
    color: "#0F172A",
  },

  textarea: {
    minHeight: 100,
    paddingTop: 12,
  },

  helper: {
    marginTop: 3,
    fontSize: 12,
    color: "#64748B",
  },

  etapasTituloContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  etapaOpcao: {
    minHeight: 64,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,

    paddingHorizontal: 12,
    paddingVertical: 10,

    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,

    backgroundColor: "#FFFFFF",
  },

  etapaSelecionada: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  etapaIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#EFF6FF",
  },

  etapaIconSelecionada: {
    backgroundColor: "#2563EB",
  },

  numeroEtapa: {
    width: 38,
    height: 38,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#F1F5F9",
  },

  numeroEtapaSelecionada: {
    backgroundColor: "#2563EB",
  },

  numeroEtapaTexto: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  numeroEtapaTextoSelecionado: {
    color: "#FFFFFF",
  },

  etapaTextoContainer: {
    flex: 1,
  },

  etapaTitulo: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  etapaTituloSelecionado: {
    color: "#1D4ED8",
  },

  etapaDescricao: {
    marginTop: 2,
    fontSize: 12,
    color: "#64748B",
  },

  checkContainer: {
    width: 24,
    height: 24,
    borderRadius: 7,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: "#2563EB",
  },

  selecaoInfo: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "500",
    color: "#2563EB",
  },

  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,

    padding: 20,

    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },

  botaoCancelar: {
    minWidth: 100,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,

    alignItems: "center",
    justifyContent: "center",
  },

  textoCancelar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  botaoCriar: {
    minWidth: 130,
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 10,

    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,

    backgroundColor: "#2563EB",
  },

  botaoPressionado: {
    opacity: 0.8,
  },

  textoCriar: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
