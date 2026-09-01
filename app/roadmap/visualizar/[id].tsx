//#region IMPORTS
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
import { ICriarObjetivo, IObjetivo } from "../../../interfaces/objetivo";
import { ICriarReferencia } from "../../../interfaces/referencia";
import {
  getIconReferencia,
  TipoReferencia,
  tiposReferencia,
} from "../../../utils/tiposReferencia";
import {
  calcularProgresso,
  getProgressColor,
} from "../../../utils/progressBarFunctions";
//#endregion

export default function Visualizar() {
  const { id } = useLocalSearchParams();
  const globalStyles = getGlobalStyles();
  const [roadmap, setRoadmap] = useState<IRoadmap>();
  const { showLoading, hideLoading } = useLoading();

  //#region TIPOS
  type Menus = "Etapas" | "Quizzes";
  const menus: Menus[] = ["Etapas", "Quizzes"];
  const [menuSelecionado, setMenuSelecionado] = useState<Menus>(menus[0]);

  type TipoItem = "roadmap" | "etapa" | "objetivo";
  const tiposItem: TipoItem[] = ["roadmap", "etapa", "objetivo"];
  const [tipoItemASerExcluido, setTipoItemASerExcluido] = useState<TipoItem>(
    tiposItem[0],
  );
  // TIPOS
  //#endregion

  //#region MODAIS
  const [adicionandoEtapaModal, setAdicionandoEtapaModal] =
    useState<boolean>(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const openDeleteModal = (tipoItem: TipoItem, etapa?: IEtapa) => {
    if (etapa) setEtapaSelecionada(etapa);
    setTipoItemASerExcluido(tipoItem);
    setDeleteModalVisible(true);
  };
  // MODAIS
  //#endregion

  //#region USE EFFECTS
  const getData = async () => {
    try {
      showLoading();
      const resultado = await getRoadmap(Number(id));
      setRoadmap(resultado);

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
    if (roadmap) calcularProgresso(roadmap);
  }, [roadmap]);

  useEffect(() => {
    if (!adicionandoEtapaModal) {
      getData();
    }
  }, [adicionandoEtapaModal]);
  // USE EFFECTS
  //#endregion

  const [anotacoes, setAnotacoes] = useState<{
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
    };
  }>({});
  const [salvandoAnotacao, setSalvandoAnotacao] = useState<{
    [etapaId: number]: boolean;
  }>({});

  const [objetivoTituloEditInput, setObjetivoTituloEditInput] =
    useState<string>("");
  const [objetivoDescricaoEditInput, setObjetivoDescricaoEditInput] =
    useState<string>("");

  const [etapaSelecionada, setEtapaSelecionada] = useState<IEtapa>();

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
      };

      return {
        ...prev,
        [etapaId]: {
          plainText: dados.plainText ?? atual.plainText,
          editorState: dados.editorState ?? atual.editorState,
        },
      };
    });
  };

  const [idObjetivoSendoEditado, setIdObjetivoSendoEditado] =
    useState<number>();

  const [etapasAbertas, setEtapasAbertas] = useState<number[]>([]);
  const [objetivosAbertos, setObjetivosAbertos] = useState<number[]>([]);
  const [tipoReferencia, setTipoReferencia] = useState<{
    [objetivoId: number]: TipoReferencia;
  }>({});

  const [dropdownReferenciaAberto, setDropdownReferenciaAberto] = useState<
    number | null
  >(null);

  const [nomeReferencia, setNomeReferencia] = useState<{
    [objetivoId: number]: string;
  }>({});

  const [urlReferencia, setUrlReferencia] = useState<{
    [objetivoId: number]: string;
  }>({});

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
    // Impede um segundo clique enquanto já está salvando
    if (salvandoAnotacao[etapaId]) return;

    const anotacao = anotacoes[etapaId];

    if (!anotacao) return;

    try {
      // Desabilita o botão desta etapa
      setSalvandoAnotacao((prev) => ({
        ...prev,
        [etapaId]: true,
      }));

      await salvarAnotacao(etapaId, {
        plainText: anotacao.plainText,
        editorState: anotacao.editorState,
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      // Libera o botão somente depois que terminar
      setSalvandoAnotacao((prev) => ({
        ...prev,
        [etapaId]: false,
      }));
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
      showLoading();
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
      hideLoading();
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

  const porcentagemConclusaoRoadmap: number = roadmap
    ? calcularProgresso(roadmap)
    : 0;

  const addReferenciaObjetivo = async (objetivo: IObjetivo) => {
    try {
      showLoading();

      const tipo = tipoReferencia[objetivo.id] || "Artigo";
      const nome = nomeReferencia[objetivo.id]?.trim();
      const url = urlReferencia[objetivo.id]?.trim() || "";

      if (!nome) {
        alert("Informe o nome da referência.");
        return;
      }

      if (!roadmap) return;

      const novaReferencia: ICriarReferencia = {
        tipo,
        nome,
        url,
      };

      const objetivoAtualizado: ICriarObjetivo = {
        ...objetivo,
        referencias: [...(objetivo.referencias || []), novaReferencia],
      };

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => ({
          ...etapa,
          objetivos: etapa.objetivos.map((obj) =>
            obj.id === objetivo.id ? objetivoAtualizado : obj,
          ),
        })),
      };

      const atualizado = await updateRoadmap(novoRoadmap);

      setRoadmap(atualizado);

      // Limpa os campos
      setNomeReferencia((prev) => ({
        ...prev,
        [objetivo.id]: "",
      }));

      setUrlReferencia((prev) => ({
        ...prev,
        [objetivo.id]: "",
      }));
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

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

  return roadmap ? (
    <View
      style={{
        maxWidth: 1350,
        paddingHorizontal: 8,
        gap: 20,
        paddingVertical: 20,
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
                  boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
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
                  boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                },
              ]}
              onPress={() => openDeleteModal(tiposItem[0])}
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
          onPress={() => setMenuSelecionado(menus[0])}
          style={[
            styles.menuItem,
            menuSelecionado == menus[0]
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == menus[0]
                ? styles.menuItemSelecionadoText
                : styles.menuItemDesselecionadoText,
            ]}
          >
            Etapas do Roadmap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuSelecionado(menus[1])}
          style={[
            styles.menuItem,
            menuSelecionado == menus[1]
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == menus[1]
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
                              gap: 4,
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
                              onPress={() =>
                                openDeleteModal(tiposItem[1], etapa)
                              }
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
                                        <View style={{ position: "relative" }}>
                                          <Pressable
                                            style={[
                                              globalStyles.secondaryButton,
                                              {
                                                boxShadow:
                                                  "0px 0px 2px rgba(0, 0, 0, 0.4)",
                                              },
                                            ]}
                                            onPress={() => {
                                              setDropdownReferenciaAberto(
                                                (prev) =>
                                                  prev === obj.id
                                                    ? null
                                                    : obj.id,
                                              );
                                            }}
                                          >
                                            {getIconReferencia(
                                              tipoReferencia[obj.id] ||
                                                "Artigo",
                                            )}

                                            <Text
                                              style={
                                                globalStyles.secondaryButtonText
                                              }
                                            >
                                              {tipoReferencia[obj.id] ||
                                                "Artigo"}
                                            </Text>

                                            {dropdownReferenciaAberto ===
                                            obj.id ? (
                                              <ChevronUp
                                                color="black"
                                                size={18}
                                              />
                                            ) : (
                                              <ChevronDown
                                                color="black"
                                                size={18}
                                              />
                                            )}
                                          </Pressable>

                                          {/* DROPDOWN */}
                                          {dropdownReferenciaAberto ===
                                            obj.id && (
                                            <View
                                              style={{
                                                position: "absolute",
                                                top: 38,
                                                left: 0,
                                                zIndex: 1000,
                                                elevation: 10,
                                                backgroundColor: "white",
                                                borderRadius: 8,
                                                borderWidth: 1,
                                                borderColor: "#ddd",
                                                width: 140,
                                                overflow: "hidden",
                                              }}
                                            >
                                              {tiposReferencia.map((item) => (
                                                <Pressable
                                                  key={item.tipo}
                                                  style={({
                                                    hovered,
                                                  }: any) => ({
                                                    flexDirection: "row",
                                                    alignItems: "center",
                                                    gap: 8,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 10,
                                                    backgroundColor: hovered
                                                      ? "#F1F5F9"
                                                      : "white",
                                                  })}
                                                  onPress={() => {
                                                    setTipoReferencia(
                                                      (prev) => ({
                                                        ...prev,
                                                        [obj.id]: item.tipo,
                                                      }),
                                                    );

                                                    setDropdownReferenciaAberto(
                                                      null,
                                                    );
                                                  }}
                                                >
                                                  {item.icon}

                                                  <Text
                                                    style={{ color: "black" }}
                                                  >
                                                    {item.tipo}
                                                  </Text>
                                                </Pressable>
                                              ))}
                                            </View>
                                          )}
                                        </View>

                                        <TextInput
                                          style={[
                                            globalStyles.input,
                                            { flex: 3 },
                                          ]}
                                          placeholder="Nome (ex: Artigo React)*"
                                          placeholderTextColor={
                                            colors.placeholderTextColor
                                          }
                                          value={nomeReferencia[obj.id] || ""}
                                          onChangeText={(text) =>
                                            setNomeReferencia((prev) => ({
                                              ...prev,
                                              [obj.id]: text,
                                            }))
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
                                          value={urlReferencia[obj.id] || ""}
                                          onChangeText={(text) =>
                                            setUrlReferencia((prev) => ({
                                              ...prev,
                                              [obj.id]: text,
                                            }))
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
                                            addReferenciaObjetivo(obj)
                                          }
                                        >
                                          <Text style={{ color: "white" }}>
                                            + Add
                                          </Text>
                                        </TouchableOpacity>
                                      </View>

                                      {obj.referencias &&
                                      obj.referencias.length !== 0 ? (
                                        <View
                                          style={{
                                            borderWidth: 1,
                                            borderRadius: 12,
                                            borderColor: "#ccc",
                                            backgroundColor: "#f8f8f8",
                                            padding: 12,
                                            marginHorizontal: 12,
                                            gap: 8,
                                          }}
                                        >
                                          {obj.referencias.map(
                                            (referencia, index) => {
                                              return (
                                                <View
                                                  key={referencia.id}
                                                  style={{
                                                    flexDirection: "row",
                                                    justifyContent:
                                                      "space-between",
                                                    height: 32,
                                                    borderBottomWidth:
                                                      index ===
                                                      obj.referencias!.length -
                                                        1
                                                        ? 0
                                                        : 2,
                                                    borderBottomColor: "#ddd",
                                                    paddingVertical: 12,
                                                    alignItems: "center",
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
                                                        style={{
                                                          color: "blue",
                                                        }}
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
                                            },
                                          )}
                                        </View>
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
                              backgroundColor: salvandoAnotacao[etapa.id]
                                ? "#555"
                                : colors.green,
                              alignSelf: "flex-end",
                              width: 200,
                              opacity: salvandoAnotacao[etapa.id] ? 0.6 : 1,
                            },
                          ]}
                          enabled={!salvandoAnotacao[etapa.id]}
                          label={
                            <View style={{ flexDirection: "row", gap: 10 }}>
                              <Text
                                style={[
                                  globalStyles.confirmButtonText,
                                  {
                                    color: "white",
                                    marginTop: 3,
                                    fontWeight: 600,
                                  },
                                ]}
                                selectable={false}
                              >
                                {salvandoAnotacao[etapa.id]
                                  ? "Salvando..."
                                  : "Salvar anotação"}
                              </Text>

                              {salvandoAnotacao[etapa.id] ? (
                                <Feather
                                  name="loader"
                                  size={24}
                                  color="white"
                                />
                              ) : (
                                <Feather
                                  name="check-circle"
                                  size={24}
                                  color="white"
                                />
                              )}
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
