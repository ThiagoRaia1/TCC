import {
  Pressable,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  Text,
  Modal,
  ScrollView,
  Animated,
} from "react-native";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { useLoading } from "../../../context/providers/loading";
import { IUpdateRoadmap } from "../../../interfaces/roadmap";
import { getRoadmap, updateRoadmap } from "../../../services/roadmap";
import { colors } from "../../../styles/colors";
import {
  calcularProgresso,
  getProgressColor,
} from "../../../utils/progressBarFunctions";
import Roadmap from "./Roadmap";
import { ArrowLeft, Pencil, Play, Trash2 } from "lucide-react-native";
import DeleteModal from "./components/DeleteModal";
import { IEtapa } from "../../../interfaces/etapa";
import Quizzes from "./quiz/Quizzes";
import { useRoadmap } from "../../../context/providers/roadmap";
import CadernoRevisao from "./cadernoRevisao";
import Cards from "./cards";
import { ICard } from "../../../interfaces/cards/card";
import { listarCards } from "../../../services/cards/card";

export type TipoItem = "roadmap" | "etapa" | "objetivo";
export const tiposItem: TipoItem[] = ["roadmap", "etapa", "objetivo"];

export default function Visualizar() {
  const globalStyles = getGlobalStyles();
  const { roadmapContext, setRoadmapContext } = useRoadmap();
  const { showLoading, hideLoading } = useLoading();

  const [editandoRoadmap, setEditandoRoadmap] = useState(false);
  const [novoTema, setNovoTema] = useState("");
  const [novaDescricao, setNovaDescricao] = useState("");

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const openDeleteModal = (tipoItem: TipoItem) => {
    setTipoItemASerExcluido(tipoItem);
    setDeleteModalVisible(true);
  };

  const [modalPraticarVisible, setModalPraticarVisible] = useState(false);

  const [tipoPratica, setTipoPratica] = useState<"roadmap" | "etapas">(
    "roadmap",
  );

  const [etapasSelecionadas, setEtapasSelecionadas] = useState<number[]>([]);

  const alternarEtapa = (etapaId: number) => {
    setEtapasSelecionadas((anteriores) =>
      anteriores.includes(etapaId)
        ? anteriores.filter((id) => id !== etapaId)
        : [...anteriores, etapaId],
    );
  };

  const [praticandoCards, setPraticandoCards] = useState(false);
  const [cardsPratica, setCardsPratica] = useState<ICard[]>([]);
  const [indiceCardAtual, setIndiceCardAtual] = useState(0);
  const [respostaVisivel, setRespostaVisivel] = useState(false);
  const [praticaFinalizada, setPraticaFinalizada] = useState(false);

  // Respostas temporárias da sessão. Não são enviadas ao backend.
  const [resultadosPratica, setResultadosPratica] = useState<
    { cardId: number; acertou: boolean }[]
  >([]);

  // Valor utilizado na animação de virar o card.
  const animacaoCard = useRef(new Animated.Value(0)).current;

  const iniciarPraticaCards = async () => {
    if (tipoPratica === "etapas" && etapasSelecionadas.length === 0) {
      alert("Selecione pelo menos uma etapa.");
      return;
    }

    try {
      showLoading();

      const todosCards = await listarCards();

      const idsEtapas =
        tipoPratica === "roadmap"
          ? (roadmapContext?.etapas.map((etapa) => etapa.id) ?? [])
          : etapasSelecionadas;

      const cardsFiltrados = todosCards.filter((card) =>
        idsEtapas.includes(card.etapa.id),
      );

      if (cardsFiltrados.length === 0) {
        alert("Não existem cards para estudar nessa seleção.");
        return;
      }

      setCardsPratica(cardsFiltrados);
      setIndiceCardAtual(0);
      setRespostaVisivel(false);
      setPraticaFinalizada(false);
      setResultadosPratica([]);
      animacaoCard.setValue(0);

      setModalPraticarVisible(false);
      setPraticandoCards(true);
    } catch (erro: any) {
      alert(erro.message || "Erro ao carregar os cards.");
    } finally {
      hideLoading();
    }
  };

  const virarCard = () => {
    if (respostaVisivel) return;

    Animated.timing(animacaoCard, {
      toValue: 1,
      duration: 450,
      useNativeDriver: true,
    }).start(() => {
      setRespostaVisivel(true);
    });
  };

  const registrarResposta = (acertou: boolean) => {
    const cardAtual = cardsPratica[indiceCardAtual];

    if (!cardAtual) return;

    // Guarda o resultado apenas na memória durante esta sessão.
    setResultadosPratica((anteriores) => [
      ...anteriores,
      {
        cardId: cardAtual.id,
        acertou,
      },
    ]);

    if (indiceCardAtual === cardsPratica.length - 1) {
      setPraticaFinalizada(true);
      return;
    }

    // Prepara o próximo card.
    setIndiceCardAtual((indice) => indice + 1);
    setRespostaVisivel(false);
    animacaoCard.setValue(0);
  };

  const sairDaPratica = () => {
    setPraticandoCards(false);
    setPraticaFinalizada(false);
    setCardsPratica([]);
    setIndiceCardAtual(0);
    setRespostaVisivel(false);
    setResultadosPratica([]);
    animacaoCard.setValue(0);
  };

  const rotacaoFrente = animacaoCard.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  const rotacaoVerso = animacaoCard.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  const cardAtual = cardsPratica[indiceCardAtual];

  const [etapaSelecionada, setEtapaSelecionada] = useState<IEtapa>();

  const [anotacoes, setAnotacoes] = useState<{
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
    };
  }>({});

  //#region TIPOS
  type Abas = "etapas" | "quizzes" | "cadernoRevisao" | "cards";

  const { id, aba } = useLocalSearchParams<{
    id: string;
    aba?: string;
  }>();

  const selecionarAba = (novaAba: Abas) => {
    router.setParams({ aba: novaAba });
  };

  const [tipoItemASerExcluido, setTipoItemASerExcluido] = useState<TipoItem>(
    tiposItem[0],
  );
  // TIPOS
  //#endregion

  //#region USE EFFECTS
  const getData = async () => {
    try {
      showLoading();
      const resultado = await getRoadmap(Number(id));
      setRoadmapContext(resultado);

      const anotacoesIniciais: {
        [etapaId: number]: {
          plainText: string;
          editorState: string | null;
        };
      } = {};

      resultado.etapas.forEach((etapa) => {
        anotacoesIniciais[etapa.id] = {
          plainText: etapa.anotacoes?.plainText ?? "",
          editorState: etapa.anotacoes?.editorState ?? null,
        };
      });

      setAnotacoes(anotacoesIniciais);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (roadmapContext) calcularProgresso(roadmapContext);
  }, [roadmapContext]);
  // USE EFFECTS
  //#endregion

  const porcentagemConclusaoRoadmap: number = roadmapContext
    ? calcularProgresso(roadmapContext)
    : 0;

  const iniciarEdicaoRoadmap = () => {
    if (!roadmapContext) return;

    setNovoTema(roadmapContext.tema);
    setNovaDescricao(roadmapContext.descricaoGeral ?? "");

    setEditandoRoadmap(true);
  };

  const cancelarEdicaoRoadmap = () => {
    if (!roadmapContext) return;

    setNovoTema(roadmapContext.tema);
    setNovaDescricao(roadmapContext.descricaoGeral ?? "");

    setEditandoRoadmap(false);
  };

  const salvarEdicaoRoadmap = async () => {
    if (!roadmapContext) return;

    await editarRoadmap(novoTema, novaDescricao);

    setEditandoRoadmap(false);
  };

  const editarRoadmap = async (novoTema: string, novaDescricao: string) => {
    try {
      if (!roadmapContext) return;

      const tema = novoTema.trim();
      const descricaoGeral = novaDescricao.trim();

      if (!tema) {
        alert("O título do roadmap não pode ficar vazio.");
        return;
      }

      showLoading();

      const roadmapAtualizado: IUpdateRoadmap = {
        ...roadmapContext,
        tema,
        descricaoGeral,
      };

      const atualizado = await updateRoadmap(roadmapAtualizado);

      setRoadmapContext(atualizado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return roadmapContext ? (
    <>
      <View
        style={{
          maxWidth: 1350,
          paddingHorizontal: 8,
          gap: 20,
          paddingVertical: 12,
          paddingBottom: 40,
          width: "100%",
          alignSelf: "center",
          flex: 1,
        }}
      >
        {deleteModalVisible && (
          <DeleteModal
            closeModal={() => setDeleteModalVisible(false)}
            tipoItem={tipoItemASerExcluido}
            etapa={etapaSelecionada}
          />
        )}

        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[globalStyles.buttonWithIcon, styles.buttonWithIcon]}
            onPress={() => router.push("/roadmap")}
          >
            <ArrowLeft
              size={20}
              style={{ marginTop: 4 }}
              color={colors.lightBlue}
            />

            <Text style={styles.voltarTexto}>Voltar ao dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={globalStyles.buttonWithIcon}
            onPress={() => setModalPraticarVisible(true)}
          >
            <Play size={18} color="#fff" />

            <Text style={globalStyles.buttonWithIconText}>
              Praticar com cards
            </Text>
          </TouchableOpacity>
        </View>

        {/* HEADER DO ROADMAP */}
        <View style={globalStyles.card}>
          <View
            style={{
              flexDirection: "row",
              flex: 1,
              justifyContent: "space-between",
              gap: 20,
            }}
          >
            <View
              style={{
                flex: 1,
                gap: 14,
              }}
            >
              {editandoRoadmap ? (
                <>
                  {/* TÍTULO */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Título</Text>

                    <TextInput
                      value={novoTema}
                      onChangeText={setNovoTema}
                      placeholder="Digite o título do roadmap"
                      style={globalStyles.input}
                      autoFocus
                    />
                  </View>

                  {/* DESCRIÇÃO */}
                  <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Descrição</Text>

                    <TextInput
                      value={novaDescricao}
                      onChangeText={setNovaDescricao}
                      placeholder="Digite uma descrição para o roadmap"
                      style={globalStyles.input}
                      multiline
                      numberOfLines={5}
                    />
                  </View>
                </>
              ) : (
                <>
                  <Text style={styles.titulo}>{roadmapContext.tema}</Text>

                  <Text style={styles.descricao}>
                    {roadmapContext.descricaoGeral ? (
                      roadmapContext.descricaoGeral
                    ) : (
                      <i>Este roadmap ainda não possui descrição.</i>
                    )}
                  </Text>
                </>
              )}
            </View>

            <View
              style={{
                flexDirection: "row",
                gap: 20,
                alignItems: editandoRoadmap ? "flex-end" : "center",
              }}
            >
              {/* EDITAR / SALVAR */}
              <Pressable
                style={(state: any) => [
                  globalStyles.secondaryButton,
                  {
                    paddingVertical: 8,
                    backgroundColor: state.hovered ? colors.lightBlue : "#fff",
                    transitionProperty: "background-color",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-in-out",
                    boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                  },
                ]}
                onPress={
                  editandoRoadmap ? salvarEdicaoRoadmap : iniciarEdicaoRoadmap
                }
              >
                {(state: any) => (
                  <>
                    <Pencil color={state.hovered ? "#fff" : "#000"} size={16} />

                    <Text
                      style={[
                        globalStyles.secondaryButtonText,
                        {
                          color: state.hovered ? "#FFF" : "#000",
                        },
                      ]}
                    >
                      {editandoRoadmap ? "Salvar" : "Editar"}
                    </Text>
                  </>
                )}
              </Pressable>

              {/* CANCELAR */}
              {editandoRoadmap && (
                <Pressable
                  style={(state: any) => [
                    globalStyles.secondaryButton,
                    {
                      paddingVertical: 8,
                      backgroundColor: state.hovered ? "#e5e5e5" : "#fff",
                      transitionProperty: "background-color",
                      transitionDuration: "200ms",
                      transitionTimingFunction: "ease-in-out",
                      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                    },
                  ]}
                  onPress={cancelarEdicaoRoadmap}
                >
                  <Text style={globalStyles.secondaryButtonText}>Cancelar</Text>
                </Pressable>
              )}

              {/* DELETAR */}
              {!editandoRoadmap && (
                <Pressable
                  style={(state: any) => [
                    globalStyles.secondaryButton,
                    {
                      paddingVertical: 8,
                      backgroundColor: state.hovered ? "#ef4444" : "#fff",
                      transitionProperty: "background-color",
                      transitionDuration: "200ms",
                      transitionTimingFunction: "ease-in-out",
                      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                    },
                  ]}
                  onPress={() => openDeleteModal(tiposItem[0])}
                >
                  {(state: any) => (
                    <>
                      <Trash2
                        color={state.hovered ? "#fff" : "#000"}
                        size={16}
                      />

                      <Text
                        style={[
                          globalStyles.secondaryButtonText,
                          {
                            color: state.hovered ? "#fff" : "#000",
                          },
                        ]}
                      >
                        Deletar
                      </Text>
                    </>
                  )}
                </Pressable>
              )}
            </View>
          </View>

          {/* Barra de progresso */}
          <View style={styles.progressContainer}>
            {porcentagemConclusaoRoadmap > 0 && (
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${porcentagemConclusaoRoadmap}%`,
                    backgroundColor: getProgressColor(
                      porcentagemConclusaoRoadmap,
                    ),
                  },
                ]}
              />
            )}
          </View>

          <Text style={styles.progressText}>
            {porcentagemConclusaoRoadmap.toFixed(0)}% concluído
          </Text>
        </View>

        {/* MENU */}
        <View style={styles.menu}>
          <TouchableOpacity
            onPress={() => selecionarAba("etapas")}
            style={[
              styles.menuItem,
              aba === "etapas"
                ? styles.menuItemSelecionado
                : styles.menuItemDesselecionado,
            ]}
          >
            <Text
              style={[
                styles.menuItemText,
                aba === "etapas"
                  ? styles.menuItemSelecionadoText
                  : styles.menuItemDesselecionadoText,
              ]}
            >
              Etapas do Roadmap
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selecionarAba("quizzes")}
            style={[
              styles.menuItem,
              aba === "quizzes"
                ? styles.menuItemSelecionado
                : styles.menuItemDesselecionado,
            ]}
          >
            <Text
              style={[
                styles.menuItemText,
                aba === "quizzes"
                  ? styles.menuItemSelecionadoText
                  : styles.menuItemDesselecionadoText,
              ]}
            >
              Quizzes e Avaliações
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selecionarAba("cadernoRevisao")}
            style={[
              styles.menuItem,
              aba === "cadernoRevisao"
                ? styles.menuItemSelecionado
                : styles.menuItemDesselecionado,
            ]}
          >
            <Text
              style={[
                styles.menuItemText,
                aba === "cadernoRevisao"
                  ? styles.menuItemSelecionadoText
                  : styles.menuItemDesselecionadoText,
              ]}
            >
              Caderno de Revisão
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => selecionarAba("cards")}
            style={[
              styles.menuItem,
              aba === "cards"
                ? styles.menuItemSelecionado
                : styles.menuItemDesselecionado,
            ]}
          >
            <Text
              style={[
                styles.menuItemText,
                aba === "cards"
                  ? styles.menuItemSelecionadoText
                  : styles.menuItemDesselecionadoText,
              ]}
            >
              Cards
            </Text>
          </TouchableOpacity>
        </View>

        {aba === "etapas" && (
          <Roadmap
            tipoItemASerExcluido={tipoItemASerExcluido}
            setTipoItemASerExcluido={setTipoItemASerExcluido}
            deleteModalVisible={deleteModalVisible}
            setDeleteModalVisible={setDeleteModalVisible}
            getData={getData}
            anotacoes={anotacoes}
            setAnotacoes={setAnotacoes}
            setEtapaSelecionada={setEtapaSelecionada}
          />
        )}

        {aba === "quizzes" && <Quizzes />}

        {aba === "cadernoRevisao" && <CadernoRevisao />}

        {aba === "cards" && <Cards />}

        <Modal
          visible={modalPraticarVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalPraticarVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitulo}>Praticar com cards</Text>

              <Text style={styles.modalDescricao}>
                Escolha quais cards deseja estudar.
              </Text>

              <TouchableOpacity
                style={[
                  styles.opcaoPratica,
                  tipoPratica === "roadmap" && styles.opcaoSelecionada,
                ]}
                onPress={() => setTipoPratica("roadmap")}
              >
                <View>
                  <Text style={styles.opcaoTitulo}>Roadmap completo</Text>
                  <Text style={styles.opcaoDescricao}>
                    Estudar cards de todas as etapas.
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.opcaoPratica,
                  tipoPratica === "etapas" && styles.opcaoSelecionada,
                ]}
                onPress={() => setTipoPratica("etapas")}
              >
                <View>
                  <Text style={styles.opcaoTitulo}>Etapas específicas</Text>
                  <Text style={styles.opcaoDescricao}>
                    Escolher quais etapas deseja estudar.
                  </Text>
                </View>
              </TouchableOpacity>

              {tipoPratica === "etapas" && (
                <ScrollView style={styles.listaEtapas}>
                  {roadmapContext?.etapas?.map((etapa) => {
                    const selecionada = etapasSelecionadas.includes(etapa.id);

                    return (
                      <TouchableOpacity
                        key={etapa.id}
                        style={styles.itemEtapa}
                        onPress={() => alternarEtapa(etapa.id)}
                      >
                        <View
                          style={[
                            styles.checkbox,
                            selecionada && styles.checkboxSelecionado,
                          ]}
                        >
                          {selecionada && (
                            <Text style={styles.checkboxTexto}>✓</Text>
                          )}
                        </View>

                        <Text style={styles.itemEtapaTexto}>
                          {etapa.titulo}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              )}

              <View style={styles.modalBotoes}>
                <TouchableOpacity
                  style={styles.botaoCancelar}
                  onPress={() => setModalPraticarVisible(false)}
                >
                  <Text style={styles.botaoCancelarTexto}>Cancelar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={globalStyles.buttonWithIcon}
                  onPress={iniciarPraticaCards}
                >
                  <Text style={globalStyles.buttonWithIconText}>Começar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>

      {praticandoCards && (
        <Modal
          visible={praticandoCards}
          transparent={true}
          animationType="fade"
          statusBarTranslucent
          onRequestClose={sairDaPratica}
        >
          <View style={styles.overlayPratica}>
            <View style={styles.praticaContainer}>
              <View style={styles.praticaHeader}>
                <TouchableOpacity
                  style={styles.botaoSairPratica}
                  onPress={sairDaPratica}
                >
                  <ArrowLeft size={18} color={colors.lightBlue} />
                  <Text style={styles.praticaVoltar}>Sair da prática</Text>
                </TouchableOpacity>

                {!praticaFinalizada && (
                  <Text style={styles.praticaProgresso}>
                    {indiceCardAtual + 1} / {cardsPratica.length}
                  </Text>
                )}
              </View>

              {!praticaFinalizada ? (
                <>
                  <View style={styles.progressoPraticaContainer}>
                    <View
                      style={[
                        styles.progressoPraticaBarra,
                        {
                          width: `${((indiceCardAtual + 1) / cardsPratica.length) * 100}%`,
                        },
                      ]}
                    />
                  </View>

                  <View style={styles.praticaConteudo}>
                    <View
                      style={{
                        flex: 1,
                        width: "100%",
                        justifyContent: "space-evenly",
                        alignItems: "center",
                        // gap: 16,
                      }}
                    >
                      <Text style={styles.praticaInstrucao}>
                        {respostaVisivel
                          ? "Confira a resposta e avalie seu resultado."
                          : "Leia a pergunta e tente lembrar da resposta."}
                      </Text>

                      <View style={styles.cardPraticaContainer}>
                        <Animated.View
                          style={[
                            styles.cardPratica,
                            styles.cardFrente,
                            {
                              transform: [
                                { perspective: 1000 },
                                { rotateY: rotacaoFrente },
                              ],
                            },
                          ]}
                        >
                          <Text style={styles.cardLegenda}>PERGUNTA</Text>
                          <Text style={styles.cardTexto}>
                            {cardAtual?.pergunta}
                          </Text>
                          <Text style={styles.cardDica}>
                            Pense na resposta antes de revelar.
                          </Text>
                        </Animated.View>

                        <Animated.View
                          style={[
                            styles.cardPratica,
                            styles.cardVerso,
                            {
                              transform: [
                                { perspective: 1000 },
                                { rotateY: rotacaoVerso },
                              ],
                            },
                          ]}
                        >
                          <Text style={styles.cardLegenda}>RESPOSTA</Text>
                          <Text style={styles.cardTexto}>
                            {cardAtual?.resposta}
                          </Text>
                        </Animated.View>
                      </View>
                    </View>

                    {!respostaVisivel ? (
                      <View style={styles.avaliacaoContainer}>
                        <Text style={styles.avaliacaoTitulo}> </Text>
                        <TouchableOpacity
                          style={[globalStyles.buttonWithIcon, { height: 40 }]}
                          onPress={virarCard}
                        >
                          <Text style={globalStyles.buttonWithIconText}>
                            Revelar resposta
                          </Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View style={styles.avaliacaoContainer}>
                        <Text style={styles.avaliacaoTitulo}>
                          Você acertou?
                        </Text>

                        <View style={styles.avaliacaoBotoes}>
                          <TouchableOpacity
                            style={[styles.botaoAvaliacao, styles.botaoAcerto]}
                            onPress={() => registrarResposta(true)}
                          >
                            <Text style={styles.botaoAvaliacaoTexto}>
                              ✓ Acertei
                            </Text>
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={[styles.botaoAvaliacao, styles.botaoErro]}
                            onPress={() => registrarResposta(false)}
                          >
                            <Text style={styles.botaoAvaliacaoTexto}>
                              ✕ Errei
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                </>
              ) : (
                <View style={styles.praticaFinalizada}>
                  <View style={styles.iconeConclusao}>
                    <Text style={styles.iconeConclusaoTexto}>✓</Text>
                  </View>

                  <Text style={styles.praticaTitulo}>Prática concluída!</Text>

                  <Text style={styles.praticaDescricao}>
                    Você revisou todos os {cardsPratica.length} cards
                    selecionados.
                  </Text>

                  <View style={styles.resultadoResumo}>
                    <View style={styles.resultadoItem}>
                      <Text style={styles.resultadoNumero}>
                        {resultadosPratica.filter((r) => r.acertou).length}
                      </Text>
                      <Text style={styles.resultadoLegenda}>Acertos</Text>
                    </View>

                    <View style={styles.resultadoDivisor} />

                    <View style={styles.resultadoItem}>
                      <Text style={styles.resultadoNumero}>
                        {resultadosPratica.filter((r) => !r.acertou).length}
                      </Text>
                      <Text style={styles.resultadoLegenda}>Revisar</Text>
                    </View>
                  </View>

                  <TouchableOpacity
                    style={styles.botaoVoltarRoadmap}
                    onPress={sairDaPratica}
                  >
                    <Text style={styles.botaoVoltarRoadmapTexto}>
                      Voltar ao roadmap
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </Modal>
      )}
    </>
  ) : null;
}

const styles = StyleSheet.create({
  buttonWithIcon: {
    height: 48,
    backgroundColor: "transparent",
    alignSelf: "flex-start",
    paddingHorizontal: 0,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 600,
    color: "black",
  },

  nivel: {
    fontSize: 18,
    color: "#5a5a5a",
  },

  descricao: {
    color: "#5a5a5a",
  },

  progressContainer: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: colors.green,
  },

  progressText: {
    color: "#5a5a5a",
  },

  menu: {
    justifyContent: "space-between",
    gap: 12,
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    backgroundColor: "#e7eaee",
  },

  menuItem: {
    flex: 1,
    gap: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  menuItemText: {
    fontWeight: 500,
  },

  menuItemSelecionado: {
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
    backgroundColor: "white",
  },

  menuItemSelecionadoText: {},

  menuItemDesselecionado: {},

  menuItemDesselecionadoText: {
    color: "#777879",
  },

  adicionarNovoButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "lime",
    backgroundColor: colors.darkBlue,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
  },

  inputContainer: {
    gap: 6,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },

  input: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 18,
    color: "#000",
    backgroundColor: "#fff",
  },

  inputDescricao: {
    minHeight: 80,
    fontSize: 16,
    textAlignVertical: "top",
  },
  headerActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },

  voltarTexto: {
    color: "black",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 12,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalContainer: {
    backgroundColor: "#fff",
    width: "100%",
    maxWidth: 500,
    maxHeight: "85%",
    borderRadius: 16,
    padding: 24,
    gap: 16,
  },

  modalTitulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  modalDescricao: {
    fontSize: 14,
    color: "#6b7280",
  },

  opcaoPratica: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
  },

  opcaoSelecionada: {
    borderColor: colors.darkBlue,
    backgroundColor: "#eff6ff",
  },

  opcaoTitulo: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  opcaoDescricao: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },

  listaEtapas: {
    maxHeight: 180,
  },

  itemEtapa: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },

  itemEtapaTexto: {
    fontSize: 14,
    color: "#374151",
  },

  checkbox: {
    width: 22,
    height: 22,
    borderWidth: 1,
    borderColor: "#9ca3af",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  checkboxSelecionado: {
    backgroundColor: colors.lightBlue,
    borderColor: colors.lightBlue,
  },

  checkboxTexto: {
    color: "#fff",
    fontWeight: "700",
  },

  modalBotoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 8,
  },

  botaoCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: "#e5e7eb",
  },

  botaoCancelarTexto: {
    color: "#374151",
    fontWeight: "600",
  },

  botaoConfirmar: {
    paddingHorizontal: 20,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: colors.darkBlue,
  },

  botaoConfirmarTexto: {
    color: "#fff",
    fontWeight: "600",
  },
  telaPratica: {
    height: "80%",
    width: "100%",
    maxWidth: 1350,
    alignSelf: "center",
    paddingVertical: 20,
    gap: 24,
  },

  overlayPratica: {
    flex: 1,
    backgroundColor: "rgba(10, 15, 30, 0.78)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  praticaContainer: {
    width: "100%",
    maxWidth: 850,
    height: "85%",
    maxHeight: 750,
    backgroundColor: "#f9fafb",
    borderRadius: 24,
    padding: 28,
    gap: 22,
    boxShadow: "0px 12px 40px rgba(0,0,0,0.25)",
  },

  praticaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  botaoSairPratica: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },

  praticaVoltar: {
    color: colors.darkBlue,
    fontSize: 15,
    fontWeight: "600",
  },

  praticaProgresso: {
    color: "#6b7280",
    fontSize: 14,
    fontWeight: "700",
  },

  progressoPraticaContainer: {
    height: 7,
    backgroundColor: "#e5e7eb",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressoPraticaBarra: {
    height: "100%",
    backgroundColor: colors.lightBlue,
    borderRadius: 10,
  },

  praticaConteudo: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 28,
  },

  praticaInstrucao: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  cardPraticaContainer: {
    width: "100%",
    maxWidth: 650,
    height: 350,
    position: "relative",
  },

  cardPratica: {
    position: "absolute",
    width: "100%",
    height: "100%",
    borderRadius: 20,
    padding: 32,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
    boxShadow: "0px 5px 18px rgba(0,0,0,0.09)",
  },

  cardFrente: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },

  cardVerso: {
    backgroundColor: "#eff6ff",
    borderWidth: 1,
    borderColor: colors.lightBlue,
  },

  cardLegenda: {
    position: "absolute",
    top: 24,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 2,
    color: colors.darkBlue,
  },

  cardTexto: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1f2937",
    textAlign: "center",
    lineHeight: 32,
  },

  cardDica: {
    position: "absolute",
    bottom: 22,
    fontSize: 13,
    color: "#9ca3af",
  },

  botaoRevelar: {
    width: "100%",
    maxWidth: 300,
    paddingVertical: 15,
    borderRadius: 12,
    backgroundColor: colors.darkBlue,
    alignItems: "center",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.12)",
  },

  botaoRevelarTexto: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },

  avaliacaoContainer: {
    width: "100%",
    maxWidth: 450,
    alignItems: "center",
    gap: 16,
  },

  avaliacaoTitulo: {
    fontSize: 17,
    fontWeight: "600",
    color: "#374151",
  },

  avaliacaoBotoes: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },

  botaoAvaliacao: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  botaoAcerto: {
    backgroundColor: "#16a34a",
  },

  botaoErro: {
    backgroundColor: "#dc2626",
  },

  botaoAvaliacaoTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
  },

  praticaFinalizada: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 18,
  },

  iconeConclusao: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#dcfce7",
    alignItems: "center",
    justifyContent: "center",
  },

  iconeConclusaoTexto: {
    fontSize: 40,
    fontWeight: "700",
    color: "#16a34a",
  },

  praticaTitulo: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.darkBlue,
    textAlign: "center",
  },

  praticaDescricao: {
    fontSize: 16,
    color: "#6b7280",
    textAlign: "center",
  },

  resultadoResumo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f3f4f6",
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 35,
    gap: 35,
    marginTop: 10,
  },

  resultadoItem: {
    alignItems: "center",
    gap: 5,
  },

  resultadoNumero: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.darkBlue,
  },

  resultadoLegenda: {
    fontSize: 13,
    color: "#6b7280",
  },

  resultadoDivisor: {
    width: 1,
    height: 40,
    backgroundColor: "#d1d5db",
  },

  botaoVoltarRoadmap: {
    marginTop: 12,
    backgroundColor: colors.darkBlue,
    paddingHorizontal: 28,
    paddingVertical: 15,
    borderRadius: 10,
  },

  botaoVoltarRoadmapTexto: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
