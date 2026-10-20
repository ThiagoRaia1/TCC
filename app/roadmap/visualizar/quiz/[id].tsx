import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  ClipboardList,
  Play,
  Trash2,
  Pencil,
  Save,
  Ban,
} from "lucide-react-native";
import { httpClient } from "../../../../services/httpclient";
import { IQuiz } from "../../../../interfaces/quiz/quiz";
import { useLoading } from "../../../../context/providers/loading";
import DeleteModal from "../components/DeleteModal";

export default function VisualizarQuiz() {
  const { id } = useLocalSearchParams();
  const { showLoading, hideLoading } = useLoading();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const [editando, setEditando] = useState(false);
  const [quizEditado, setQuizEditado] = useState<IQuiz | null>(null);
  const [salvando, setSalvando] = useState(false);

  const [quiz, setQuiz] = useState<IQuiz | null>(null);

  async function carregarQuiz() {
    try {
      showLoading();

      const resposta = await httpClient(`/quiz/${id}`, {
        method: "GET",
      });

      setQuiz(resposta);
      setQuizEditado(resposta);
    } catch (error: any) {
      console.error("Erro ao carregar quiz:", error.message);
    } finally {
      hideLoading();
    }
  }

  useEffect(() => {
    if (id) {
      carregarQuiz();
    }
  }, [id]);

  if (!quiz) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Não foi possível carregar o quiz.</Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={18} color="#fff" />

          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const quizExibido = editando && quizEditado ? quizEditado : quiz;

  const questoesOrdenadas = [...quizExibido.questoes].sort(
    (a, b) => a.ordem - b.ordem,
  );

  function alternarEdicao() {
    if (!editando) {
      setQuizEditado(JSON.parse(JSON.stringify(quiz)));
      setEditando(true);
      return;
    }

    salvarAlteracoes();
  }

  async function salvarAlteracoes() {
    if (!quizEditado) return;

    try {
      setSalvando(true);
      showLoading();

      const payload = {
        titulo: quizEditado.titulo,
        descricao: quizEditado.descricao,
        questoes: quizEditado.questoes.map((questao) => ({
          id: questao.id,
          enunciado: questao.enunciado,
          alternativas: questao.alternativas.map((alternativa) => ({
            id: alternativa.id,
            texto: alternativa.texto,
            correta: alternativa.correta,
            ordem: alternativa.ordem,
          })),
        })),
      };

      await httpClient(`/quiz/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setQuiz(quizEditado);
      setEditando(false);

      alert("Quiz atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao salvar quiz:", error);
      alert("Não foi possível salvar as alterações.");
    } finally {
      setSalvando(false);
      hideLoading();
    }
  }

  function atualizarQuiz(campo: "titulo" | "descricao", valor: string) {
    setQuizEditado((atual) => (atual ? { ...atual, [campo]: valor } : atual));
  }

  function atualizarQuestao(questaoId: number, valor: string) {
    setQuizEditado((atual) =>
      atual
        ? {
            ...atual,
            questoes: atual.questoes.map((questao) =>
              questao.id === questaoId
                ? { ...questao, enunciado: valor }
                : questao,
            ),
          }
        : atual,
    );
  }

  function atualizarAlternativa(
    questaoId: number,
    alternativaId: number,
    valor: string,
  ) {
    setQuizEditado((atual) =>
      atual
        ? {
            ...atual,
            questoes: atual.questoes.map((questao) =>
              questao.id === questaoId
                ? {
                    ...questao,
                    alternativas: questao.alternativas.map((alternativa) =>
                      alternativa.id === alternativaId
                        ? { ...alternativa, texto: valor }
                        : alternativa,
                    ),
                  }
                : questao,
            ),
          }
        : atual,
    );
  }

  function definirAlternativaCorreta(questaoId: number, alternativaId: number) {
    setQuizEditado((atual) =>
      atual
        ? {
            ...atual,
            questoes: atual.questoes.map((questao) =>
              questao.id === questaoId
                ? {
                    ...questao,
                    alternativas: questao.alternativas.map((alternativa) => ({
                      ...alternativa,
                      correta: alternativa.id === alternativaId,
                    })),
                  }
                : questao,
            ),
          }
        : atual,
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <Pressable
            style={styles.backIconButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={22} color="#1E3A8A" />
          </Pressable>

          <View style={styles.headerTitleContainer}>
            <View style={styles.iconContainer}>
              <ClipboardList size={25} color="#2563EB" />
            </View>

            <View style={styles.headerText}>
              {editando ? (
                <TextInput
                  style={[styles.headerTitle, styles.editableInput]}
                  value={quizEditado?.titulo ?? ""}
                  onChangeText={(valor) => atualizarQuiz("titulo", valor)}
                  placeholder="Título do quiz"
                />
              ) : (
                <Text style={styles.headerTitle}>{quiz.titulo}</Text>
              )}

              {/* DESCRIÇÃO */}
              {editando || quiz.descricao ? (
                <View style={styles.descriptionCard}>
                  {editando ? (
                    <TextInput
                      style={[styles.description, styles.editableInput]}
                      value={quizEditado?.descricao ?? ""}
                      onChangeText={(valor) =>
                        atualizarQuiz("descricao", valor)
                      }
                      placeholder="Descrição do quiz"
                      multiline
                    />
                  ) : (
                    <Text style={styles.description}>
                      {quizExibido.descricao}
                    </Text>
                  )}
                </View>
              ) : (
                <Text style={styles.description}>Sem descrição</Text>
              )}
            </View>
          </View>

          {/* ACTIONS */}
          <View style={styles.headerActions}>
            {/* INICIAR QUIZ */}
            <Pressable
              style={({ pressed }) => [
                styles.startQuizButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() =>
                router.push(`/roadmap/visualizar/quiz/responder/${id}`)
              }
            >
              <Play size={17} color="#FFFFFF" />
              <Text style={styles.startQuizButtonText}>Iniciar quiz</Text>
            </Pressable>

            {/* EDITAR QUIZ */}
            <Pressable
              style={[styles.editQuizButton, editando && styles.saveQuizButton]}
              onPress={alternarEdicao}
              disabled={salvando}
            >
              {editando ? (
                <Save size={18} color="#FFFFFF" />
              ) : (
                <Pencil size={18} color="#2563EB" />
              )}

              <Text
                style={[
                  styles.editQuizButtonText,
                  editando && styles.saveQuizButtonText,
                ]}
              >
                {salvando
                  ? "Salvando..."
                  : editando
                    ? "Salvar alterações"
                    : "Editar quiz"}
              </Text>
            </Pressable>

            {/* CANCELAR EDICAO */}
            {editando && (
              <Pressable
                style={[
                  styles.editQuizButton,
                  editando && styles.cancelEditQuizButton,
                ]}
                onPress={() => setEditando(false)}
              >
                <Ban size={18} color="#ffffff" />

                <Text
                  style={[
                    styles.editQuizButtonText,
                    editando && styles.cancelEditQuizButtonText,
                  ]}
                >
                  {"Cancelar alterações"}
                </Text>
              </Pressable>
            )}

            {/* DELETE QUIZ */}
            <Pressable
              style={({ pressed }) => [
                styles.deleteQuizButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => setDeleteModalVisible(true)}
            >
              <Trash2 size={18} color="#DC2626" />
              <Text style={styles.deleteQuizButtonText}>Excluir</Text>
            </Pressable>
          </View>
        </View>

        {/* QUESTÕES */}
        <View style={styles.questionsContainer}>
          {questoesOrdenadas.map((questao, index) => {
            const alternativasOrdenadas = [...questao.alternativas].sort(
              (a, b) => a.ordem - b.ordem,
            );

            return (
              <View key={questao.id} style={styles.questionCard}>
                <View style={styles.questionHeader}>
                  <View style={styles.questionNumber}>
                    <Text style={styles.questionNumberText}>{index + 1}</Text>
                  </View>

                  <Text style={styles.questionLabel}>Questão {index + 1}</Text>
                </View>

                {editando ? (
                  <TextInput
                    style={[styles.questionText, styles.editableInput]}
                    value={questao.enunciado}
                    onChangeText={(valor) =>
                      atualizarQuestao(questao.id, valor)
                    }
                    placeholder="Enunciado da questão"
                    multiline
                  />
                ) : (
                  <Text style={styles.questionText}>{questao.enunciado}</Text>
                )}

                <View style={styles.alternativesContainer}>
                  {alternativasOrdenadas.map(
                    (alternativa, alternativaIndex) => (
                      <View
                        key={alternativa.id}
                        style={styles.alternativeTextContainer}
                      >
                        <View key={alternativa.id} style={styles.alternative}>
                          <View style={styles.alternativeLetter}>
                            <Text style={styles.alternativeLetterText}>
                              {String.fromCharCode(65 + alternativaIndex)}
                            </Text>
                          </View>
                          {editando ? (
                            <TextInput
                              style={[
                                styles.alternativeText,
                                styles.editableInput,
                              ]}
                              value={alternativa.texto}
                              onChangeText={(valor) =>
                                atualizarAlternativa(
                                  questao.id,
                                  alternativa.id,
                                  valor,
                                )
                              }
                              placeholder="Texto da alternativa"
                              multiline
                            />
                          ) : (
                            <Text style={styles.alternativeText}>
                              {alternativa.texto}
                            </Text>
                          )}
                        </View>

                        {editando && (
                          <Pressable
                            style={styles.correctOptionButton}
                            onPress={() =>
                              definirAlternativaCorreta(
                                questao.id,
                                alternativa.id,
                              )
                            }
                          >
                            <Text
                              style={{
                                color: alternativa.correta
                                  ? "#15803D"
                                  : "#64748B",
                                fontWeight: "600",
                              }}
                            >
                              {alternativa.correta
                                ? "✓ Resposta correta"
                                : "Marcar como correta"}
                            </Text>
                          </Pressable>
                        )}
                      </View>
                    ),
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {deleteModalVisible && (
        <DeleteModal
          closeModal={() => setDeleteModalVisible(false)}
          quiz={quiz}
          tipoItem="quiz"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  content: {
    width: "100%",
    maxWidth: 1350,
    alignSelf: "center",
    padding: 32,
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F7FB",
    gap: 12,
  },

  loadingText: {
    fontSize: 15,
    color: "#64748B",
  },

  errorText: {
    fontSize: 17,
    color: "#475569",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  backIconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 2,
  },

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },

  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#172554",
  },

  headerSubtitle: {
    marginTop: 3,
    fontSize: 14,
    color: "#64748B",
  },

  descriptionCard: {},

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#475569",
  },

  questionsContainer: {
    gap: 20,
  },

  questionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 24,

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 3,
    },

    elevation: 2,
  },

  questionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },

  questionNumber: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
  },

  questionNumberText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  questionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#64748B",
  },

  questionText: {
    fontSize: 18,
    lineHeight: 27,
    fontWeight: "600",
    color: "#172033",
    marginBottom: 20,
  },

  alternativesContainer: {
    gap: 10,
  },

  alternative: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,

    flexDirection: "row",
    alignItems: "center",
  },

  alternativeLetter: {
    width: 34,
    height: 34,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  alternativeLetterText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  alternativeText: {
    flex: 1,
    fontSize: 15,
    lineHeight: 21,
    color: "#334155",
  },

  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#2563EB",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
  headerText: {
    flexShrink: 1,
  },

  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginLeft: "auto",
  },

  startQuizButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },

  startQuizButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  deleteQuizButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
  },

  deleteQuizButtonText: {
    color: "#DC2626",
    fontSize: 14,
    fontWeight: "600",
  },

  buttonPressed: {
    opacity: 0.7,
  },

  editQuizButton: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    backgroundColor: "#DBEAFE",
  },

  editQuizButtonText: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },

  saveQuizButton: {
    backgroundColor: "#16A34A",
  },

  saveQuizButtonText: {
    color: "#FFFFFF",
  },

  cancelEditQuizButton: {
    backgroundColor: "#818181",
  },

  cancelEditQuizButtonText: {
    color: "#FFFFFF",
  },

  editableInput: {
    borderWidth: 1,
    borderColor: "#93C5FD",
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#F8FAFC",
  },

  alternativeTextContainer: {
    flex: 1,
    gap: 8,
  },

  correctOptionButton: {
    alignSelf: "flex-start",
    paddingVertical: 6,
  },
});
