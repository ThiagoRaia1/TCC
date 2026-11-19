import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react-native";

import { colors } from "../../../../styles/colors";
import { getGlobalStyles } from "../../../../styles/globalStyles";

import { useRoadmap } from "../../../../context/providers/roadmap";
import { useLoading } from "../../../../context/providers/loading";
import { useAuth } from "../../../../context/auth";
import { ICard } from "../../../../interfaces/cards/card";
import {
  listarCards,
  atualizarCard,
  criarCard,
  excluirCard,
} from "../../../../services/cards/card";

export default function Cards() {
  const globalStyles = getGlobalStyles();

  const { roadmapContext } = useRoadmap();
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const etapas = roadmapContext?.etapas ?? [];

  const [cards, setCards] = useState<ICard[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const [cardEditando, setCardEditando] = useState<ICard | null>(null);

  const [pergunta, setPergunta] = useState("");
  const [resposta, setResposta] = useState("");

  const [etapaSelecionadaId, setEtapaSelecionadaId] = useState<number | null>(
    null,
  );

  const [objetivoSelecionadoId, setObjetivoSelecionadoId] = useState<
    number | null
  >(null);

  // =====================================================
  // CARREGAR CARDS
  // =====================================================

  const carregarCards = async () => {
    try {
      const resultado = await listarCards();

      const idsEtapas = etapas.map((etapa) => etapa.id);

      const cardsDoRoadmap = resultado.filter((card) =>
        idsEtapas.includes(card.etapa.id),
      );

      setCards(cardsDoRoadmap);
    } catch (erro: any) {
      alert(erro.message || "Erro ao carregar os cards.");
    }
  };

  useEffect(() => {
    if (roadmapContext?.etapas) {
      carregarCards();
    }
  }, [roadmapContext?.id]);

  // =====================================================
  // OBJETIVOS DA ETAPA SELECIONADA
  // =====================================================

  const etapaSelecionada = useMemo(
    () => etapas.find((etapa) => etapa.id === etapaSelecionadaId),
    [etapas, etapaSelecionadaId],
  );

  const objetivos = etapaSelecionada?.objetivos ?? [];

  // =====================================================
  // MODAL
  // =====================================================

  const limparFormulario = () => {
    setPergunta("");
    setResposta("");
    setEtapaSelecionadaId(null);
    setObjetivoSelecionadoId(null);
    setCardEditando(null);
  };

  const abrirCadastro = () => {
    limparFormulario();
    setModalVisible(true);
  };

  const abrirEdicao = (card: ICard) => {
    setCardEditando(card);
    setPergunta(card.pergunta);
    setResposta(card.resposta);
    setEtapaSelecionadaId(card.etapa.id);
    setObjetivoSelecionadoId(card.objetivo?.id ?? null);
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    limparFormulario();
  };

  // =====================================================
  // SELECIONAR ETAPA
  // =====================================================

  const selecionarEtapa = (etapaId: number) => {
    setEtapaSelecionadaId(etapaId);
    setObjetivoSelecionadoId(null);
  };

  // =====================================================
  // SELECIONAR OBJETIVO
  // =====================================================

  const selecionarObjetivo = (objetivoId: number, etapaId: number) => {
    setEtapaSelecionadaId(etapaId);
    setObjetivoSelecionadoId(objetivoId);
  };

  // =====================================================
  // SALVAR CARD
  // =====================================================

  const salvarCard = async () => {
    try {
      const perguntaFinal = pergunta.trim();
      const respostaFinal = resposta.trim();

      if (!perguntaFinal || !respostaFinal) {
        alert("Preencha a pergunta e a resposta.");
        return;
      }

      if (!etapaSelecionadaId) {
        alert("Selecione uma etapa para o card.");
        return;
      }

      showLoading();

      if (cardEditando) {
        await atualizarCard(cardEditando.id, {
          pergunta: perguntaFinal,
          resposta: respostaFinal,
          etapaId: etapaSelecionadaId,
          objetivoId: objetivoSelecionadoId,
        });
      } else {
        if (usuario)
          await criarCard({
            pergunta: perguntaFinal,
            resposta: respostaFinal,
            usuarioId: Number(usuario.sub),
            etapaId: etapaSelecionadaId,
            objetivoId: objetivoSelecionadoId ?? undefined,
          });
      }

      await carregarCards();

      fecharModal();
    } catch (erro: any) {
      alert(erro.message || "Erro ao salvar o card.");
    } finally {
      hideLoading();
    }
  };

  // =====================================================
  // EXCLUIR CARD
  // =====================================================

  const deletarCard = async (cardId: number) => {
    const confirmar = globalThis.confirm
      ? globalThis.confirm("Deseja realmente excluir este card?")
      : true;

    if (!confirmar) return;

    try {
      showLoading();

      await excluirCard(cardId);

      setCards((anteriores) => anteriores.filter((card) => card.id !== cardId));
    } catch (erro: any) {
      alert(erro.message || "Erro ao excluir o card.");
    } finally {
      hideLoading();
    }
  };

  // =====================================================
  // AGRUPAR CARDS POR ETAPA
  // =====================================================

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.titulo}>Meus Cards</Text>
          <Text style={styles.descricao}>
            Crie perguntas e respostas para revisar os conteúdos do seu roadmap.
          </Text>
        </View>

        <TouchableOpacity
          style={globalStyles.buttonWithIcon}
          onPress={abrirCadastro}
        >
          <Plus size={19} color="#fff" />
          <Text style={globalStyles.buttonWithIconText}>Novo card</Text>
        </TouchableOpacity>
      </View>

      {cards.length === 0 ? (
        <View style={styles.estadoVazio}>
          <Text style={styles.estadoVazioTitulo}>Nenhum card cadastrado</Text>
          <Text style={styles.estadoVazioDescricao}>
            Comece criando seu primeiro card para revisar os conteúdos deste
            roadmap.
          </Text>

          <TouchableOpacity style={styles.botaoVazio} onPress={abrirCadastro}>
            <Plus size={18} color="#fff" />
            <Text style={styles.botaoAdicionarTexto}>Criar primeiro card</Text>
          </TouchableOpacity>
        </View>
      ) : (
        etapas.map((etapa) => {
          const cardsDaEtapa = cards.filter(
            (card) => card.etapa.id === etapa.id,
          );

          if (cardsDaEtapa.length === 0) return null;

          return (
            <View key={etapa.id} style={styles.grupoEtapa}>
              <View style={styles.etapaHeader}>
                <Text style={styles.etapaTitulo}>{etapa.titulo}</Text>
                <Text style={styles.contador}>
                  {cardsDaEtapa.length}{" "}
                  {cardsDaEtapa.length === 1 ? "card" : "cards"}
                </Text>
              </View>

              {cardsDaEtapa.map((card) => (
                <View key={card.id} style={styles.card}>
                  <View style={styles.cardConteudo}>
                    <Text style={styles.label}>PERGUNTA</Text>
                    <Text style={styles.pergunta}>{card.pergunta}</Text>

                    <View style={styles.divisor} />

                    <Text style={styles.label}>RESPOSTA</Text>
                    <Text style={styles.resposta}>{card.resposta}</Text>

                    {card.objetivo && (
                      <View style={styles.objetivoTag}>
                        <Text style={styles.objetivoTagTexto}>
                          Objetivo: {card.objetivo.titulo}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.acoesCard}>
                    <TouchableOpacity
                      style={styles.botaoAcao}
                      onPress={() => abrirEdicao(card)}
                    >
                      <Pencil size={17} color={colors.lightBlue} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.botaoAcao}
                      onPress={() => deletarCard(card.id)}
                    >
                      <Trash2 size={17} color="#dc2626" />
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          );
        })
      )}

      {/* =====================================================
          MODAL DE CADASTRO / EDIÇÃO
      ===================================================== */}

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={fecharModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitulo}>
                {cardEditando ? "Editar card" : "Novo card"}
              </Text>

              <TouchableOpacity onPress={fecharModal}>
                <X size={23} color="#555" />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={{ marginRight: 10 }}
              keyboardShouldPersistTaps="handled"
            >
              <Text style={styles.inputLabel}>Pergunta*</Text>
              <TextInput
                style={styles.input}
                value={pergunta}
                onChangeText={setPergunta}
                placeholder="Digite a pergunta do card"
                placeholderTextColor={colors.placeholderTextColor}
                multiline
              />

              <Text style={styles.inputLabel}>Resposta*</Text>
              <TextInput
                style={[styles.input, styles.inputResposta]}
                value={resposta}
                onChangeText={setResposta}
                placeholder="Digite a resposta do card"
                placeholderTextColor={colors.placeholderTextColor}
                multiline
              />

              {/* ETAPA */}
              <Text style={styles.inputLabel}>Etapa*</Text>

              {etapas.map((etapa) => (
                <TouchableOpacity
                  key={etapa.id}
                  style={[
                    styles.opcaoSelecao,
                    etapaSelecionadaId === etapa.id && styles.opcaoSelecionada,
                  ]}
                  onPress={() => selecionarEtapa(etapa.id)}
                >
                  <Text
                    style={[
                      styles.opcaoTexto,
                      etapaSelecionadaId === etapa.id &&
                        styles.opcaoTextoSelecionado,
                    ]}
                  >
                    {etapa.titulo}
                  </Text>
                </TouchableOpacity>
              ))}

              {/* OBJETIVO */}
              <Text style={styles.inputLabel}>Objetivo (opcional)</Text>

              {!etapaSelecionadaId ? (
                <Text style={styles.aviso}>
                  Selecione uma etapa primeiro para visualizar seus objetivos.
                </Text>
              ) : objetivos.length === 0 ? (
                <Text style={styles.aviso}>
                  Esta etapa ainda não possui objetivos cadastrados.
                </Text>
              ) : (
                <View style={{}}>
                  {/* Opção sem objetivo */}
                  <TouchableOpacity
                    style={[
                      styles.opcaoSelecao,
                      objetivoSelecionadoId === null && styles.opcaoSelecionada,
                    ]}
                    onPress={() => setObjetivoSelecionadoId(null)}
                    activeOpacity={0.7}
                  >
                    <Text
                      style={[
                        styles.opcaoTexto,
                        objetivoSelecionadoId === null &&
                          styles.opcaoTextoSelecionado,
                      ]}
                    >
                      Nenhum objetivo
                    </Text>
                  </TouchableOpacity>

                  {/* Objetivos da etapa */}
                  {objetivos.map((objetivo) => {
                    const selecionado = objetivoSelecionadoId === objetivo.id;

                    return (
                      <TouchableOpacity
                        key={objetivo.id}
                        style={[
                          styles.opcaoSelecao,
                          selecionado && styles.opcaoSelecionada,
                        ]}
                        onPress={() =>
                          selecionarObjetivo(objetivo.id, etapaSelecionadaId!)
                        }
                        activeOpacity={0.7}
                      >
                        <Text
                          style={[
                            styles.opcaoTexto,
                            selecionado && styles.opcaoTextoSelecionado,
                          ]}
                        >
                          {objetivo.titulo}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}
            </ScrollView>

            <View style={styles.modalAcoes}>
              <TouchableOpacity
                style={styles.botaoCancelar}
                onPress={fecharModal}
              >
                <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={globalStyles.buttonWithIcon}
                onPress={salvarCard}
              >
                <Text style={globalStyles.buttonWithIconText}>
                  {cardEditando ? "Salvar alterações" : "Criar card"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================================
// ESTILOS
// =====================================================

const styles = StyleSheet.create({
  container: {
    width: "100%",
    gap: 20,
    paddingVertical: 12,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 16,
    flexWrap: "wrap",
  },

  titulo: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.darkBlue,
  },

  descricao: {
    fontSize: 14,
    color: "#666",
    marginTop: 5,
  },

  botaoAdicionar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
  },

  botaoAdicionarTexto: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },

  estadoVazio: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 35,
    gap: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  estadoVazioTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkBlue,
  },

  estadoVazioDescricao: {
    color: "#666",
    textAlign: "center",
    maxWidth: 450,
    lineHeight: 21,
  },

  botaoVazio: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
    marginTop: 8,
  },

  grupoEtapa: {
    gap: 12,
  },

  etapaHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    paddingBottom: 10,
  },

  etapaTitulo: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.darkBlue,
    flex: 1,
  },

  contador: {
    fontSize: 12,
    color: "#666",
    backgroundColor: "#eef2f7",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    padding: 18,
    gap: 12,
  },

  cardConteudo: {
    flex: 1,
    gap: 8,
  },

  label: {
    fontSize: 11,
    fontWeight: "700",
    color: colors.lightBlue,
    letterSpacing: 0.7,
  },

  pergunta: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    lineHeight: 23,
  },

  resposta: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },

  divisor: {
    height: 1,
    backgroundColor: "#e5e7eb",
    marginVertical: 7,
  },

  objetivoTag: {
    alignSelf: "flex-start",
    backgroundColor: "#eef2ff",
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    marginTop: 6,
  },

  objetivoTagTexto: {
    color: colors.darkBlue,
    fontSize: 12,
    fontWeight: "500",
  },

  acoesCard: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
  },

  botaoAcao: {
    padding: 8,
    borderRadius: 7,
    backgroundColor: "#f3f4f6",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },

  modalContainer: {
    width: "100%",
    maxWidth: 600,
    maxHeight: "90%",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 22,
    gap: 16,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  modalTitulo: {
    fontSize: 21,
    fontWeight: "700",
    color: colors.darkBlue,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginTop: 13,
    marginBottom: 7,
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    color: "#222",
    minHeight: 48,
    textAlignVertical: "top",
  },

  inputResposta: {
    minHeight: 110,
  },

  opcaoSelecao: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 8,
    marginBottom: 7,
  },

  aviso: {
    fontSize: 13,
    color: "#777",
    paddingVertical: 8,
  },

  seletorObjetivo: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    padding: 12,
  },

  seletorObjetivoTexto: {
    fontSize: 14,
    color: "#444",
  },

  modalAcoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },

  botaoCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#f3f4f6",
  },

  botaoCancelarTexto: {
    color: "#444",
    fontWeight: "600",
  },

  botaoSalvar: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: colors.darkBlue,
  },

  botaoSalvarTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  opcaoSelecionada: {
    borderColor: colors.darkBlue,
    borderWidth: 2,
    backgroundColor: "#eef2f7",
  },

  opcaoTexto: {
    fontSize: 14,
    color: "#444",
  },

  opcaoTextoSelecionado: {
    color: colors.darkBlue,
    fontWeight: "700",
  },
});
