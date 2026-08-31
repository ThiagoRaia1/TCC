import { Feather } from "@expo/vector-icons";
import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Linking,
} from "react-native";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../context/providers/loading";
import { IEtapa } from "../../../interfaces/etapa";
import { IUpdateRoadmap, IRoadmap } from "../../../interfaces/roadmap";
import { deleteObjetivo } from "../../../services/objetivo";
import {
  updateRoadmap,
  getRoadmap,
  salvarAnotacao,
} from "../../../services/roadmap";
import { colors } from "../../../styles/colors";
import Editor from "../../_components/dom-components/hello-dom";
import MenuOptionButton from "../../_components/MenuOptionButton";
import {
  ArrowLeft,
  BookOpen,
  Check,
  ChevronDown,
  ChevronUp,
  CircleX,
  EllipsisVertical,
  Globe,
  Link,
  Newspaper,
  Pencil,
  Save,
  ScrollText,
  Trash2,
  Video,
} from "lucide-react-native";
import AdicionarEtapaModal from "./AdicionarEtapaModal";
import DeleteModal from "./DeleteModal";

export default function Visualizar() {
  const { id } = useLocalSearchParams();
  const globalStyles = getGlobalStyles();
  const [roadmap, setRoadmap] = useState<IRoadmap>();
  const [menuSelecionado, setMenuSelecionado] = useState<"Etapas" | "Quizzes">(
    "Etapas",
  );

  const { showLoading, hideLoading } = useLoading();
  const [anotacoes, setAnotacoes] = useState<{
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
      alterado: boolean;
    };
  }>({});

  const [objetivoTituloEditInput, setObjetivoTituloEditInput] =
    useState<string>("");
  const [objetivoDescricaoEditInput, setObjetivoDescricaoEditInput] =
    useState<string>("");

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [tipoItemASerExcluido, setTipoItemASerExcluido] = useState<
    "roadmap" | "etapa" | "objetivo"
  >("roadmap");
  const [etapaSelecionada, setEtapaSelecionada] = useState<IEtapa>();

  const [adicionandoEtapaModal, setAdicionandoEtapaModal] =
    useState<boolean>(false);

  const tiposReferencia = [
    {
      tipo: "Artigo",
      icon: <ScrollText color={"black"} size={16} />,
    },
    {
      tipo: "Vídeo",
      icon: <Video color={"black"} size={16} />,
    },
    {
      tipo: "Livro",
      icon: <BookOpen color={"black"} size={16} />,
    },
    {
      tipo: "Site",
      icon: <Globe color={"black"} size={16} />,
    },
    {
      tipo: "Notícia",
      icon: <Newspaper color={"black"} size={16} />,
    },
    {
      tipo: "Outro",
      icon: <EllipsisVertical color={"black"} size={16} />,
    },
  ];

  const getIconReferencia = (tipoReferencia?: string) => {
    switch (tipoReferencia) {
      case tiposReferencia[0].tipo:
        return tiposReferencia[0].icon;

      case tiposReferencia[1].tipo:
        return tiposReferencia[1].icon;

      case tiposReferencia[2].tipo:
        return tiposReferencia[2].icon;

      case tiposReferencia[3].tipo:
        return tiposReferencia[3].icon;

      case tiposReferencia[4].tipo:
        return tiposReferencia[4].icon;

      default:
        return tiposReferencia[5].icon;
    }
  };

  const getData = async () => {
    showLoading();
    const resultado = await getRoadmap(Number(id));
    setRoadmap(resultado);

    const anotacoesIniciais: {
      [etapaId: number]: {
        plainText: string;
        editorState: string | null;
        alterado: boolean;
      };
    } = {};

    resultado.etapas.forEach((etapa) => {
      anotacoesIniciais[etapa.id] = {
        plainText: etapa.anotacoes?.plainText ?? "",
        editorState: etapa.anotacoes?.editorState ?? null,
        alterado: false,
      };
    });

    setAnotacoes(anotacoesIniciais);
    hideLoading();
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (roadmap) calcularProgresso(roadmap);
  }, [roadmap]);

  useEffect(() => {
    if (!adicionandoEtapaModal) {
      getData();
    }
  }, [adicionandoEtapaModal]);

  const [adicionandoObjetivo, setAdicionandoObjetivo] = useState<number[]>([]);

  const [tituloNovoObjetivo, setTituloNovoObjetivo] = useState<{
    [etapaId: number]: string;
  }>({});

  const [descricaoNovoObjetivo, setDescricaoNovoObjetivo] = useState<{
    [etapaId: number]: string;
  }>({});

  const atualizarAnotacao = (
    etapaId: number,
    dados: {
      plainText?: string;
      editorState?: string | null;
    },
  ) => {
    setAnotacoes((prev) => {
      const atual = prev[etapaId] || {
        plainText: "",
        editorState: null,
        alterado: false,
      };

      return {
        ...prev,
        [etapaId]: {
          plainText: dados.plainText ?? atual.plainText,
          editorState: dados.editorState ?? atual.editorState,
          alterado: true,
        },
      };
    });
  };

  const [idObjetivoSendoEditado, setIdObjetivoSendoEditado] =
    useState<number>();

  const [etapasAbertas, setEtapasAbertas] = useState<number[]>([]);
  const [objetivosAbertos, setObjetivosAbertos] = useState<number[]>([]);

  const toggleEtapa = (id: number) => {
    setEtapasAbertas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const toggleAbrirObjetivo = (id: number) => {
    setObjetivosAbertos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleEditAnotacaoEtapa = async (etapaId: number) => {
    try {
      setAnotacoes((prev) => ({
        ...prev,
        [etapaId]: {
          ...prev[etapaId],
          alterado: false,
        },
      }));

      const anotacao = anotacoes[etapaId];
      if (!anotacao) return;
      const atualizarAnotacao = await salvarAnotacao(etapaId, {
        plainText: anotacao.plainText,
        editorState: anotacao.editorState,
      });
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  const toggleAdicionandoObjetivo = (id: number) => {
    setAdicionandoObjetivo((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const calcularProgressoEtapa = (etapa: IEtapa): number => {
    const total = etapa.objetivos.length;
    if (total === 0) return 0;

    const concluidos = etapa.objetivos.filter((o) => o.concluido).length;
    return (concluidos / total) * 100;
  };

  const toggleObjetivo = async (etapaId: number, objetivoId: number) => {
    try {
      // showLoading();
      if (!roadmap) return;

      const novoRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => {
          if (etapa.id !== etapaId) return etapa;

          return {
            ...etapa,
            objetivos: etapa.objetivos.map((obj) => {
              if (obj.id !== objetivoId) return obj;

              return {
                ...obj,
                concluido: !obj.concluido,
              };
            }),
          };
        }),
      };

      const resultado = await updateRoadmap(novoRoadmap);

      setRoadmap(novoRoadmap);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      // hideLoading();
    }
  };

  const criarNovoObjetivo = async (etapaId: number) => {
    try {
      if (!roadmap) return;

      const titulo = tituloNovoObjetivo[etapaId]?.trim();
      const descricao = descricaoNovoObjetivo[etapaId]?.trim();

      if (!titulo || !descricao) return;

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => {
          if (etapa.id !== etapaId) return etapa;

          return {
            ...etapa,
            objetivos: [
              ...etapa.objetivos,
              {
                titulo,
                descricao,
                concluido: false,
              },
            ],
          };
        }),
      };

      const atualizado = await updateRoadmap(novoRoadmap);

      setRoadmap(atualizado);

      // Limpa título
      setTituloNovoObjetivo((prev) => ({
        ...prev,
        [etapaId]: "",
      }));

      // Limpa descrição
      setDescricaoNovoObjetivo((prev) => ({
        ...prev,
        [etapaId]: "",
      }));

      // Fecha formulário
      toggleAdicionandoObjetivo(etapaId);
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  const calcularProgresso = (roadmap: IRoadmap | null) => {
    if (!roadmap) return 0;
    const total = roadmap.etapas.flatMap((e) => e.objetivos).length;
    const concluidos = roadmap.etapas
      .flatMap((e) => e.objetivos)
      .filter((o) => o.concluido).length;

    if (total === 0) return 0;

    return (concluidos / total) * 100;
  };

  const porcentagemConclusaoRoadmap: number = roadmap
    ? calcularProgresso(roadmap)
    : 0;

  const addAnotacaoObjetivo = (objetivoId: number) => {};

  const handleEditObjetivo = async (objetivoId: number) => {
    try {
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  const handleDeleteObjetivo = async (objetivoId: number) => {
    try {
      showLoading();

      if (!roadmap) return;

      await deleteObjetivo(objetivoId);

      const novoRoadmap: IRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => ({
          ...etapa,
          objetivos: etapa.objetivos.filter(
            (objetivo) => objetivo.id !== objetivoId,
          ),
        })),
      };

      setRoadmap(novoRoadmap);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const getProgressColor = (porcentagem: number) => {
    if (porcentagem <= 25) {
      // Vermelho -> Laranja
      const t = porcentagem / 25;

      const r = 239;
      const g = Math.round(68 + t * (130 - 68));
      const b = Math.round(68 - t * 68);

      return `rgb(${r}, ${g}, ${b})`;
    }

    if (porcentagem <= 50) {
      // Laranja -> Amarelo
      const t = (porcentagem - 25) / 25;

      const r = Math.round(239 + t * (234 - 239));
      const g = Math.round(130 + t * (179 - 130));
      const b = Math.round(0 + t * 8);

      return `rgb(${r}, ${g}, ${b})`;
    }

    if (porcentagem <= 75) {
      // Amarelo -> Verde claro
      const t = (porcentagem - 50) / 25;

      const r = Math.round(234 - t * (234 - 76));
      const g = Math.round(179 + t * (175 - 179));
      const b = Math.round(8 + t * (80 - 8));

      return `rgb(${r}, ${g}, ${b})`;
    }

    // Verde claro -> Verde
    const t = (porcentagem - 75) / 25;

    const r = Math.round(76 - t * 76);
    const g = Math.round(175 + t * (175 - 175));
    const b = Math.round(80 - t * 80);

    return `rgb(${r}, ${g}, ${b})`;
  };

  const openDeleteModal = (
    tipoItem: "roadmap" | "etapa" | "objetivo",
    etapa?: IEtapa,
  ) => {
    if (etapa) setEtapaSelecionada(etapa);
    setTipoItemASerExcluido(tipoItem);
    setDeleteModalVisible(true);
  };

  return roadmap ? (
    <View
      style={{
        maxWidth: 844,
        paddingHorizontal: 8,
        gap: 32,
        paddingVertical: 40,
        width: "100%",
        alignSelf: "center",
        flex: 1,
      }}
    >
      {deleteModalVisible && (
        <DeleteModal
          closeModal={() => setDeleteModalVisible(false)}
          roadmap={roadmap}
          tipoItem={tipoItemASerExcluido}
          etapa={etapaSelecionada}
        />
      )}

      <TouchableOpacity // VOLTAR AO DASHBOARD
        style={[globalStyles.buttonWithIcon, styles.buttonWithIcon]}
        onPress={() => {
          router.push("/roadmap");
        }}
      >
        <ArrowLeft size={20} style={{ marginTop: 4 }} color={"black"} />
        <Text
          style={[
            globalStyles.buttonWithIconText,
            { color: "black", fontSize: 16 },
          ]}
        >
          Voltar ao dashboard
        </Text>
      </TouchableOpacity>

      {/* HEADER DO ROADMAP*/}
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.titulo}>{roadmap.tema}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 20,
            }}
          >
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  backgroundColor: state.hovered ? colors.lightBlue : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                },
              ]}
            >
              {(state: any) => (
                <>
                  <Pencil color={state.hovered ? "#fff" : "#000"} size={16} />
                  <Text
                    style={[
                      globalStyles.secondaryButtonText,
                      { color: state.hovered ? "#FFF" : "#000" },
                    ]}
                  >
                    Editar
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  backgroundColor: state.hovered ? "#ef4444" : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                },
              ]}
              onPress={() => openDeleteModal("roadmap")}
            >
              {(state: any) => (
                <>
                  <Trash2 color={state.hovered ? "#fff" : "#000"} size={16} />
                  <Text
                    style={[
                      globalStyles.secondaryButtonText,
                      { color: state.hovered ? "#fff" : "#000" },
                    ]}
                  >
                    Deletar
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
        <Text style={styles.nivel}>Nível: {roadmap.nivel}</Text>
        <Text style={styles.descricao}>
          {roadmap.descricaoGeral ? (
            roadmap.descricaoGeral
          ) : (
            <i>Este roadmap ainda não possui descrição.</i>
          )}
        </Text>

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
          onPress={() => setMenuSelecionado("Etapas")}
          style={[
            styles.menuItem,
            menuSelecionado == "Etapas"
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == "Etapas"
                ? styles.menuItemSelecionadoText
                : styles.menuItemDesselecionadoText,
            ]}
          >
            Etapas do Roadmap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuSelecionado("Quizzes")}
          style={[
            styles.menuItem,
            menuSelecionado == "Quizzes"
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == "Quizzes"
                ? styles.menuItemSelecionadoText
                : styles.menuItemDesselecionadoText,
            ]}
          >
            Quizzes e Avaliações
          </Text>
        </TouchableOpacity>
      </View>

      {/* Etapas */}
      <View style={{ gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text style={styles.titulo}>Etapas</Text>
          {!adicionandoEtapaModal && (
            <TouchableOpacity
              style={{
                backgroundColor: colors.lightBlue,
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 12,
              }}
              onPress={() => setAdicionandoEtapaModal(true)}
            >
              <Text style={{ color: "white" }}>+ Adicionar Etapa</Text>
            </TouchableOpacity>
          )}
        </View>

        {adicionandoEtapaModal && (
          <AdicionarEtapaModal
            closeModal={() => setAdicionandoEtapaModal(false)}
            roadmap={roadmap}
          />
        )}

        {roadmap.etapas.length != 0
          ? roadmap.etapas
              .sort((a, b) => a.ordem - b.ordem)
              .map((etapa) => {
                const aberta = etapasAbertas.includes(etapa.id);
                const anotacaoEtapa = anotacoes[etapa.id];
                const alterado = !!anotacaoEtapa?.alterado;

                const etapaAdicionandoNovoObjetivo =
                  adicionandoObjetivo.includes(etapa.id);

                return (
                  <View key={etapa.id} style={styles.card}>
                    {/* Header da etapa */}
                    <Pressable
                      style={styles.etapaHeader}
                      onPress={() => toggleEtapa(etapa.id)}
                    >
                      <View style={{ flex: 1, gap: 8 }}>
                        <View // ORDEM TITULO DESCRICAO BOTOES DE ACAO
                          style={{ flexDirection: "row", gap: 20 }}
                        >
                          <View // ORDEM, TITULO E DESCRICAO
                            style={{
                              justifyContent: "space-between",
                              flex: 1,
                              gap: 4,
                            }}
                          >
                            <View style={{ flexDirection: "row", gap: 8 }}>
                              {aberta ? (
                                <ChevronUp
                                  color={"black"}
                                  style={{
                                    marginLeft: -8,
                                    alignSelf: "flex-start",
                                  }}
                                />
                              ) : (
                                <ChevronDown
                                  color={"black"}
                                  style={{
                                    marginLeft: -8,
                                    alignSelf: "flex-start",
                                  }}
                                />
                              )}
                              <Text
                                style={styles.etapaTitulo}
                                selectable={false}
                              >
                                {etapa.ordem}. {etapa.titulo}
                              </Text>
                            </View>
                            <Text
                              style={styles.etapaDescricao}
                              selectable={false}
                            >
                              {etapa.descricao != "" ? (
                                etapa.descricao
                              ) : (
                                <i>Esta etapa ainda não possui descrição.</i>
                              )}
                            </Text>
                          </View>

                          <View // BOTOES DE ACAO
                            style={{
                              flexDirection: "row",
                              justifyContent: "flex-end",
                              gap: 12,
                              alignItems: "flex-start",
                            }}
                          >
                            <Pressable
                              style={(state: any) => [
                                globalStyles.secondaryButton,
                                {
                                  paddingVertical: 8,
                                  width: 40,
                                  backgroundColor: state.hovered
                                    ? colors.lightBlue
                                    : "#fff",
                                  transitionProperty: "background-color",
                                  transitionDuration: "200ms",
                                  transitionTimingFunction: "ease-in-out",
                                },
                              ]}
                            >
                              {(state: any) => (
                                <Pencil
                                  color={state.hovered ? "#fff" : "#000"}
                                  size={16}
                                />
                              )}
                            </Pressable>

                            <Pressable
                              style={(state: any) => [
                                globalStyles.secondaryButton,
                                {
                                  paddingVertical: 8,
                                  width: 40,
                                  backgroundColor: state.hovered
                                    ? "#ef4444"
                                    : "#fff",
                                  transitionProperty: "background-color",
                                  transitionDuration: "200ms",
                                  transitionTimingFunction: "ease-in-out",
                                },
                              ]}
                              onPress={() => openDeleteModal("etapa", etapa)}
                            >
                              {(state: any) => (
                                <Trash2
                                  color={state.hovered ? "#fff" : "#000"}
                                  size={16}
                                />
                              )}
                            </Pressable>
                          </View>
                        </View>

                        {/* Barra de progresso da etapa no header */}
                        <View style={styles.progressContainerEtapa}>
                          <View
                            style={[
                              styles.progressBarEtapa,
                              {
                                width: `${calcularProgressoEtapa(etapa)}%`,
                                backgroundColor: getProgressColor(
                                  calcularProgressoEtapa(etapa),
                                ),
                              },
                            ]}
                          />
                        </View>

                        <Text style={styles.progressTextEtapa}>
                          {calcularProgressoEtapa(etapa).toFixed(0)}% da etapa
                        </Text>
                      </View>
                    </Pressable>

                    {/* Etapa expandida */}
                    {aberta && (
                      <View style={styles.etapaContent}>
                        {/* Objetivos */}
                        {[...etapa.objetivos]
                          .sort((a, b) => a.id - b.id)
                          .map((obj) => {
                            const objetivoEstaSendoEditado: boolean =
                              obj.id === idObjetivoSendoEditado;

                            const objetivoAberto = objetivosAbertos.includes(
                              obj.id,
                            );

                            return (
                              <Pressable // OBJETIVO ROW
                                key={obj.id}
                                style={(state: any) => [
                                  state.hovered && {
                                    backgroundColor: "#F1F5F9",
                                  },
                                  styles.objetivoRow,
                                  {
                                    transitionProperty: "background-color",
                                    transitionDuration: "200ms",
                                    transitionTimingFunction: "ease-in-out",
                                    gap: 20,
                                    flexDirection: "column",
                                  },
                                  objetivoEstaSendoEditado && [
                                    {
                                      cursor: "default",
                                    },
                                    globalStyles.slashedBorder,
                                  ],
                                ]}
                                onPress={() => {
                                  // CONCLUIR OBJETIVO
                                  if (!objetivoEstaSendoEditado)
                                    toggleObjetivo(etapa.id, obj.id);
                                }}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection: "row",
                                    width: "100%",
                                    padding: 4,
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                >
                                  {/* OBJETIVO */}
                                  {objetivoEstaSendoEditado ? (
                                    // FIX ME: EDITANDO OBJETIVO
                                    <View
                                      style={{
                                        flex: 1,
                                        gap: 20,
                                        paddingHorizontal: 12,
                                        paddingTop: 12,
                                      }}
                                    >
                                      <View style={{ gap: 4 }}>
                                        <Text style={styles.objetivoEditLabel}>
                                          Título: *
                                        </Text>
                                        <TextInput
                                          style={[
                                            globalStyles.input,
                                            {
                                              flex: 1,
                                              backgroundColor: "white",
                                              color: "black",
                                            },
                                          ]}
                                          value={objetivoTituloEditInput}
                                        />
                                      </View>

                                      <View style={{ gap: 4 }}>
                                        <Text style={styles.objetivoEditLabel}>
                                          Descrição (opcional):
                                        </Text>
                                        <TextInput
                                          style={[
                                            globalStyles.input,
                                            {
                                              flex: 1,
                                              backgroundColor: "white",
                                              color: "black",
                                            },
                                          ]}
                                          value={objetivoDescricaoEditInput}
                                        />
                                      </View>
                                    </View>
                                  ) : (
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        gap: 8,
                                      }}
                                    >
                                      <View style={styles.check}>
                                        {obj.concluido && (
                                          <Check
                                            color={colors.lightBlue}
                                            style={{ backgroundColor: "white" }}
                                          />
                                        )}
                                      </View>
                                      <View style={{ gap: 4 }}>
                                        <Text
                                          style={styles.objetivoTituloText}
                                          selectable={false}
                                        >
                                          {obj.titulo}
                                        </Text>
                                        <Text
                                          style={styles.objetivoDescricaoText}
                                          selectable={false}
                                        >
                                          {obj.descricao != "" ? (
                                            obj.descricao
                                          ) : (
                                            <i>
                                              Este objetivo ainda não possui
                                              descrição.
                                            </i>
                                          )}
                                        </Text>
                                      </View>
                                    </View>
                                  )}

                                  {/* ROW BOTAO EDITAR/EXCLUIR */}
                                  {!objetivoEstaSendoEditado && (
                                    <View
                                      style={{
                                        flexDirection: "row",
                                        gap: 8,
                                        marginLeft: 8,
                                        justifyContent: "flex-end",
                                        marginRight: 8,
                                        alignSelf: "flex-end",
                                      }}
                                    >
                                      {/* BOTAO EDITAR OBJETIVO */}
                                      <Pressable
                                        style={(state: any) => [
                                          globalStyles.secondaryButton,
                                          {
                                            paddingVertical: 8,
                                            width: 40,
                                            height: 32,
                                            backgroundColor: state.hovered
                                              ? colors.lightBlue
                                              : "#fff",
                                            transitionProperty:
                                              "background-color",
                                            transitionDuration: "200ms",
                                            transitionTimingFunction:
                                              "ease-in-out",
                                          },
                                        ]}
                                        onPress={() => {
                                          setIdObjetivoSendoEditado(obj.id);
                                          setObjetivoTituloEditInput(
                                            obj.titulo,
                                          );
                                          setObjetivoDescricaoEditInput(
                                            obj.descricao,
                                          );
                                        }}
                                      >
                                        {(state: any) => (
                                          <Pencil
                                            color={
                                              state.hovered ? "#fff" : "#000"
                                            }
                                            size={16}
                                          />
                                        )}
                                      </Pressable>

                                      {/* BOTAO DELETAR OBJETIVO */}
                                      <Pressable
                                        style={(state: any) => [
                                          globalStyles.secondaryButton,
                                          {
                                            paddingVertical: 8,
                                            width: 40,
                                            height: 32,
                                            backgroundColor: state.hovered
                                              ? "#ef4444"
                                              : "#fff",
                                            transitionProperty:
                                              "background-color",
                                            transitionDuration: "200ms",
                                            transitionTimingFunction:
                                              "ease-in-out",
                                          },
                                        ]}
                                        onPress={() => {
                                          handleDeleteObjetivo(obj.id);
                                        }}
                                      >
                                        {(state: any) => (
                                          <Trash2
                                            color={
                                              state.hovered ? "#fff" : "#000"
                                            }
                                            size={16}
                                          />
                                        )}
                                      </Pressable>

                                      {objetivoAberto ? (
                                        <Pressable
                                          style={(state: any) => [
                                            globalStyles.secondaryButton,
                                            {
                                              width: 40,
                                              height: 32,
                                              paddingHorizontal: 0,
                                              backgroundColor: state.hovered
                                                ? "#c9cccf"
                                                : "#fff",
                                              transitionProperty:
                                                "background-color",
                                              transitionDuration: "200ms",
                                              transitionTimingFunction:
                                                "ease-in-out",
                                              overflow: "hidden",
                                            },
                                          ]}
                                          onPress={() =>
                                            toggleAbrirObjetivo(obj.id)
                                          }
                                        >
                                          <ChevronUp color={"black"} />
                                        </Pressable>
                                      ) : (
                                        <Pressable
                                          style={(state: any) => [
                                            globalStyles.secondaryButton,
                                            {
                                              width: 40,
                                              height: 32,
                                              paddingHorizontal: 0,
                                              backgroundColor: state.hovered
                                                ? "#c9cccf"
                                                : "#fff",
                                              transitionProperty:
                                                "background-color",
                                              transitionDuration: "200ms",
                                              transitionTimingFunction:
                                                "ease-in-out",
                                              overflow: "hidden",
                                            },
                                          ]}
                                          onPress={() =>
                                            toggleAbrirObjetivo(obj.id)
                                          }
                                        >
                                          <ChevronDown color={"black"} />
                                        </Pressable>
                                      )}
                                    </View>
                                  )}
                                </View>

                                {/* ROW BOTAO SALVAR/CANCELAR */}
                                {objetivoEstaSendoEditado && (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      gap: 8,
                                      marginLeft: 8,
                                      justifyContent: "flex-end",
                                      marginRight: 8,
                                      alignSelf: "flex-end",
                                    }}
                                  >
                                    {/* BOTAO SALVAR OBJETIVO */}
                                    <Pressable
                                      style={(state: any) => [
                                        globalStyles.secondaryButton,
                                        {
                                          paddingVertical: 8,
                                          width: 40,
                                          height: 32,
                                          backgroundColor: state.hovered
                                            ? colors.green
                                            : "#fff",
                                          transitionProperty:
                                            "background-color",
                                          transitionDuration: "200ms",
                                          transitionTimingFunction:
                                            "ease-in-out",
                                        },
                                      ]}
                                      onPress={() => {
                                        // FIX ME: ADCIONAR FUNCAO DE EDITAR OBJETIVO
                                        setIdObjetivoSendoEditado(0);
                                      }}
                                    >
                                      {(state: any) => (
                                        <Save
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )}
                                    </Pressable>

                                    {/* BOTAO CANCELAR OBJETIVO */}
                                    <Pressable
                                      style={(state: any) => [
                                        globalStyles.secondaryButton,
                                        {
                                          paddingVertical: 8,
                                          width: 40,
                                          height: 32,
                                          backgroundColor: state.hovered
                                            ? "#ef4444"
                                            : "#fff",
                                          transitionProperty:
                                            "background-color",
                                          transitionDuration: "200ms",
                                          transitionTimingFunction:
                                            "ease-in-out",
                                        },
                                      ]}
                                      onPress={() => {
                                        setIdObjetivoSendoEditado(0);
                                      }}
                                    >
                                      {(state: any) => (
                                        <CircleX
                                          color={
                                            state.hovered ? "#fff" : "#000"
                                          }
                                          size={16}
                                        />
                                      )}
                                    </Pressable>

                                    {objetivoAberto ? (
                                      <Pressable
                                        style={(state: any) => [
                                          globalStyles.secondaryButton,
                                          {
                                            width: 40,
                                            height: 32,
                                            paddingHorizontal: 0,
                                            backgroundColor: state.hovered
                                              ? "#c9cccf"
                                              : "#fff",
                                            transitionProperty:
                                              "background-color",
                                            transitionDuration: "200ms",
                                            transitionTimingFunction:
                                              "ease-in-out",
                                            overflow: "hidden",
                                          },
                                        ]}
                                        onPress={() =>
                                          toggleAbrirObjetivo(obj.id)
                                        }
                                      >
                                        <ChevronUp color={"black"} />
                                      </Pressable>
                                    ) : (
                                      <Pressable
                                        style={(state: any) => [
                                          globalStyles.secondaryButton,
                                          {
                                            width: 40,
                                            height: 32,
                                            paddingHorizontal: 0,
                                            backgroundColor: state.hovered
                                              ? "#c9cccf"
                                              : "#fff",
                                            transitionProperty:
                                              "background-color",
                                            transitionDuration: "200ms",
                                            transitionTimingFunction:
                                              "ease-in-out",
                                            overflow: "hidden",
                                          },
                                        ]}
                                        onPress={() =>
                                          toggleAbrirObjetivo(obj.id)
                                        }
                                      >
                                        <ChevronDown color={"black"} />
                                      </Pressable>
                                    )}
                                  </View>
                                )}

                                {objetivoAberto && (
                                  <Pressable
                                    style={{
                                      width: "100%",
                                      cursor: "default" as any,
                                      paddingHorizontal: 12,
                                      gap: 12,
                                    }}
                                    onPress={(e) => e.stopPropagation()}
                                  >
                                    <View
                                      style={{
                                        width: "100%",
                                      }}
                                    >
                                      <Text style={styles.objetivoTituloText}>
                                        Anotações do objetivo
                                      </Text>
                                      <TextInput
                                        style={[
                                          globalStyles.input,
                                          { margin: 12 },
                                        ]}
                                        numberOfLines={5}
                                        multiline
                                        placeholder="Adicione aqui as anotações do objetivo!"
                                        placeholderTextColor={
                                          colors.placeholderTextColor
                                        }
                                      />
                                    </View>

                                    <View
                                      style={{
                                        width: "100%",
                                        cursor: "default" as any,
                                      }}
                                    >
                                      <Text style={styles.objetivoTituloText}>
                                        Referências e Materiais
                                      </Text>
                                      <View
                                        style={{
                                          flexDirection: "row",
                                          justifyContent: "space-between",
                                          gap: 12,
                                          height: 32,
                                          margin: 12,
                                        }}
                                      >
                                        <Pressable
                                          style={globalStyles.secondaryButton}
                                        >
                                          <Newspaper
                                            color={"black"}
                                            size={16}
                                          />
                                          <Text
                                            style={
                                              globalStyles.secondaryButtonText
                                            }
                                          >
                                            Artigo
                                          </Text>
                                          <ChevronDown
                                            color={"black"}
                                            size={18}
                                          />
                                        </Pressable>

                                        <TextInput
                                          style={[
                                            globalStyles.input,
                                            { flex: 3 },
                                          ]}
                                          placeholder="Nome (ex: Artigo React)"
                                          placeholderTextColor={
                                            colors.placeholderTextColor
                                          }
                                        />

                                        <TextInput
                                          style={[
                                            globalStyles.input,
                                            { flex: 3 },
                                          ]}
                                          placeholder="URL (https://...)"
                                          placeholderTextColor={
                                            colors.placeholderTextColor
                                          }
                                        />

                                        <TouchableOpacity
                                          style={{
                                            backgroundColor: colors.lightBlue,
                                            paddingVertical: 8,
                                            paddingHorizontal: 20,
                                            borderRadius: 12,
                                          }}
                                          onPress={() =>
                                            addAnotacaoObjetivo(obj.id)
                                          }
                                        >
                                          <Text style={{ color: "white" }}>
                                            + Add
                                          </Text>
                                        </TouchableOpacity>
                                      </View>

                                      {obj.referencias &&
                                      obj.referencias.length != 0 ? (
                                        obj.referencias.map((referencia) => {
                                          return (
                                            <View
                                              style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                                height: 32,
                                                marginHorizontal: 12,
                                                paddingHorizontal: 12,
                                                borderWidth: 1,
                                                borderRadius: 12,
                                                borderColor: "#DDD",
                                                backgroundColor: "white",
                                              }}
                                            >
                                              <View
                                                style={{
                                                  flexDirection: "row",
                                                  gap: 4,
                                                  alignItems: "center",
                                                }}
                                              >
                                                {getIconReferencia(
                                                  referencia.tipo,
                                                )}
                                                <Text
                                                  style={
                                                    globalStyles.secondaryButtonText
                                                  }
                                                >
                                                  {`[${referencia.tipo}] - ${referencia.nome} → `}

                                                  <Text
                                                    style={[
                                                      {
                                                        color: "blue",
                                                      },
                                                    ]}
                                                    onPress={() => {
                                                      if (referencia.url) {
                                                        Linking.openURL(
                                                          referencia.url,
                                                        );
                                                      }
                                                    }}
                                                  >
                                                    <Link size={12} />
                                                    {` ${referencia.url}`}
                                                  </Text>
                                                </Text>
                                              </View>
                                            </View>
                                          );
                                        })
                                      ) : (
                                        <Text
                                          style={{
                                            color: colors.placeholderTextColor,
                                          }}
                                        >
                                          Este objetivo ainda não possui
                                          referências.
                                        </Text>
                                      )}
                                    </View>
                                  </Pressable>
                                )}
                              </Pressable>
                            );
                          })}

                        {/* Adicionar novo objetivo */}
                        {!etapaAdicionandoNovoObjetivo ? ( // NAO ESTA ADICIONANDO
                          <View style={{ alignSelf: "flex-start" }}>
                            <TouchableOpacity
                              style={[
                                globalStyles.secondaryButton,
                                { flexDirection: "row", gap: 4 },
                              ]}
                              onPress={async () => {
                                toggleAdicionandoObjetivo(etapa.id);
                              }}
                            >
                              <Text
                                style={[
                                  globalStyles.secondaryButtonText,
                                  { paddingVertical: 8 },
                                ]}
                              >
                                + Adicionar novo objetivo
                              </Text>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          // ESTA ADICIONANDO
                          <View
                            style={{
                              flexDirection: "row",
                              gap: 12,
                              justifyContent: "space-between",
                            }}
                          >
                            <View style={{ flex: 1, gap: 8 }}>
                              {/* INPUT TITULO */}
                              <TextInput
                                style={globalStyles.input}
                                placeholder="Digite o título do objetivo."
                                placeholderTextColor={
                                  colors.placeholderTextColor
                                }
                                value={tituloNovoObjetivo[etapa.id] || ""}
                                onChangeText={(text) =>
                                  setTituloNovoObjetivo((prev) => ({
                                    ...prev,
                                    [etapa.id]: text,
                                  }))
                                }
                              />

                              {/* INPUT DESCRICAO */}
                              <TextInput
                                style={globalStyles.input}
                                placeholder="Digite a descrição do objetivo."
                                placeholderTextColor={
                                  colors.placeholderTextColor
                                }
                                value={descricaoNovoObjetivo[etapa.id] || ""}
                                onChangeText={(text) =>
                                  setDescricaoNovoObjetivo((prev) => ({
                                    ...prev,
                                    [etapa.id]: text,
                                  }))
                                }
                              />
                            </View>

                            {/* Salvar */}
                            <MenuOptionButton
                              containerStyle={[
                                globalStyles.confirmButton,
                                {
                                  borderWidth: 0,
                                  backgroundColor:
                                    tituloNovoObjetivo[etapa.id] &&
                                    descricaoNovoObjetivo[etapa.id]
                                      ? colors.green
                                      : "#555",
                                  alignSelf: "flex-end",
                                  width: 125,
                                  opacity:
                                    tituloNovoObjetivo[etapa.id] &&
                                    descricaoNovoObjetivo[etapa.id]
                                      ? 1
                                      : 0.6,
                                  marginTop: 0,
                                  height: 36,
                                },
                              ]}
                              enabled={
                                !!tituloNovoObjetivo[etapa.id] &&
                                !!descricaoNovoObjetivo[etapa.id]
                              }
                              label={
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                  <Text
                                    style={[
                                      globalStyles.confirmButtonText,
                                      { color: "white", marginTop: 3 },
                                    ]}
                                    selectable={false}
                                  >
                                    Salvar
                                  </Text>

                                  <Feather
                                    name="check-circle"
                                    size={24}
                                    color="white"
                                  />
                                </View>
                              }
                              onPress={() => criarNovoObjetivo(etapa.id)}
                            />

                            {/* Cancelar */}
                            <MenuOptionButton
                              containerStyle={[
                                globalStyles.confirmButton,
                                {
                                  borderWidth: 0,
                                  backgroundColor: colors.red,
                                  width: 125,
                                  alignSelf: "flex-end",
                                  height: 36,
                                },
                              ]}
                              label={
                                <View style={{ flexDirection: "row", gap: 10 }}>
                                  <Text
                                    style={[
                                      globalStyles.confirmButtonText,
                                      { color: "white" },
                                    ]}
                                    selectable={false}
                                  >
                                    Cancelar
                                  </Text>
                                </View>
                              }
                              onPress={() => {
                                setTituloNovoObjetivo((prev) => ({
                                  ...prev,
                                  [etapa.id]: "",
                                }));

                                setDescricaoNovoObjetivo((prev) => ({
                                  ...prev,
                                  [etapa.id]: "",
                                }));

                                toggleAdicionandoObjetivo(etapa.id);
                              }}
                            />
                          </View>
                        )}

                        {anotacoes[etapa.id] && (
                          <Editor
                            initialState={anotacoes[etapa.id].editorState}
                            setPlainText={(text) => {
                              atualizarAnotacao(etapa.id, {
                                plainText: text,
                              });
                            }}
                            setEditorState={(state) => {
                              atualizarAnotacao(etapa.id, {
                                editorState: state,
                              });
                            }}
                          />
                        )}

                        {/* Salvar Anotação */}
                        <MenuOptionButton
                          containerStyle={[
                            globalStyles.confirmButton,
                            {
                              borderWidth: 0,
                              backgroundColor: alterado ? colors.green : "#555",
                              alignSelf: "flex-end",
                              width: 200,
                              opacity: alterado ? 1 : 0.6,
                            },
                          ]}
                          enabled={alterado}
                          label={
                            <View style={{ flexDirection: "row", gap: 10 }}>
                              <Text
                                style={[
                                  globalStyles.confirmButtonText,
                                  { color: "white", marginTop: 3 },
                                ]}
                                selectable={false}
                              >
                                Salvar anotação
                              </Text>
                              <Feather
                                name="check-circle"
                                size={24}
                                color="white"
                              />
                            </View>
                          }
                          onPress={() => handleEditAnotacaoEtapa(etapa.id)}
                        />
                      </View>
                    )}
                  </View>
                );
              })
          : !adicionandoEtapaModal && (
              <Text
                style={{
                  fontStyle: "italic",
                  fontSize: 16,
                  color: colors.placeholderTextColor,
                }}
              >
                Este Roadmap ainda não possui etapas.
              </Text>
            )}
      </View>
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  card: {
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
    gap: 12,
    padding: 24,
    borderRadius: 12,
  },
  buttonWithIcon: {
    height: 48,
    backgroundColor: "white",
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
    backgroundColor: "#F1F5F9",
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

  etapaCard: {
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    borderRadius: 16,
    padding: 16,
  },

  etapaHeader: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },

  etapaTitulo: {
    fontSize: 18,
    fontWeight: 600,
    color: "black",
  },

  etapaContent: {
    gap: 12,
  },

  etapaDescricao: {
    color: "#5a5a5a",
  },

  etapaDuracao: {
    color: "#aaa",
    fontStyle: "italic",
  },

  progressContainerEtapa: {
    height: 8,
    backgroundColor: "#444",
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },

  progressBarEtapa: {
    height: "100%",
    backgroundColor: colors.green,
  },

  progressTextEtapa: {
    color: "#ccc",
    fontSize: 12,
    marginBottom: 8,
  },

  objetivoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  objetivoTituloText: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
  },

  objetivoDescricaoText: {
    color: "#545454",
    fontWeight: 400,
    fontSize: 12,
  },

  objetivoEditLabel: {
    fontSize: 16,
    fontWeight: 500,
  },

  check: {
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.lightBlue,
    width: 20,
    height: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
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
});
