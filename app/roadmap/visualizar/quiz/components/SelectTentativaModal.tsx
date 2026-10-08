import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { CalendarDays, CheckCircle2, ChevronRight, X } from "lucide-react-native";
import { colors } from "../../../../../styles/colors";

export interface TentativaQuizResumo {
  id: number;
  concluido?: boolean;
  finalizadoEm?: string | Date | null;
  criadoEm?: string | Date | null;
  percentual?: number | string | null;
  pontuacao?: number | string | null;
  acertos?: number | null;
  totalQuestoes?: number | null;
  quantidadeQuestoes?: number | null;
}

interface SelectTentativaModalProps {
  visible: boolean;
  closeModal: () => void;
  tentativas: TentativaQuizResumo[];
  onSelectTentativa: (tentativa: TentativaQuizResumo) => void;
  tituloQuiz?: string;
}

function formatarData(data?: string | Date | null) {
  if (!data) return "Data não informada";

  const dataConvertida = new Date(data);
  if (Number.isNaN(dataConvertida.getTime())) return "Data não informada";

  return dataConvertida.toLocaleString("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function obterResultado(tentativa: TentativaQuizResumo) {
  if (tentativa.percentual !== undefined && tentativa.percentual !== null) {
    const percentual = Number(tentativa.percentual);
    return Number.isFinite(percentual) ? `${percentual}% de aproveitamento` : null;
  }

  if (
    tentativa.acertos !== undefined &&
    tentativa.acertos !== null &&
    (tentativa.totalQuestoes ?? tentativa.quantidadeQuestoes)
  ) {
    return `${tentativa.acertos}/${tentativa.totalQuestoes ?? tentativa.quantidadeQuestoes} acertos`;
  }

  if (tentativa.pontuacao !== undefined && tentativa.pontuacao !== null) {
    return `Pontuação: ${tentativa.pontuacao}`;
  }

  return null;
}

export default function SelectTentativaModal({
  visible,
  closeModal,
  tentativas,
  onSelectTentativa,
  tituloQuiz,
}: SelectTentativaModalProps) {
  const tentativasOrdenadas = [...tentativas].sort((a, b) => {
    const dataA = new Date(a.finalizadoEm ?? a.criadoEm ?? 0).getTime();
    const dataB = new Date(b.finalizadoEm ?? b.criadoEm ?? 0).getTime();
    return dataB - dataA;
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={closeModal}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <View style={styles.headerTextos}>
              <Text style={styles.titulo}>Histórico de tentativas</Text>
              <Text style={styles.subtitulo}>
                {tituloQuiz
                  ? `Selecione uma tentativa de "${tituloQuiz}" para visualizar o resultado.`
                  : "Selecione qual resultado deseja visualizar."}
              </Text>
            </View>

            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              onPress={closeModal}
              style={styles.fecharButton}
            >
              <X size={20} color="#4b5563" />
            </Pressable>
          </View>

          <ScrollView
            style={styles.lista}
            contentContainerStyle={styles.listaConteudo}
            showsVerticalScrollIndicator={false}
          >
            {tentativasOrdenadas.length > 0 ? (
              tentativasOrdenadas.map((tentativa, index) => {
                const resultado = obterResultado(tentativa);
                const data = tentativa.finalizadoEm ?? tentativa.criadoEm;

                return (
                  <Pressable
                    key={tentativa.id}
                    onPress={() => onSelectTentativa(tentativa)}
                    style={({ pressed }) => [
                      styles.tentativaItem,
                      pressed && styles.tentativaItemPressed,
                    ]}
                  >
                    <View style={styles.iconeTentativa}>
                      <CheckCircle2 size={21} color={colors.lightBlue} />
                    </View>

                    <View style={styles.tentativaInfo}>
                      <Text style={styles.tentativaTitulo}>
                        Tentativa {tentativasOrdenadas.length - index}
                      </Text>

                      <View style={styles.dataLinha}>
                        <CalendarDays size={14} color="#6b7280" />
                        <Text style={styles.dataTexto}>{formatarData(data)}</Text>
                      </View>

                      {resultado ? (
                        <Text style={styles.resultadoTexto}>{resultado}</Text>
                      ) : null}
                    </View>

                    <ChevronRight size={20} color="#9ca3af" />
                  </Pressable>
                );
              })
            ) : (
              <View style={styles.vazio}>
                <Text style={styles.vazioTitulo}>Nenhuma tentativa encontrada</Text>
                <Text style={styles.vazioTexto}>
                  Quando você concluir o quiz, as tentativas aparecerão aqui.
                </Text>
              </View>
            )}
          </ScrollView>

          <Pressable onPress={closeModal} style={styles.cancelarButton}>
            <Text style={styles.cancelarTexto}>Cancelar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  modal: {
    width: "100%",
    maxWidth: 560,
    maxHeight: "85%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 22,
    gap: 18,
    boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.18)",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
  },
  headerTextos: {
    flex: 1,
    gap: 6,
  },
  titulo: {
    color: "#111827",
    fontSize: 21,
    fontWeight: "700",
  },
  subtitulo: {
    color: "#6b7280",
    fontSize: 14,
    lineHeight: 20,
  },
  fecharButton: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
  },
  lista: {
    flexGrow: 0,
  },
  listaConteudo: {
    gap: 10,
    paddingVertical: 2,
  },
  tentativaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#fff",
  },
  tentativaItemPressed: {
    opacity: 0.72,
    backgroundColor: "#f8fafc",
  },
  iconeTentativa: {
    width: 42,
    height: 42,
    borderRadius: 11,
    backgroundColor: "#eff6ff",
    alignItems: "center",
    justifyContent: "center",
  },
  tentativaInfo: {
    flex: 1,
    gap: 5,
  },
  tentativaTitulo: {
    color: "#111827",
    fontSize: 15,
    fontWeight: "700",
  },
  dataLinha: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  dataTexto: {
    color: "#6b7280",
    fontSize: 12,
  },
  resultadoTexto: {
    color: colors.darkBlue,
    fontSize: 13,
    fontWeight: "600",
  },
  vazio: {
    alignItems: "center",
    padding: 24,
    gap: 8,
  },
  vazioTitulo: {
    color: "#374151",
    fontSize: 15,
    fontWeight: "700",
    textAlign: "center",
  },
  vazioTexto: {
    color: "#6b7280",
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
  },
  cancelarButton: {
    alignSelf: "flex-end",
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    backgroundColor: "#f3f4f6",
  },
  cancelarTexto: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
  },
});
