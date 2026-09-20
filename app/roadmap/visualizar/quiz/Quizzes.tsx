import { View, Text, StyleSheet, Pressable } from "react-native";
import {
  BookOpen,
  CheckCircle2,
  CircleHelp,
  Eye,
  Play,
  RotateCcw,
  Trophy,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { IQuiz } from "../../../../interfaces/quiz/quiz";
import { IRoadmap } from "../../../../interfaces/roadmap";
import { colors } from "../../../../styles/colors";
import CriarQuizModal from "../components/quiz/CriarQuizModal";
import { useLoading } from "../../../../context/providers/loading";
import { getAllQuizzes } from "../../../../services/quiz/quiz";
import { useAuth } from "../../../../context/auth";

interface QuizzesProps {
  roadmap: IRoadmap;
}

export default function Quizzes({ roadmap }: QuizzesProps) {
  const { showLoading, hideLoading } = useLoading();
  const { usuario } = useAuth();

  const [quizzes, setQuizzes] = useState<IQuiz[]>();
  const [modalCriarQuiz, setModalCriarQuiz] = useState(false);

  const getData = async () => {
    if (!usuario) return;
    const resultado: IQuiz[] = await getAllQuizzes(usuario.sub);

    setQuizzes(resultado);
    console.log(resultado);
  };

  useEffect(() => {
    try {
      showLoading();
      getData();
    } catch (erro: any) {
    } finally {
      hideLoading();
    }
  }, []);

  const visualizarQuiz = (quiz: IQuiz) => {
    alert(`Visualizar quiz: ${quiz.id}`);
    // router.push(`/quiz/${quiz.id}`);
  };

  return (
    quizzes && (
      <View style={styles.container}>
        {/* CABEÇALHO */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <CircleHelp size={25} color={colors.lightBlue} />
          </View>

          <View style={styles.headerContent}>
            <Text style={styles.titulo}>Quizzes e Avaliações</Text>

            <Text style={styles.descricao}>
              Teste seus conhecimentos e acompanhe seu desempenho ao longo do
              roadmap.
            </Text>
          </View>
        </View>

        {/* RESUMO */}
        <View style={styles.resumoContainer}>
          <View style={styles.resumoItem}>
            <View style={styles.resumoIcon}>
              <BookOpen size={20} color={colors.lightBlue} />
            </View>

            <View>
              <Text style={styles.resumoValor}>{quizzes.length}</Text>
              <Text style={styles.resumoLabel}>Quizzes disponíveis</Text>
            </View>
          </View>

          <View style={styles.resumoDivider} />

          <View style={styles.resumoItem}>
            <View style={styles.resumoIcon}>
              <CheckCircle2 size={20} color="#16a34a" />
            </View>

            <View>
              <Text style={styles.resumoValor}>
                {
                  quizzes.filter((quiz) =>
                    quiz.tentativas?.some((tentativa) => tentativa.concluido),
                  ).length
                }
              </Text>

              <Text style={styles.resumoLabel}>Concluídos</Text>
            </View>
          </View>

          <View style={styles.resumoDivider} />

          <View style={styles.resumoItem}>
            <View style={styles.resumoIcon}>
              <Trophy size={20} color="#ca8a04" />
            </View>

            <View>
              <Text style={styles.resumoValor}>Quizzes Concluídos</Text>

              <Text style={styles.resumoLabel}>Progresso médio</Text>
            </View>
          </View>
        </View>

        {/* TÍTULO DA LISTA */}
        <View style={styles.listaHeader}>
          <View>
            <Text style={styles.listaTitulo}>Seus quizzes</Text>
            <Text style={styles.listaDescricao}>
              Escolha um quiz para começar ou continuar seus estudos.
            </Text>
          </View>

          <View style={{ flexDirection: "row", gap: 8 }}>
            <Pressable
              style={styles.adicionarQuizButton}
              onPress={() => setModalCriarQuiz(true)}
            >
              <Text style={styles.adicionarQuizButtonText}>Criar quiz</Text>
            </Pressable>

            <Pressable
              style={styles.adicionarQuizButton}
              onPress={() => alert("Gerar novo quiz")}
            >
              <Text style={styles.adicionarQuizButtonText}>
                Gerar quiz com inteligência artificial
              </Text>
            </Pressable>
          </View>
        </View>

        {/* QUIZZES */}
        {quizzes.length > 0 ? (
          <View style={styles.grid}>
            {quizzes.map((quiz) => (
              <View key={quiz.id} style={styles.quizCard}>
                {/* TOPO DO CARD */}
                <View style={styles.quizCardHeader}>
                  <View style={styles.quizIcon}>
                    <CircleHelp size={22} color={colors.lightBlue} />
                  </View>

                  {quiz.tentativas?.length != 0 && (
                    <View style={styles.concluidoBadge}>
                      <CheckCircle2 size={14} color="#15803d" />
                      <Text style={styles.concluidoText}>Concluído</Text>
                    </View>
                  )}
                </View>

                {/* CONTEÚDO */}
                <View style={styles.quizContent}>
                  {quiz.etapas?.length ? (
                    <Text style={styles.quizEtapa}>
                      {quiz.etapas.length === 1
                        ? "QUIZ DE 1 ETAPA"
                        : `QUIZ DE ${quiz.etapas.length} ETAPAS`}
                    </Text>
                  ) : quiz.roadmap ? (
                    <Text style={styles.quizEtapa}>QUIZ DO ROADMAP</Text>
                  ) : null}

                  <Text style={styles.quizTitulo}>{quiz.titulo}</Text>

                  <Text style={styles.quizDescricao} numberOfLines={2}>
                    {quiz.descricao || "Sem descrição"}
                  </Text>
                </View>

                {/* INFORMAÇÕES */}
                <View style={styles.infoContainer}>
                  <View style={styles.infoItem}>
                    <CircleHelp size={15} color="#6b7280" />

                    <Text style={styles.infoText}>
                      {quiz.quantidadeQuestoes} questões
                    </Text>
                  </View>
                </View>

                {/* BOTÃO */}
                <View style={styles.quizFooter}>
                  {quiz.tentativas?.length != 0 ? (
                    <Pressable
                      style={({ pressed }) => [
                        styles.quizFooterButton,
                        styles.quizFooterButtonSecondary,
                        pressed && styles.quizFooterButtonPressed,
                      ]}
                      onPress={() => {
                        alert(`Refazer teste ${quiz.id}`);
                      }}
                    >
                      <RotateCcw
                        size={16}
                        color={colors.lightBlue}
                        style={{ marginTop: 2 }}
                      />

                      <Text style={styles.quizFooterButtonSecondaryText}>
                        Refazer
                      </Text>
                    </Pressable>
                  ) : (
                    <View style={{ flex: 1 }} />
                  )}

                  <Pressable
                    style={({ pressed }) => [
                      styles.quizFooterButton,
                      styles.quizFooterButtonPrimary,
                      pressed && styles.quizFooterButtonPressed,
                    ]}
                    onPress={() => visualizarQuiz(quiz)}
                  >
                    {quiz.tentativas?.length != 0 ? (
                      <Eye size={16} color="#fff" style={{ marginTop: 2 }} />
                    ) : (
                      <Play size={16} color="#fff" style={{ marginTop: 2 }} />
                    )}

                    <Text style={styles.quizFooterButtonPrimaryText}>
                      {quiz.tentativas?.length != 0
                        ? "Ver resultado"
                        : "Iniciar quiz"}
                    </Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        ) : (
          /* ESTADO VAZIO */
          <View style={styles.emptyContainer}>
            <CircleHelp size={42} color="#9ca3af" />

            <Text style={styles.emptyTitulo}>Nenhum quiz disponível</Text>

            <Text style={styles.emptyDescricao}>
              Ainda não existem quizzes disponíveis para este roadmap.
            </Text>
          </View>
        )}

        <CriarQuizModal
          visible={modalCriarQuiz}
          closeModal={() => setModalCriarQuiz(false)}
          roadmap={roadmap}
        />
      </View>
    )
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: "#e8eef7",
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
    gap: 4,
  },

  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111827",
  },

  descricao: {
    fontSize: 15,
    color: "#6b7280",
  },

  resumoContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  resumoItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 10,
  },

  resumoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#f3f6fa",
    alignItems: "center",
    justifyContent: "center",
  },

  resumoValor: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  resumoLabel: {
    fontSize: 13,
    color: "#6b7280",
  },

  resumoDivider: {
    width: 1,
    height: 42,
    backgroundColor: "#e5e7eb",
  },

  listaHeader: {
    marginTop: 4,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  listaTitulo: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  listaDescricao: {
    marginTop: 4,
    fontSize: 14,
    color: "#6b7280",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 45,
    paddingBottom: 40,
  },

  quizCard: {
    width: 414,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    justifyContent: "space-between",

    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.06)",
  },

  quizCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  quizIcon: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#e8eef7",
    alignItems: "center",
    justifyContent: "center",
  },

  concluidoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: "#dcfce7",
  },

  concluidoText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#15803d",
  },

  adicionarQuizButton: {
    alignSelf: "flex-end",
    backgroundColor: colors.lightBlue,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
    justifyContent: "center",
  },

  adicionarQuizButtonText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
  },

  quizContent: {
    flex: 1,
    marginTop: 18,
    gap: 7,
  },

  quizEtapa: {
    fontSize: 12,
    fontWeight: "600",
    color: colors.lightBlue,
    textTransform: "uppercase",
  },

  quizTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },

  quizDescricao: {
    fontSize: 14,
    lineHeight: 20,
    color: "#6b7280",
  },

  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
    marginTop: 18,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  infoText: {
    fontSize: 12,
    color: "#6b7280",
  },

  progressoContainer: {
    marginTop: 14,
    gap: 7,
  },

  progressoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  progressoLabel: {
    fontSize: 12,
    color: "#6b7280",
  },

  progressoValor: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
  },

  progressBarBackground: {
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
  },

  quizFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 8,
  },

  quizFooterButton: {
    minHeight: 40,
    paddingHorizontal: 14,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  quizFooterButtonSecondary: {
    flex: 1,
    backgroundColor: "#f3f6fa",
    borderWidth: 1,
    borderColor: "#dbe3ef",
  },

  quizFooterButtonPrimary: {
    flex: 1,
    backgroundColor: colors.lightBlue,
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },

  quizFooterButtonPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.98 }],
  },

  quizFooterButtonSecondaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.darkBlue,
  },

  quizFooterButtonPrimaryText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  visualizarText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.darkBlue,
  },

  emptyContainer: {
    minHeight: 300,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#374151",
  },

  emptyDescricao: {
    fontSize: 14,
    color: "#6b7280",
  },
});
