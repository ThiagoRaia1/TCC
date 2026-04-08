import { useRef, useState } from "react";
import { Animated, View, Text, StyleSheet } from "react-native";
import { IRoadmap } from "../../interfaces/roadmap";
import { colors } from "../../styles/colors";
import { Feather, FontAwesome6 } from "@expo/vector-icons";
import MenuOptionButton from "./MenuOptionButton";
import { getGlobalStyles } from "../../styles/globalStyles";
import { deleteRoadmap } from "../../services/roadmap";
import { useLoading } from "../../context/providers/loading";
import { router } from "expo-router";
import { pageNames } from "../../utils/pageNames";
import { useRoadmap } from "../../context/providers/roadmap";

const styles = StyleSheet.create({
  roadmapsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    flexDirection: "row",
    gap: 24,
    flexWrap: "wrap",
  },
  roadmapCard: {
    backgroundColor: colors.secundaryDarkBlue,
    borderColor: colors.secundaryDarkBlueBorder,
    borderWidth: 3,
    borderRadius: 20,
    width: 500,
    height: 250,
    padding: 24,
    alignItems: "center",
  },
  roadmapCardTitle: {
    fontSize: 26,
    fontWeight: 700,
    color: "white",
  },
  roadmapCardDados: {
    flex: 1,
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  roadmapCardColumn: {
    gap: 10,
  },
  roadmapCardDadosText: {
    fontSize: 20,
    color: "white",
  },
});

export default function RoadmapCard({ roadmap }: { roadmap: IRoadmap }) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const { setRoadmapSelecionado } = useRoadmap();

  const scale = useRef(new Animated.Value(1)).current;

  const onHoverIn = () => {
    Animated.spring(scale, {
      toValue: 1.05,
      useNativeDriver: true,
    }).start();
  };

  const onHoverOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  };

  const handleDeleteRoadmap = async () => {
    try {
      showLoading();
      const roadmapDeletado = await deleteRoadmap(roadmap.id);

      alert("Roadmap deletado com sucesso!");

      router.push({
        pathname: "/main",
        params: {
          pageName: pageNames.roadmap.main,
          subPage: pageNames.roadmap.meusRoadmaps,
        },
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View
      {...({
        onMouseEnter: onHoverIn,
        onMouseLeave: onHoverOut,
      } as any)}
    >
      <Animated.View
        style={[
          styles.roadmapCard,
          {
            transform: [{ scale }],
          },
        ]}
      >
        <Text style={styles.roadmapCardTitle}>
          {roadmap.tema.toUpperCase()}
        </Text>

        <View style={styles.roadmapCardDados}>
          <View style={styles.roadmapCardColumn}>
            <Text style={styles.roadmapCardDadosText}>
              Nível: {roadmap.nivel}
            </Text>
            <Text style={styles.roadmapCardDadosText}>
              Duração Estimada: {roadmap.duracaoEstimada}
            </Text>
            <Text style={styles.roadmapCardDadosText}>
              Porcentagem de Conclusão: {roadmap.porcentagemConclusao}%
            </Text>
          </View>

          <View style={styles.roadmapCardColumn}>
            {/* Editar */}
            <MenuOptionButton
              containerStyle={globalStyles.actionButton}
              label={<Feather name="edit" size={40} color="white" />}
              onPress={() => {
                setRoadmapSelecionado(roadmap);

                router.push({
                  pathname: "/main",
                  params: {
                    pageName: pageNames.roadmap.main,
                    subPage: pageNames.roadmap.roadmapSelecionado,
                  },
                });
              }}
            />

            {/* Deletar */}
            <MenuOptionButton
              containerStyle={[
                globalStyles.actionButton,
                { backgroundColor: colors.red },
              ]}
              label={<FontAwesome6 name="trash" size={35} color="white" />}
              onPress={handleDeleteRoadmap}
            />
          </View>
        </View>
      </Animated.View>
    </View>
  );
}
