import { Feather, FontAwesome } from "@expo/vector-icons";
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
  salvarAnotacao,
  salvarRoadmap,
  updateRoadmap,
} from "../../services/roadmap";
import { IEtapa } from "../../interfaces/etapa";
import Editor from "../_components/dom-components/hello-dom";
import MenuOptionButton from "../_components/MenuOptionButton";

const scrollAdjust: number = 32;

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

  const [etapasAbertas, setEtapasAbertas] = useState<number[]>([]);

  const toggleEtapa = (id: number) => {
    setEtapasAbertas((prev) =>
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

      const atualizar = await updateRoadmap(novoRoadmap);
      // atualiza no contexto (e salva no AsyncStorage)
      setRoadmapSelecionado(novoRoadmap);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const calcularProgresso = (): number => {
    if (!roadmapSelecionado) return 0;
    const total = roadmapSelecionado.etapas.flatMap((e) => e.objetivos).length;
    const concluidos = roadmapSelecionado.etapas
      .flatMap((e) => e.objetivos)
      .filter((o) => o.concluido).length;

    if (total === 0) return 0;

    return (concluidos / total) * 100;
  };

  const progresso = calcularProgresso();

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
          <View style={[styles.progressBar, { width: `${progresso}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {progresso.toFixed(0)}% concluído
        </Text>

        {/* Etapas */}
        {roadmapSelecionado.etapas
          .sort((a, b) => a.ordem - b.ordem)
          .map((etapa) => {
            const aberta = etapasAbertas.includes(etapa.id);
            const anotacaoEtapa = anotacoes[etapa.id];
            const alterado = !!anotacaoEtapa?.alterado;

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
                    {!aberta && (
                      <View style={styles.progressContainerEtapa}>
                        <View
                          style={[
                            styles.progressBarEtapa,
                            { width: `${calcularProgressoEtapa(etapa)}%` },
                          ]}
                        />
                      </View>
                    )}
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

                    {/* Barra de progresso da etapa */}
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
                      concluída
                    </Text>

                    {/* Objetivos */}
                    {etapa.objetivos.map((obj) => (
                      <Pressable
                        key={obj.id}
                        style={styles.objetivoRow}
                        onPress={() => toggleObjetivo(etapa.id, obj.id)}
                      >
                        <FontAwesome
                          name={obj.concluido ? "check-square" : "square-o"}
                          size={18}
                          color={obj.concluido ? "lime" : "white"}
                        />
                        <Text style={styles.objetivoText}>{obj.descricao}</Text>
                      </Pressable>
                    ))}
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
                        showLoading();

                        const anotacao = anotacoes[etapa.id];
                        if (!anotacao) return;

                        try {
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
});
