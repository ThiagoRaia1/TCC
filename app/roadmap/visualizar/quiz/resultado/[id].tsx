import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { httpClient } from "../../../../../services/httpclient";
import { ITentativaQuiz } from "../../../../../interfaces/quiz/tentativaQuiz";

export default function ResultadoQuiz() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [tentativa, setTentativa] = useState<ITentativaQuiz | null>(null);

  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarResultado();
  }, [id]);

  async function carregarResultado() {
    try {
      setCarregando(true);

      const resultado = await httpClient(`/tentativa-quiz/${id}`, {
        method: "GET",
      });

      setTentativa(resultado);
    } catch (error) {
      console.error("Erro ao carregar resultado:", error);
    } finally {
      setCarregando(false);
    }
  }

  const respostasOrdenadas = useMemo(() => {
    if (!tentativa?.respostas) {
      return [];
    }

    return [...tentativa.respostas].sort(
      (a, b) => a.questao.ordem - b.questao.ordem,
    );
  }, [tentativa]);

  if (carregando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>Carregando resultado...</Text>
      </View>
    );
  }

  if (!tentativa) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.erroTitulo}>Resultado não encontrado</Text>

        <Text style={styles.erroTexto}>
          Não foi possível carregar o resultado desta tentativa.
        </Text>

        <Pressable style={styles.botaoVoltar} onPress={() => router.back()}>
          <Text style={styles.botaoVoltarTexto}>Voltar</Text>
        </Pressable>
      </View>
    );
  }

  const percentual = Number(tentativa.percentual);

  const aprovou = percentual >= 70;

  const erros = tentativa.totalQuestoes - tentativa.pontuacao;

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* CABEÇALHO */}

        <View style={styles.header}>
          <Pressable style={styles.voltar} onPress={() => router.back()}>
            <Text style={styles.voltarTexto}>← Voltar</Text>
          </Pressable>

          <Text style={styles.titulo}>Resultado do quiz</Text>

          <Text style={styles.quizTitulo}>{tentativa.quiz?.titulo}</Text>
        </View>

        {/* RESULTADO PRINCIPAL */}

        <View style={styles.resultadoCard}>
          <View
            style={[
              styles.iconeResultado,
              aprovou ? styles.iconeAprovado : styles.iconeReprovado,
            ]}
          >
            <Text style={styles.iconeTexto}>{aprovou ? "✓" : "!"}</Text>
          </View>

          <Text style={styles.resultadoTitulo}>
            {aprovou ? "Muito bem!" : "Continue estudando!"}
          </Text>

          <Text style={styles.resultadoDescricao}>
            {aprovou
              ? "Você teve um bom desempenho neste quiz."
              : "Revise o conteúdo das questões que você errou e tente novamente."}
          </Text>

          <View style={styles.percentualContainer}>
            <Text style={styles.percentual}>{percentual.toFixed(0)}%</Text>

            <Text style={styles.percentualLabel}>de aproveitamento</Text>
          </View>
        </View>

        {/* ESTATÍSTICAS */}

        <View style={styles.estatisticas}>
          <View style={styles.estatisticaCard}>
            <Text style={styles.estatisticaNumero}>{tentativa.pontuacao}</Text>

            <Text style={styles.estatisticaLabel}>Acertos</Text>
          </View>

          <View style={styles.estatisticaCard}>
            <Text style={styles.estatisticaNumero}>{erros}</Text>

            <Text style={styles.estatisticaLabel}>Erros</Text>
          </View>

          <View style={styles.estatisticaCard}>
            <Text style={styles.estatisticaNumero}>
              {tentativa.totalQuestoes}
            </Text>

            <Text style={styles.estatisticaLabel}>Questões</Text>
          </View>
        </View>

        {/* REVISÃO */}

        <View style={styles.revisaoHeader}>
          <View>
            <Text style={styles.revisaoTitulo}>Revisão das questões</Text>

            <Text style={styles.revisaoDescricao}>
              Confira suas respostas e veja onde acertou ou errou.
            </Text>
          </View>
        </View>

        {respostasOrdenadas.map((resposta, index) => {
          const alternativasOrdenadas = [...resposta.questao.alternativas].sort(
            (a, b) => a.ordem - b.ordem,
          );

          return (
            <View
              key={resposta.id}
              style={[
                styles.questaoCard,
                resposta.correta ? styles.questaoCorreta : styles.questaoErrada,
              ]}
            >
              <View style={styles.questaoHeader}>
                <View
                  style={[
                    styles.statusIcon,
                    resposta.correta
                      ? styles.statusIconCorreto
                      : styles.statusIconErrado,
                  ]}
                >
                  <Text style={styles.statusIconTexto}>
                    {resposta.correta ? "✓" : "✕"}
                  </Text>
                </View>

                <Text style={styles.questaoNumero}>Questão {index + 1}</Text>

                <Text
                  style={[
                    styles.statusTexto,
                    resposta.correta ? styles.textoCorreto : styles.textoErrado,
                  ]}
                >
                  {resposta.correta ? "Correta" : "Incorreta"}
                </Text>
              </View>

              <Text style={styles.enunciado}>{resposta.questao.enunciado}</Text>

              {/* ALTERNATIVAS */}

              <View style={styles.alternativas}>
                {alternativasOrdenadas.map((alternativa, alternativaIndex) => {
                  const foiSelecionada =
                    alternativa.id === resposta.alternativa.id;

                  const ehCorreta = alternativa.correta;

                  const letra = String.fromCharCode(65 + alternativaIndex);

                  let estiloAlternativa = styles.alternativa;

                  if (ehCorreta) {
                    estiloAlternativa = styles.alternativaCorreta;
                  } else if (foiSelecionada && !ehCorreta) {
                    estiloAlternativa = styles.alternativaErrada;
                  }

                  return (
                    <View key={alternativa.id} style={estiloAlternativa}>
                      <View
                        style={[
                          styles.letra,
                          ehCorreta && styles.letraCorreta,
                          foiSelecionada && !ehCorreta && styles.letraErrada,
                        ]}
                      >
                        <Text
                          style={[
                            styles.letraTexto,
                            (ehCorreta || (foiSelecionada && !ehCorreta)) &&
                              styles.letraTextoAtivo,
                          ]}
                        >
                          {letra}
                        </Text>
                      </View>

                      <Text
                        style={[
                          styles.alternativaTexto,
                          ehCorreta && styles.textoAlternativaCorreta,
                          foiSelecionada &&
                            !ehCorreta &&
                            styles.textoAlternativaErrada,
                        ]}
                      >
                        {alternativa.texto}
                      </Text>

                      {ehCorreta && (
                        <Text style={styles.indicadorCorreto}>✓ Correta</Text>
                      )}

                      {foiSelecionada && !ehCorreta && (
                        <Text style={styles.indicadorErrado}>Sua resposta</Text>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          );
        })}

        {/* BOTÕES */}

        <View style={styles.botoes}>
          <Pressable
            style={styles.botaoPrincipal}
            onPress={() =>
              router.replace(`/quiz/responder/${tentativa.quiz.id}`)
            }
          >
            <Text style={styles.botaoPrincipalTexto}>Tentar novamente</Text>
          </Pressable>

          <Pressable
            style={styles.botaoSecundario}
            onPress={() => router.back()}
          >
            <Text style={styles.botaoSecundarioTexto}>Voltar</Text>
          </Pressable>
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
    maxWidth: 1350,
    alignSelf: "center",
    paddingTop: 30,
    paddingBottom: 60,
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

  erroTitulo: {
    fontSize: 24,
    fontWeight: "700",
    color: "#172554",
    marginBottom: 10,
  },

  erroTexto: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 25,
  },

  header: {
    marginBottom: 25,
  },

  voltar: {
    alignSelf: "flex-start",
    marginBottom: 20,
  },

  voltarTexto: {
    color: "#2563EB",
    fontSize: 15,
    fontWeight: "600",
  },

  titulo: {
    fontSize: 30,
    fontWeight: "700",
    color: "#172554",
  },

  quizTitulo: {
    fontSize: 16,
    color: "#64748B",
    marginTop: 8,
  },

  resultadoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },

  iconeResultado: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  iconeAprovado: {
    backgroundColor: "#DCFCE7",
  },

  iconeReprovado: {
    backgroundColor: "#FEE2E2",
  },

  iconeTexto: {
    fontSize: 34,
    fontWeight: "800",
    color: "#16A34A",
  },

  resultadoTitulo: {
    fontSize: 25,
    fontWeight: "700",
    color: "#172554",
  },

  resultadoDescricao: {
    fontSize: 15,
    color: "#64748B",
    textAlign: "center",
    maxWidth: 600,
    lineHeight: 22,
    marginTop: 8,
  },

  percentualContainer: {
    alignItems: "center",
    marginTop: 25,
  },

  percentual: {
    fontSize: 54,
    fontWeight: "800",
    color: "#2563EB",
  },

  percentualLabel: {
    fontSize: 14,
    color: "#64748B",
    marginTop: -5,
  },

  estatisticas: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 30,
  },

  estatisticaCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  estatisticaNumero: {
    fontSize: 28,
    fontWeight: "800",
    color: "#172554",
  },

  estatisticaLabel: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },

  revisaoHeader: {
    marginBottom: 15,
  },

  revisaoTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#172554",
  },

  revisaoDescricao: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },

  questaoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    marginBottom: 18,
    borderWidth: 1,
  },

  questaoCorreta: {
    borderColor: "#BBF7D0",
  },

  questaoErrada: {
    borderColor: "#FECACA",
  },

  questaoHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  statusIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  statusIconCorreto: {
    backgroundColor: "#DCFCE7",
  },

  statusIconErrado: {
    backgroundColor: "#FEE2E2",
  },

  statusIconTexto: {
    fontSize: 17,
    fontWeight: "800",
  },

  questaoNumero: {
    fontSize: 15,
    fontWeight: "700",
    color: "#334155",
    flex: 1,
  },

  statusTexto: {
    fontSize: 13,
    fontWeight: "700",
  },

  textoCorreto: {
    color: "#16A34A",
  },

  textoErrado: {
    color: "#DC2626",
  },

  enunciado: {
    fontSize: 18,
    fontWeight: "600",
    color: "#172554",
    lineHeight: 27,
    marginBottom: 20,
  },

  alternativas: {
    gap: 10,
  },

  alternativa: {
    minHeight: 58,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  alternativaCorreta: {
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: "#86EFAC",
    backgroundColor: "#F0FDF4",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  alternativaErrada: {
    minHeight: 58,
    borderWidth: 1.5,
    borderColor: "#FCA5A5",
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  letra: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  letraCorreta: {
    backgroundColor: "#16A34A",
  },

  letraErrada: {
    backgroundColor: "#DC2626",
  },

  letraTexto: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },

  letraTextoAtivo: {
    color: "#FFFFFF",
  },

  alternativaTexto: {
    flex: 1,
    fontSize: 15,
    color: "#334155",
    lineHeight: 21,
  },

  textoAlternativaCorreta: {
    color: "#166534",
    fontWeight: "600",
  },

  textoAlternativaErrada: {
    color: "#991B1B",
    fontWeight: "600",
  },

  indicadorCorreto: {
    fontSize: 12,
    fontWeight: "700",
    color: "#16A34A",
    marginLeft: 8,
  },

  indicadorErrado: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DC2626",
    marginLeft: 8,
  },

  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 15,
  },

  botaoPrincipal: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 10,
  },

  botaoPrincipalTexto: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },

  botaoSecundario: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 25,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  botaoSecundarioTexto: {
    color: "#334155",
    fontSize: 15,
    fontWeight: "600",
  },

  botaoVoltar: {
    backgroundColor: "#2563EB",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
  },

  botaoVoltarTexto: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
