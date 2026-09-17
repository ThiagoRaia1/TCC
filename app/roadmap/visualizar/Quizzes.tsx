import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from "react-native";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Trophy,
} from "lucide-react-native";
import { colors } from "../../../styles/colors";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { IQuiz } from "../../../interfaces/quiz/quiz";
import { mockQuizzes } from "../../../data/mockQuizzes";

export default function Quizzes() {
  const globalStyles = getGlobalStyles();

  const visualizarQuiz = (quiz: IQuiz) => {
    alert(`Visualizar quiz: ${quiz.id}`);
    // router.push(`/quiz/${quiz.id}`);
  };

  return (
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
            <Text style={styles.resumoValor}>{mockQuizzes.length}</Text>
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
                mockQuizzes.filter((quiz) =>
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
            onPress={() => alert("Criar novo quiz")}
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
      {mockQuizzes.length > 0 ? (
        <View style={styles.grid}>
          {mockQuizzes.map((quiz) => (
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
                <Text style={styles.quizEtapa}>ETAPA {quiz.etapa}</Text>

                <Text style={styles.quizTitulo}>{quiz.titulo}</Text>

                <Text style={styles.quizDescricao} numberOfLines={2}>
                  {quiz.descricao}
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
                    style={styles.quizFooterButton}
                    onPress={() => {
                      alert(`Refazer teste ${quiz.id}`);
                    }}
                  >
                    <Text style={styles.visualizarText}>
                      Realizar novamente
                    </Text>
                  </Pressable>
                ) : (
                  <View />
                )}

                <Pressable
                  style={styles.quizFooterButton}
                  onPress={() => visualizarQuiz(quiz)}
                >
                  <Text style={styles.visualizarText}>
                    {quiz.tentativas?.length != 0
                      ? "Visualizar resultado"
                      : "Iniciar quiz"}
                  </Text>
                </Pressable>

                {/* <ChevronRight size={19} color={colors.darkBlue} /> */}
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
    </View>
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
  },

  quizFooterButton: {
    borderColor: colors.lightBlue,
    borderWidth: 1,
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
