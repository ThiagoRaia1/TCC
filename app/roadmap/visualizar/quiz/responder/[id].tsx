import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { IQuiz } from "../../../../../interfaces/quiz/quiz";
import { httpClient } from "../../../../../services/httpclient";

export default function ResponderQuiz() {
  const { id } = useLocalSearchParams();

  const [quiz, setQuiz] = useState<IQuiz | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [finalizando, setFinalizando] = useState(false);

  const [questaoAtual, setQuestaoAtual] = useState(0);

  /**
   * Guarda:
   *
   * {
   *   [idDaQuestao]: idDaAlternativa
   * }
   */
  const [respostas, setRespostas] = useState<Record<number, number>>({});

  useEffect(() => {
    carregarQuiz();
  }, [id]);

  async function carregarQuiz() {
    try {
      setCarregando(true);

      const resultado = await httpClient(`/quiz/${id}`, {
        method: "GET",
      });

      setQuiz(resultado);
    } catch (error) {
      console.error("Erro ao carregar quiz:", error);

      Alert.alert("Erro", "Não foi possível carregar o quiz.", [
        {
          text: "Voltar",
          onPress: () => router.back(),
        },
      ]);
    } finally {
      setCarregando(false);
    }
  }

  const questoes = useMemo(() => {
    if (!quiz?.questoes) {
      return [];
    }

    return [...quiz.questoes].sort((a, b) => a.ordem - b.ordem);
  }, [quiz]);

  const questao = questoes[questaoAtual];

  const alternativaSelecionada = questao ? respostas[questao.id] : undefined;

  const primeiraQuestao = questaoAtual === 0;
  const ultimaQuestao = questaoAtual === questoes.length - 1;

  const quantidadeRespondida = Object.keys(respostas).length;

  function selecionarAlternativa(alternativaId: number) {
    if (!questao) return;

    setRespostas((anterior) => ({
      ...anterior,
      [questao.id]: alternativaId,
    }));
  }

  function proximaQuestao() {
    if (!questao) return;

    if (alternativaSelecionada === undefined) {
      Alert.alert(
        "Questão não respondida",
        "Selecione uma alternativa antes de continuar.",
      );

      return;
    }

    if (!ultimaQuestao) {
      setQuestaoAtual((anterior) => anterior + 1);
    }
  }

  function questaoAnterior() {
    if (!primeiraQuestao) {
      setQuestaoAtual((anterior) => anterior - 1);
    }
  }

  async function confirmarFinalizacao() {
    if (quantidadeRespondida < questoes.length) {
      alert(
        `Você respondeu ${quantidadeRespondida} de ${questoes.length} questões. Responda todas antes de finalizar.`,
      );

      return;
    }

    await finalizarQuiz();
  }

  async function finalizarQuiz() {
    if (!quiz) return;

    try {
      setFinalizando(true);

      const respostasFormatadas = questoes.map((questao) => ({
        questaoId: questao.id,
        alternativaId: respostas[questao.id],
      }));

      /**
       * Endpoint esperado:
       *
       * POST /quiz/:id/finalizar
       *
       * Body:
       * {
       *   respostas: [
       *     {
       *       questaoId: 1,
       *       alternativaId: 4
       *     }
       *   ]
       * }
       */

      const resultado = await httpClient(`/quiz/${quiz.id}/finalizar`, {
        method: "POST",
        body: JSON.stringify({
          respostas: respostasFormatadas,
        }),
      });

      /**
       * Ajuste a rota conforme a sua tela
       * de resultado.
       */
      router.replace({
        pathname: "/roadmap/visualizar/quiz/resultado/[id]",
        params: {
          id: String(resultado.id),
        },
      });
    } catch (error) {
      console.error("Erro ao finalizar quiz:", error);

      Alert.alert(
        "Erro",
        "Não foi possível finalizar o quiz. Tente novamente.",
      );
    } finally {
      setFinalizando(false);
    }
  }

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Carregando quiz...</Text>
      </View>
    );
  }

  if (!quiz || questoes.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.emptyTitle}>Quiz sem questões</Text>

        <Text style={styles.emptyText}>
          Este quiz não possui questões disponíveis.
        </Text>

        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const progresso = ((questaoAtual + 1) / questoes.length) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.voltar}>
            <Text style={styles.voltarText}>← Voltar</Text>
          </Pressable>

          <Text style={styles.titulo}>{quiz.titulo}</Text>

          {!!quiz.descricao && (
            <Text style={styles.descricao}>{quiz.descricao}</Text>
          )}
        </View>

        {/* PROGRESSO */}

        <View style={styles.progressoContainer}>
          <View style={styles.progressoHeader}>
            <Text style={styles.progressoTexto}>
              Questão {questaoAtual + 1} de {questoes.length}
            </Text>

            <Text style={styles.progressoNumero}>
              {quantidadeRespondida}/{questoes.length}
            </Text>
          </View>

          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${progresso}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* QUESTÃO */}

        <View style={styles.questaoCard}>
          <Text style={styles.questaoNumero}>QUESTÃO {questaoAtual + 1}</Text>

          <Text style={styles.enunciado}>{questao.enunciado}</Text>

          <View style={styles.alternativas}>
            {questao.alternativas
              .sort((a, b) => a.ordem - b.ordem)
              .map((alternativa, index) => {
                const selecionada = alternativaSelecionada === alternativa.id;

                const letra = String.fromCharCode(65 + index);

                return (
                  <Pressable
                    key={alternativa.id}
                    style={[
                      styles.alternativa,
                      selecionada && styles.alternativaSelecionada,
                    ]}
                    onPress={() => selecionarAlternativa(alternativa.id)}
                  >
                    <View
                      style={[
                        styles.letra,
                        selecionada && styles.letraSelecionada,
                      ]}
                    >
                      <Text
                        style={[
                          styles.letraTexto,
                          selecionada && styles.letraTextoSelecionada,
                        ]}
                      >
                        {letra}
                      </Text>
                    </View>

                    <Text
                      style={[
                        styles.alternativaTexto,
                        selecionada && styles.alternativaTextoSelecionada,
                      ]}
                    >
                      {alternativa.texto}
                    </Text>

                    {selecionada && (
                      <View style={styles.check}>
                        <Text style={styles.checkText}>✓</Text>
                      </View>
                    )}
                  </Pressable>
                );
              })}
          </View>
        </View>

        {/* NAVEGAÇÃO */}

        <View style={styles.navegacao}>
          <Pressable
            style={[
              styles.botaoAnterior,
              primeiraQuestao && styles.botaoDesabilitado,
            ]}
            disabled={primeiraQuestao}
            onPress={questaoAnterior}
          >
            <Text style={styles.botaoAnteriorTexto} selectable={false}>
              ← Anterior
            </Text>
          </Pressable>

          {!ultimaQuestao ? (
            <Pressable style={styles.botaoProximo} onPress={proximaQuestao}>
              <Text style={styles.botaoProximoTexto} selectable={false}>
                Próxima →
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={[
                styles.botaoFinalizar,
                finalizando && styles.botaoDesabilitado,
              ]}
              disabled={finalizando}
              onPress={confirmarFinalizacao}
            >
              {finalizando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.botaoFinalizarTexto}>Finalizar quiz</Text>
              )}
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F8FC",
  },

  content: {
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
    padding: 30,
    paddingBottom: 50,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F8FC",
    padding: 30,
  },

  loadingText: {
    marginTop: 15,
    color: "#64748B",
    fontSize: 15,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 10,
  },

  emptyText: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 25,
  },

  backButton: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#fff",
    fontWeight: "600",
  },

  header: {
    marginBottom: 25,
  },

  voltar: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  voltarText: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },

  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#172554",
  },

  descricao: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    lineHeight: 22,
  },

  progressoContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 18,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  progressoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  progressoTexto: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },

  progressoNumero: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2563EB",
  },

  progressBar: {
    height: 8,
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#2563EB",
    borderRadius: 10,
  },

  questaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 30,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  questaoNumero: {
    fontSize: 13,
    fontWeight: "700",
    color: "#2563EB",
    letterSpacing: 0.5,
    marginBottom: 14,
  },

  enunciado: {
    fontSize: 21,
    fontWeight: "600",
    color: "#172554",
    lineHeight: 31,
    marginBottom: 28,
  },

  alternativas: {
    gap: 14,
  },

  alternativa: {
    minHeight: 70,
    borderWidth: 1.5,
    borderColor: "#CBD5E1",
    borderRadius: 13,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  alternativaSelecionada: {
    borderColor: "#2563EB",
    backgroundColor: "#EFF6FF",
  },

  letra: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  letraSelecionada: {
    backgroundColor: "#2563EB",
  },

  letraTexto: {
    fontSize: 16,
    fontWeight: "700",
    color: "#475569",
  },

  letraTextoSelecionada: {
    color: "#FFFFFF",
  },

  alternativaTexto: {
    flex: 1,
    fontSize: 16,
    color: "#334155",
    lineHeight: 23,
  },

  alternativaTextoSelecionada: {
    color: "#172554",
    fontWeight: "600",
  },

  check: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#2563EB",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },

  checkText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  navegacao: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 25,
    gap: 15,
  },

  botaoAnterior: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    backgroundColor: "#FFFFFF",
  },

  botaoAnteriorTexto: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },

  botaoProximo: {
    marginLeft: "auto",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#2563EB",
  },

  botaoProximoTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  botaoFinalizar: {
    marginLeft: "auto",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 10,
    backgroundColor: "#16A34A",
    minWidth: 150,
    alignItems: "center",
  },

  botaoFinalizarTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoDesabilitado: {
    opacity: 0.45,
  },
});
