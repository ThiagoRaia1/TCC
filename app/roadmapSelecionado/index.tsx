import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import {
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { getGlobalStyles } from "../../styles/globalStyles";
import { useRoadmap } from "../../context/providers/roadmap";
import GradientScreen from "../_components/GradientBackground";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";
import { pageNames } from "../../utils/pageNames";
import { useState } from "react";
import { colors } from "../../styles/colors";
import {
  getRoadmap,
  salvarAnotacao,
  updateRoadmap,
} from "../../services/roadmap";
import { IEtapa } from "../../interfaces/etapa";
import Editor from "../_components/dom-components/hello-dom";
import MenuOptionButton from "../_components/MenuOptionButton";
import { IRoadmap, IUpdateRoadmap } from "../../interfaces/roadmap";
import { deleteObjetivo } from "../../services/objetivo";

const scrollAdjust: number = 32;
const editDeleteButtonsSize: number = 40;

export default function RoadmapSelecionado() {
  const globalStyles = getGlobalStyles();
  const { roadmapSelecionado, setRoadmapSelecionado } = useRoadmap();
  const { showLoading, hideLoading } = useLoading();

  const [plainText, setPlainText] = useState<string>("");
  const [editorState, setEditorState] = useState<string | null>(null);
  const [anotacoes, setAnotacoes] = useState<{
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
      alterado: boolean;
    };
  }>({});

  const [adicionandoObjetivo, setAdicionandoObjetivo] = useState<number[]>([]);
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

  const toggleEtapa = (id: number) => {
    setEtapasAbertas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
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
      if (!roadmapSelecionado) return;

      const novoRoadmap = {
        ...roadmapSelecionado,
        etapas: roadmapSelecionado.etapas.map((etapa) => {
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

      const porcentagemConclusao = calcularProgresso(novoRoadmap);

      const roadmapComPorcentagemConclusao = {
        ...novoRoadmap,
        porcentagemConclusao: Number(porcentagemConclusao.toFixed(0)),
      };

      const roadmapAtualizado = await updateRoadmap(
        roadmapComPorcentagemConclusao,
      );
      // atualiza no contexto (e salva no AsyncStorage)
      setRoadmapSelecionado(roadmapAtualizado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      // hideLoading();
    }
  };

  const criarNovoObjetivo = async (etapaId: number) => {
    try {
      // showLoading();
      if (!roadmapSelecionado) return;

      const descricao = descricaoNovoObjetivo[etapaId];
      if (!descricao) return;

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmapSelecionado,
        etapas: roadmapSelecionado.etapas.map((etapa) => {
          if (etapa.id !== etapaId) return etapa;

          return {
            ...etapa,
            objetivos: [
              ...etapa.objetivos,
              {
                descricao,
                concluido: false,
              },
            ],
          };
        }),
      };

      const atualizado = await updateRoadmap(novoRoadmap);
      setRoadmapSelecionado(atualizado);

      // limpa input + fecha
      setDescricaoNovoObjetivo((prev) => ({
        ...prev,
        [etapaId]: "",
      }));

      toggleAdicionandoObjetivo(etapaId);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      // hideLoading();
    }
  };

  const calcularProgresso = (roadmap: IRoadmap | null): number => {
    if (!roadmap) return 0;
    const total = roadmap.etapas.flatMap((e) => e.objetivos).length;
    const concluidos = roadmap.etapas
      .flatMap((e) => e.objetivos)
      .filter((o) => o.concluido).length;

    if (total === 0) return 0;

    return (concluidos / total) * 100;
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
      if (!roadmapSelecionado) return;
      const resultadoExclusao = await deleteObjetivo(objetivoId);
      const roadmapAtualizado = await getRoadmap(roadmapSelecionado.id);

      setRoadmapSelecionado(roadmapAtualizado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return roadmapSelecionado ? (
    <GradientScreen style={{ paddingHorizontal: 48, backgroundColor: "red" }}>
      <Pressable
        style={{ position: "absolute", left: 16, top: 32 }}
        onPress={() => {
          router.push({
            pathname: "/main",
            params: {
              pageName: pageNames.roadmap.main,
              subPage: pageNames.roadmap.meusRoadmaps,
            },
          });
        }}
      >
        <FontAwesome name="chevron-left" size={24} color="white" />
      </Pressable>

      <ScrollView
        contentContainerStyle={styles.container}
        style={{
          width: "100%",
          marginRight: -scrollAdjust,
          paddingRight: scrollAdjust,
        }}
      >
        {/* Header */}
        <Text style={styles.titulo}>{roadmapSelecionado.tema}</Text>
        <Text style={styles.nivel}>Nível: {roadmapSelecionado.nivel}</Text>
        <Text style={styles.descricao}>
          {roadmapSelecionado.descricaoGeral}
        </Text>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { width: `${roadmapSelecionado.porcentagemConclusao}%` },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {roadmapSelecionado.porcentagemConclusao.toFixed(0)}% concluído
        </Text>

        {/* Etapas */}
        {roadmapSelecionado.etapas
          .sort((a, b) => a.ordem - b.ordem)
          .map((etapa) => {
            const aberta = etapasAbertas.includes(etapa.id);
            const anotacaoEtapa = anotacoes[etapa.id];
            const alterado = !!anotacaoEtapa?.alterado;

            const etapaAdicionandoNovoObjetivo = adicionandoObjetivo.includes(
              etapa.id,
            );

            return (
              <View key={etapa.id} style={styles.etapaCard}>
                {/* Header da etapa */}
                <Pressable
                  style={styles.etapaHeader}
                  onPress={() => toggleEtapa(etapa.id)}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.etapaTitulo}>
                      {etapa.ordem}. {etapa.titulo}
                    </Text>

                    {/* Barra de progresso da etapa no header */}

                    <View style={styles.progressContainerEtapa}>
                      <View
                        style={[
                          styles.progressBarEtapa,
                          { width: `${calcularProgressoEtapa(etapa)}%` },
                        ]}
                      />
                    </View>

                    <Text style={styles.progressTextEtapa}>
                      {calcularProgressoEtapa(etapa).toFixed(0)}% da etapa
                    </Text>
                  </View>

                  <FontAwesome
                    name={aberta ? "chevron-up" : "chevron-down"}
                    size={18}
                    color="white"
                  />
                </Pressable>

                {/* Conteúdo expandido */}
                {aberta && (
                  <View style={styles.etapaContent}>
                    <Text style={styles.etapaDescricao}>{etapa.descricao}</Text>
                    <Text style={styles.etapaDuracao}>⏱ {etapa.duracao}</Text>

                    {/* Objetivos */}
                    {[...etapa.objetivos]
                      .sort((a, b) => a.id - b.id)
                      .map((obj) => {
                        const objetivoEstaSendoEditado: boolean =
                          obj.id !== idObjetivoSendoEditado;

                        return (
                          <View
                            key={obj.id}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderTopWidth: 1,
                              borderColor: colors.placeholderTextColor,
                              paddingTop: 8,
                            }}
                          >
                            {objetivoEstaSendoEditado ? (
                              <Pressable
                                key={obj.id}
                                style={styles.objetivoRow}
                                onPress={() => toggleObjetivo(etapa.id, obj.id)}
                              >
                                <FontAwesome
                                  name={
                                    obj.concluido ? "check-square" : "square-o"
                                  }
                                  size={18}
                                  color={obj.concluido ? "lime" : "white"}
                                />
                                <Text style={styles.objetivoText}>
                                  {obj.descricao}
                                </Text>
                              </Pressable>
                            ) : (
                              <TextInput style={globalStyles.input} />
                            )}

                            <View
                              style={{
                                flexDirection: "row",
                                gap: 8,
                                marginLeft: 8,
                              }}
                            >
                              {/* Editar */}
                              <MenuOptionButton
                                containerStyle={[
                                  globalStyles.actionButton,
                                  {
                                    width: objetivoEstaSendoEditado
                                      ? editDeleteButtonsSize
                                      : 55,
                                    height: editDeleteButtonsSize,
                                  },
                                ]}
                                label={
                                  objetivoEstaSendoEditado ? (
                                    <Feather
                                      name="edit"
                                      size={22}
                                      color="white"
                                    />
                                  ) : (
                                    <Text style={{ color: "white" }}>
                                      Salvar
                                    </Text>
                                  )
                                }
                                onPress={() =>
                                  setIdObjetivoSendoEditado(obj.id)
                                }
                              />

                              {/* Deletar */}
                              <MenuOptionButton
                                containerStyle={[
                                  globalStyles.actionButton,
                                  {
                                    backgroundColor: colors.red,
                                    width: objetivoEstaSendoEditado
                                      ? editDeleteButtonsSize
                                      : 55,
                                    height: editDeleteButtonsSize,
                                  },
                                ]}
                                label={
                                  objetivoEstaSendoEditado ? (
                                    <FontAwesome6
                                      name="trash"
                                      size={18}
                                      color="white"
                                    />
                                  ) : (
                                    <Text style={{ color: "white" }}>
                                      Cancelar
                                    </Text>
                                  )
                                }
                                onPress={() => {
                                  if (objetivoEstaSendoEditado) {
                                    handleDeleteObjetivo(obj.id);
                                  } else {
                                    setIdObjetivoSendoEditado(0);
                                  }
                                }}
                              />
                            </View>
                          </View>
                        );
                      })}
                    {!etapaAdicionandoNovoObjetivo ? (
                      <MenuOptionButton
                        containerStyle={styles.adicionarNovoButton}
                        label={
                          <Pressable style={styles.objetivoRow}>
                            <FontAwesome
                              name={"plus"}
                              size={18}
                              color={"lime"}
                            />
                            <Text style={styles.objetivoText}>
                              Adicionar novo objetivo
                            </Text>
                          </Pressable>
                        }
                        onPress={async () => {
                          toggleAdicionandoObjetivo(etapa.id);
                        }}
                      />
                    ) : (
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
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
                        <MenuOptionButton
                          containerStyle={[
                            globalStyles.button,
                            {
                              borderWidth: 0,
                              backgroundColor: descricaoNovoObjetivo[etapa.id]
                                ? colors.green
                                : "#555",
                              alignSelf: "flex-end",
                              width: 125,
                              opacity: descricaoNovoObjetivo[etapa.id]
                                ? 1
                                : 0.6,
                              marginTop: 0,
                            },
                          ]}
                          enabled={!!descricaoNovoObjetivo[etapa.id]}
                          label={
                            <View style={{ flexDirection: "row", gap: 10 }}>
                              <Text
                                style={[
                                  globalStyles.buttonText,
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
                        <MenuOptionButton
                          containerStyle={[
                            globalStyles.button,
                            {
                              borderWidth: 0,
                              backgroundColor: colors.red,
                              alignSelf: "flex-end",
                              width: 125,
                              marginTop: 0,
                            },
                          ]}
                          label={
                            <View style={{ flexDirection: "row", gap: 10 }}>
                              <Text
                                style={[
                                  globalStyles.buttonText,
                                  { color: "white" },
                                ]}
                                selectable={false}
                              >
                                Cancelar
                              </Text>
                            </View>
                          }
                          onPress={() => {
                            setDescricaoNovoObjetivo((prev) => ({
                              ...prev,
                              [etapa.id]: "",
                            }));
                            toggleAdicionandoObjetivo(etapa.id);
                          }}
                        />
                      </View>
                    )}
                    <Editor
                      initialState={etapa.anotacoes?.editorState ?? null}
                      setPlainText={(text) => {
                        atualizarAnotacao(etapa.id, { plainText: text });
                      }}
                      setEditorState={(state) => {
                        atualizarAnotacao(etapa.id, { editorState: state });
                      }}
                    />
                    <MenuOptionButton
                      containerStyle={[
                        globalStyles.button,
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
                              globalStyles.buttonText,
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
                      onPress={async () => {
                        try {
                          showLoading();

                          const anotacao = anotacoes[etapa.id];
                          if (!anotacao) return;
                          const atualizarAnotacao = await salvarAnotacao(
                            etapa.id,
                            {
                              plainText: anotacao.plainText,
                              editorState: anotacao.editorState,
                            },
                          );

                          setAnotacoes((prev) => ({
                            ...prev,
                            [etapa.id]: {
                              ...prev[etapa.id],
                              alterado: false,
                            },
                          }));
                        } catch (erro: any) {
                          alert(erro.message);
                        } finally {
                          hideLoading();
                        }
                      }}
                    />
                  </View>
                )}
              </View>
            );
          })}
      </ScrollView>
    </GradientScreen>
  ) : (
    <GradientScreen></GradientScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },

  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },

  nivel: {
    fontSize: 18,
    color: "#ccc",
  },

  descricao: {
    color: "white",
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
    color: "#aaa",
  },

  etapaCard: {
    backgroundColor: colors.secundaryDarkBlue,
    borderRadius: 16,
    padding: 16,
  },

  etapaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  etapaTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },

  etapaContent: {
    marginTop: 10,
    gap: 8,
  },

  etapaDescricao: {
    color: "#ddd",
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
    marginRight: 12,
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
    gap: 8,
  },

  objetivoText: {
    color: "white",
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
