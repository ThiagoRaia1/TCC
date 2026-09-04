import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react-native";
import {
  View,
  Pressable,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Text,
} from "react-native";
import { colors } from "../../../styles/colors";
import { getProgressColor } from "../../../utils/progressBarFunctions";
import Editor from "../../_components/dom-components/hello-dom";
import MenuOptionButton from "../../_components/MenuOptionButton";
import ObjetivoCard from "./ObjetivoCard";
import { IRoadmap, IUpdateRoadmap } from "../../../interfaces/roadmap";
import { IEtapa } from "../../../interfaces/etapa";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { useState } from "react";
import { TipoItem, tiposItem } from "./[id]";
import { salvarAnotacao, updateRoadmap } from "../../../services/roadmap";
import { Feather } from "@expo/vector-icons";
import { useLoading } from "../../../context/providers/loading";

type EtapaCardProps = {
  etapa: IEtapa;
  roadmap: IRoadmap;
  setRoadmap: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;
  openDeleteModal: (tipoItem: TipoItem, etapa: IEtapa) => void;
  anotacoes: {
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
    };
  };
  setAnotacoes: React.Dispatch<
    React.SetStateAction<{
      [etapaId: number]: {
        plainText: string;
        editorState: string | null;
      };
    }>
  >;
};

export default function EtapaCard({
  etapa,
  roadmap,
  setRoadmap,
  openDeleteModal,
  anotacoes,
  setAnotacoes,
}: EtapaCardProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const toggleEtapa = (id: number) => {
    setEtapasAbertas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const [etapasAbertas, setEtapasAbertas] = useState<number[]>([]);
  const aberta = etapasAbertas.includes(etapa.id);

  const calcularProgressoEtapa = (etapa: IEtapa): number => {
    const total = etapa.objetivos.length;
    if (total === 0) return 0;

    const concluidos = etapa.objetivos.filter((o) => o.concluido).length;
    return (concluidos / total) * 100;
  };

  const [adicionandoObjetivo, setAdicionandoObjetivo] = useState<number[]>([]);

  const toggleAdicionandoObjetivo = (id: number) => {
    setAdicionandoObjetivo((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const etapaAdicionandoNovoObjetivo = adicionandoObjetivo.includes(etapa.id);

  const [tituloNovoObjetivo, setTituloNovoObjetivo] = useState<{
    [etapaId: number]: string;
  }>({});

  const [descricaoNovoObjetivo, setDescricaoNovoObjetivo] = useState<{
    [etapaId: number]: string;
  }>({});

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

  const [salvandoAnotacao, setSalvandoAnotacao] = useState<{
    [etapaId: number]: boolean;
  }>({});

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

  const [editandoEtapa, setEditandoEtapa] = useState(false);
  const [tituloEtapa, setTituloEtapa] = useState(etapa.titulo);
  const [descricaoEtapa, setDescricaoEtapa] = useState(etapa.descricao);

  const editarEtapa = async () => {
    try {
      showLoading();
      const titulo = tituloEtapa.trim();
      const descricao = descricaoEtapa.trim();

      if (!titulo) {
        alert("O título da etapa não pode ficar vazio.");
        return;
      }

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmap,

        etapas: roadmap.etapas.map((e) => {
          if (e.id !== etapa.id) return e;

          return {
            ...e,
            titulo,
            descricao,
          };
        }),
      };

      const atualizado = await updateRoadmap(novoRoadmap);

      setRoadmap(atualizado);

      setEditandoEtapa(false);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View key={etapa.id} style={globalStyles.card}>
      {/* Header da etapa */}
      <Pressable
        style={styles.etapaHeader}
        onPress={(e) => {
          toggleEtapa(etapa.id);
          e.stopPropagation();
        }}
      >
        <View style={{ flex: 1, gap: 8 }}>
          <View // ORDEM TITULO DESCRICAO - BOTOES DE ACAO
            style={{ flexDirection: "row", gap: 20 }}
          >
            {editandoEtapa ? (
              <View style={{ gap: 8, flex: 1 }}>
                <Text style={globalStyles.title}>Título</Text>
                <TextInput
                  style={globalStyles.input}
                  value={tituloEtapa}
                  onChangeText={setTituloEtapa}
                  placeholder="Título da etapa"
                  placeholderTextColor={colors.placeholderTextColor}
                />

                <Text style={globalStyles.title}>Descrição</Text>
                <TextInput
                  style={globalStyles.input}
                  value={descricaoEtapa}
                  onChangeText={setDescricaoEtapa}
                  placeholder="Descrição da etapa"
                  placeholderTextColor={colors.placeholderTextColor}
                  multiline
                  numberOfLines={5}
                />

                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    style={[
                      globalStyles.confirmButton,
                      {
                        backgroundColor: colors.green,
                        paddingHorizontal: 16,
                      },
                    ]}
                    onPress={editarEtapa}
                  >
                    <Text style={globalStyles.confirmButtonText}>Salvar</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      globalStyles.confirmButton,
                      {
                        backgroundColor: colors.red,
                        paddingHorizontal: 16,
                      },
                    ]}
                    onPress={() => {
                      setTituloEtapa(etapa.titulo);
                      setDescricaoEtapa(etapa.descricao);
                      setEditandoEtapa(false);
                    }}
                  >
                    <Text style={globalStyles.confirmButtonText}>Cancelar</Text>
                  </TouchableOpacity>
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
                {aberta ? (
                  <ChevronUp
                    color="black"
                    style={{
                      marginLeft: -8,
                      alignSelf: "flex-start",
                    }}
                  />
                ) : (
                  <ChevronDown
                    color="black"
                    style={{
                      marginLeft: -8,
                      alignSelf: "flex-start",
                    }}
                  />
                )}
                {/* TITULO, DESCRICAO */}
                <View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
                  <View>
                    <Text style={styles.etapaTitulo} selectable={false}>
                      {etapa.ordem}. {etapa.titulo}
                    </Text>

                    <Text style={styles.etapaDescricao} selectable={false}>
                      {etapa.descricao !== "" ? (
                        etapa.descricao
                      ) : (
                        <i>Esta etapa ainda não possui descrição.</i>
                      )}
                    </Text>
                  </View>
                </View>

                <View // BOTOES DE ACAO
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
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
                    onPress={() => setEditandoEtapa(true)}
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
                        backgroundColor: state.hovered ? "#ef4444" : "#fff",
                        transitionProperty: "background-color",
                        transitionDuration: "200ms",
                        transitionTimingFunction: "ease-in-out",
                      },
                    ]}
                    onPress={() => openDeleteModal(tiposItem[1], etapa)}
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
            )}
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
              return (
                <ObjetivoCard
                  objetivo={obj}
                  etapaId={etapa.id}
                  roadmap={roadmap}
                  setRoadmap={setRoadmap}
                />
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
                  placeholderTextColor={colors.placeholderTextColor}
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
                  placeholderTextColor={colors.placeholderTextColor}
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

                    <Feather name="check-circle" size={24} color="white" />
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
                  <Feather name="loader" size={24} color="white" />
                ) : (
                  <Feather name="check-circle" size={24} color="white" />
                )}
              </View>
            }
            onPress={() => handleEditAnotacaoEtapa(etapa.id)}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
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
});
