import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Pressable,
} from "react-native";
import { useLoading } from "../../context/providers/loading";
import { useAuth } from "../../context/auth";
import { IRoadmap } from "../../interfaces/roadmap";
import { getAllRoadmap } from "../../services/roadmap";
import { BookOpen, Eye, Pencil, Trash2 } from "lucide-react-native";
import { getGlobalStyles } from "../../styles/globalStyles";
import { router } from "expo-router";
import { colors } from "../../styles/colors";

export default function CriarRoadmap() {
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();

  const [roadmaps, setRoadmaps] = useState<IRoadmap[]>([]);

  const calcularProgresso = (roadmap: IRoadmap | null) => {
    if (!roadmap) return 0;
    const total = roadmap.etapas.flatMap((e) => e.objetivos).length;
    const concluidos = roadmap.etapas
      .flatMap((e) => e.objetivos)
      .filter((o) => o.concluido).length;

    if (total === 0) return 0;

    return (concluidos / total) * 100;
  };

  const getData = async () => {
    try {
      showLoading();
      const resultado = await getAllRoadmap();

      setRoadmaps(resultado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <ScrollView style={{ paddingHorizontal: 40 }} contentContainerStyle={{}}>
      <View
        style={{
          maxWidth: 1350,
          width: "100%",
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            paddingVertical: 40,
          }}
        >
          <View>
            <Text style={styles.title}>Seus Roadmaps</Text>
            <Text style={styles.subtitle}>
              Gerencie e rastreie seus estudos
            </Text>
          </View>

          {roadmaps && (
            <View
              style={{ flexDirection: "row", alignItems: "flex-end", gap: 12 }}
            >
              <TouchableOpacity
                style={globalStyles.confirmButton}
                onPress={() => router.push("/roadmap/novo")}
              >
                <Text style={globalStyles.confirmButtonText}>
                  + Criar Roadmap
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={globalStyles.confirmButton}>
                <Text style={globalStyles.confirmButtonText}>
                  Gerar com inteligência artificial
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {roadmaps.length == 0 ? (
          <View style={styles.noRoadmapsContainer}>
            <BookOpen size={60} color="#3D84F6" />
            <Text
              style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}
            >
              Ainda não há roadmaps
            </Text>
            <Text
              style={{ fontSize: 16, color: "#525252", textAlign: "center" }}
            >
              Crie seu primeiro roteiro de aprendizado para começar.
            </Text>

            <TouchableOpacity
              style={[globalStyles.confirmButton, styles.button]}
              onPress={() => router.push("/roadmap/novo")}
            >
              <Text style={[globalStyles.confirmButtonText, styles.buttonText]}>
                + Crie seu primeiro roadmap
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.confirmButton, styles.button]}
            >
              <Text style={[globalStyles.confirmButtonText, styles.buttonText]}>
                Gere com inteligência artificial
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.roadmapsContainer}>
            {roadmaps.map((roadmap) => {
              return (
                <View style={styles.roadmapCard}>
                  <View>
                    <Text style={styles.roadmapCardTitle} selectable={false}>
                      {roadmap.tema}
                    </Text>
                    <Text
                      style={[styles.roadmapCardText, { fontSize: 14 }]}
                      selectable={false}
                    >
                      {roadmap.descricaoGeral != "" ? (
                        roadmap.descricaoGeral
                      ) : (
                        <i>Este roadmap ainda não possui descrição.</i>
                      )}
                    </Text>
                  </View>

                  <View style={{ gap: 8 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.roadmapCardText}>Progresso</Text>
                      <Text
                        style={[
                          styles.roadmapCardText,
                          { color: "black", fontWeight: "bold" },
                        ]}
                      >
                        {calcularProgresso(roadmap)}%
                      </Text>
                    </View>
                    <View style={styles.emptyProgressBar}>
                      <View
                        style={[
                          styles.filledProgressBar,
                          {
                            width: `${calcularProgresso(roadmap)}%`,
                          },
                        ]}
                      />
                    </View>
                  </View>

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={[
                        globalStyles.secondaryButton,
                        {
                          flex: 1,
                          paddingVertical: 8,
                        },
                      ]}
                      onPress={() =>
                        router.push(`roadmap/visualizar/${roadmap.id}`)
                      }
                    >
                      <Eye color={"black"} size={18} />
                      <Text style={globalStyles.secondaryButtonText}>
                        Visualizar
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[
                        globalStyles.secondaryButton,
                        styles.secundaryButton,
                      ]}
                    >
                      <Pencil color={"black"} size={18} />
                    </TouchableOpacity>

                    <Pressable
                      style={(state: any) => [
                        globalStyles.secondaryButton,
                        styles.secundaryButton,
                        {
                          paddingVertical: 8,
                          width: 40,
                          backgroundColor: state.hovered ? "#ef4444" : "#fff",
                          transitionProperty: "background-color",
                          transitionDuration: "200ms",
                          transitionTimingFunction: "ease-in-out",
                        },
                      ]}
                    >
                      {(state: any) => (
                        <Trash2
                          color={state.hovered ? "#fff" : "#000"}
                          size={18}
                          strokeWidth={2.5}
                        />
                      )}
                    </Pressable>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
  },

  subtitle: {
    fontSize: 16,
    color: "#525252",
    lineHeight: 22,
  },

  noRoadmapsContainer: {
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 76,
    paddingHorizontal: 32,
    borderRadius: 8,
  },

  roadmapsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 45,
    justifyContent: "center",
  },

  roadmapCard: {
    width: 420,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
    gap: 16,
    padding: 24,
    borderRadius: 8,
  },

  roadmapCardTitle: {
    fontSize: 22,
    fontWeight: 600,
    marginBottom: 2,
  },

  roadmapCardText: {
    fontSize: 16,
    fontWeight: 400,
    color: "#555555",
    textAlign: "left",
  },

  emptyProgressBar: {
    borderRadius: 20,
    backgroundColor: "#DBE6FD",
    height: 8,
    overflow: "hidden",
  },

  filledProgressBar: {
    height: "100%",
    backgroundColor: colors.lightBlue,
  },

  cardActionsRow: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },

  secundaryButton: {
    paddingHorizontal: 12,
  },

  button: {
    width: "100%",
    maxWidth: 300,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as any,
  },

  buttonText: {
    fontSize: 14,
  },
});
