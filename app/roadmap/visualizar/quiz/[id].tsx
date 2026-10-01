import { useEffect, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import {
  ArrowLeft,
  ClipboardList,
} from "lucide-react-native";
import { httpClient } from "../../../../services/httpclient";
import { IQuiz } from "../../../../interfaces/quiz/quiz";
import { useLoading } from "../../../../context/providers/loading";

export default function VisualizarQuiz() {
  const { id } = useLocalSearchParams();
  const { showLoading, hideLoading } = useLoading();

  const [quiz, setQuiz] = useState<IQuiz | null>(null);

  async function carregarQuiz() {
    try {
      showLoading();

      const response = await httpClient(`/quiz/${id}`, {
        method: "GET",
      });

      setQuiz(response);
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);
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

  const questoesOrdenadas = [...quiz.questoes].sort(
    (a, b) => a.ordem - b.ordem,
  );

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

            <View>
              <Text style={styles.headerTitle}>{quiz.titulo}</Text>

              <Text style={styles.headerSubtitle}>
                {quiz.quantidadeQuestoes} questões
              </Text>
            </View>
          </View>
        </View>

        {/* DESCRIÇÃO */}
        {quiz.descricao ? (
          <View style={styles.descriptionCard}>
            <Text style={styles.description}>{quiz.descricao}</Text>
          </View>
        ) : null}

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

                <Text style={styles.questionText}>{questao.enunciado}</Text>

                <View style={styles.alternativesContainer}>
                  {alternativasOrdenadas.map(
                    (alternativa, alternativaIndex) => (
                      <View key={alternativa.id} style={styles.alternative}>
                        <View style={styles.alternativeLetter}>
                          <Text style={styles.alternativeLetterText}>
                            {String.fromCharCode(65 + alternativaIndex)}
                          </Text>
                        </View>

                        <Text style={styles.alternativeText}>
                          {alternativa.texto}
                        </Text>

                        {/* {alternativa.correta && (
                          <CheckCircle2 size={20} color="#16A34A" />
                        )} */}
                      </View>
                    ),
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
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

  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,

    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 2,
    },

    elevation: 1,
  },

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
});
