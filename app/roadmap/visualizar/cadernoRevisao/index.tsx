import { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { BookOpen, CheckCircle2, CircleAlert } from "lucide-react-native";
import { useAuth } from "../../../../context/auth";
import { colors } from "../../../../styles/colors";
import { useRoadmap } from "../../../../context/providers/roadmap";
import { getAllErrosRoadmap } from "../../../../services/cadernoRevisao/cadernoRevisao";
import { useLoading } from "../../../../context/providers/loading";
import { ICadernoRevisao } from "../../../../interfaces/cadernoRevisao/cadernoRevisao";

export default function CadernoRevisao() {
  const { usuario } = useAuth();
  const { roadmapContext } = useRoadmap();
  const { showLoading, hideLoading } = useLoading();

  const [erros, setErros] = useState<ICadernoRevisao[]>([]);
  const [quizzesExpandidos, setQuizzesExpandidos] = useState<number[]>([]);

  const errosPorQuiz = useMemo(() => {
    const quizzes = new Map<
      number,
      {
        titulo: string;
        erros: {
          item: ICadernoRevisao;
          quantidade: number;
        }[];
      }
    >();

    erros.forEach((item) => {
      const quiz = item.tentativa.quiz;

      if (!quizzes.has(quiz.id)) {
        quizzes.set(quiz.id, {
          titulo: quiz.titulo,
          erros: [],
        });
      }

      const grupoQuiz = quizzes.get(quiz.id)!;

      // Procura a questão dentro deste quiz
      const questaoExistente = grupoQuiz.erros.find(
        (erro) => erro.item.questao.id === item.questao.id,
      );

      if (questaoExistente) {
        // A questão já existe: incrementa a quantidade de erros
        questaoExistente.quantidade++;
      } else {
        // Primeira ocorrência: cria um único card
        grupoQuiz.erros.push({
          item,
          quantidade: 1,
        });
      }
    });

    quizzes.forEach((quiz) => {
      quiz.erros.sort((a, b) => b.quantidade - a.quantidade);
    });

    return Array.from(quizzes.entries()).map(([id, quiz]) => ({
      id,
      ...quiz,
    }));
  }, [erros]);

  const carregarErros = async () => {
    if (!usuario?.sub || !roadmapContext) {
      setErros([]);
      return;
    }

    try {
      showLoading();
      const resultado = await getAllErrosRoadmap(
        usuario.sub,
        roadmapContext.id,
      );
      setErros(resultado);

      console.log(resultado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    carregarErros();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerIcon}>
          <BookOpen size={25} color={colors.lightBlue} />
        </View>

        <View style={styles.headerContent}>
          <Text style={styles.titulo}>Caderno de Revisão</Text>
          <Text style={styles.descricao}>
            Revise as questões que você errou nos quizzes deste roadmap.
          </Text>
        </View>
      </View>

      {erros.length === 0 ? (
        <View style={styles.estado}>
          <CheckCircle2 size={42} color="#16a34a" />

          <Text style={styles.estadoTitulo}>Nenhum erro por aqui!</Text>

          <Text style={styles.estadoTexto}>
            Quando você errar alguma questão nos quizzes deste roadmap, ela
            aparecerá aqui para revisão.
          </Text>
        </View>
      ) : (
        <View style={styles.lista}>
          {errosPorQuiz.map((quiz) => {
            const expandido = quizzesExpandidos.includes(quiz.id);
            const errosExibidos = expandido
              ? quiz.erros
              : quiz.erros.slice(0, 3);
            const possuiMaisErros = quiz.erros.length > 3;

            return (
              <View key={quiz.id} style={styles.grupoQuiz}>
                <View style={styles.grupoQuizHeader}>
                  <BookOpen size={19} color={colors.lightBlue} />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.grupoQuizTitulo}>{quiz.titulo}</Text>

                    <Text style={styles.grupoQuizDescricao}>
                      {quiz.erros.length === 1
                        ? "1 resposta incorreta"
                        : `${quiz.erros.length} respostas incorretas`}
                    </Text>
                  </View>
                </View>

                {errosExibidos.map(({ item, quantidade }, index) => {
                  const alternativaCorreta = item.questao.alternativas?.find(
                    (alternativa) => alternativa.correta,
                  );

                  return (
                    <View key={item.questao.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <View style={styles.numeroQuestao}>
                          <Text style={styles.numeroQuestaoTexto}>
                            Questão {index + 1}
                          </Text>
                        </View>

                        <View style={styles.erroBadge}>
                          <CircleAlert size={14} color="#b91c1c" />
                          <Text style={styles.erroBadgeTexto}>
                            Errada {quantidade}{" "}
                            {quantidade === 1 ? "vez" : "vezes"}
                          </Text>
                        </View>
                      </View>

                      <Text style={styles.enunciado}>
                        {item.questao.enunciado}
                      </Text>

                      <View style={styles.alternativaErrada}>
                        <Text style={styles.alternativaLabelErrada}>
                          Sua resposta
                        </Text>
                        <Text style={styles.alternativaTexto}>
                          {item.alternativa?.texto ??
                            "Alternativa não disponível"}
                        </Text>
                      </View>

                      <View style={styles.alternativaCorreta}>
                        <Text style={styles.alternativaLabelCorreta}>
                          Resposta correta
                        </Text>
                        <Text style={styles.alternativaTexto}>
                          {alternativaCorreta?.texto ??
                            "Resposta correta não disponível"}
                        </Text>
                      </View>
                    </View>
                  );
                })}

                {possuiMaisErros && (
                  <Pressable
                    style={styles.botaoExibirMais}
                    onPress={() => {
                      setQuizzesExpandidos((atuais) =>
                        expandido
                          ? atuais.filter((id) => id !== quiz.id)
                          : [...atuais, quiz.id],
                      );
                    }}
                  >
                    <Text style={styles.botaoExibirMaisTexto}>
                      {expandido ? "Exibir menos" : "Exibir mais"}
                    </Text>
                  </Pressable>
                )}
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
    paddingBottom: 30,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#eff6ff",
    justifyContent: "center",
    alignItems: "center",
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
    fontSize: 14,
    lineHeight: 21,
    color: "#6b7280",
  },
  resumo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#fee2e2",
    backgroundColor: "#fffafa",
  },
  resumoIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  resumoTexto: {
    gap: 2,
  },
  resumoValor: {
    fontSize: 25,
    fontWeight: "700",
    color: "#111827",
  },
  resumoLabel: {
    fontSize: 13,
    color: "#6b7280",
  },
  estado: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 32,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  estadoTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    textAlign: "center",
  },
  estadoTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: "#6b7280",
    textAlign: "center",
  },
  botaoTentarNovamente: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 10,
    backgroundColor: colors.lightBlue,
    marginTop: 4,
  },
  botaoTentarNovamenteTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  lista: {
    gap: 16,
  },
  card: {
    padding: 18,
    gap: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    backgroundColor: "#fff",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  numeroQuestao: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#eff6ff",
  },
  numeroQuestaoTexto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#1d4ed8",
  },
  erroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "#fee2e2",
  },
  erroBadgeTexto: {
    fontSize: 12,
    fontWeight: "600",
    color: "#b91c1c",
  },
  quizTitulo: {
    fontSize: 13,
    fontWeight: "600",
    color: "#6b7280",
  },
  enunciado: {
    fontSize: 17,
    fontWeight: "600",
    lineHeight: 25,
    color: "#111827",
  },
  alternativaErrada: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#fecaca",
    backgroundColor: "#fef2f2",
    gap: 6,
  },
  alternativaLabelErrada: {
    fontSize: 12,
    fontWeight: "700",
    color: "#b91c1c",
  },
  alternativaCorreta: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#bbf7d0",
    backgroundColor: "#f0fdf4",
    gap: 6,
  },
  alternativaLabelCorreta: {
    fontSize: 12,
    fontWeight: "700",
    color: "#15803d",
  },
  alternativaTexto: {
    fontSize: 14,
    lineHeight: 21,
    color: "#374151",
  },
  botaoAtualizar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
  },
  botaoAtualizarTexto: {
    color: colors.lightBlue,
    fontWeight: "600",
  },
  grupoQuiz: {
    gap: 12,
    marginBottom: 12,
  },
  grupoQuizHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
  },
  grupoQuizTitulo: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  grupoQuizDescricao: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 3,
  },
  botaoExibirMais: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightBlue,
    backgroundColor: "#eff6ff",
  },

  botaoExibirMaisTexto: {
    color: colors.lightBlue,
    fontSize: 14,
    fontWeight: "700",
  },
});
