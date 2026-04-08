import { StyleSheet, View } from "react-native";
import GradientScreen from "../_components/GradientBackground";
import { colors } from "../../styles/colors";
import { IRoadmap } from "../../interfaces/roadmap";
import { useEffect, useState } from "react";
import { getAllRoadmap } from "../../services/roadmap";
import { useLoading } from "../../context/providers/loading";
import RoadmapCard from "../_components/RoadmapCard";

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
    width: "100%",
    justifyContent: "center",
    gap: 10,
  },
  roadmapCardDadosText: {
    fontSize: 20,
    color: "white",
  },
});

export default function MeusRoadmaps() {
  const { showLoading, hideLoading } = useLoading();
  const [roadmaps, setRoadmaps] = useState<IRoadmap[]>([]);

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
    <GradientScreen>
      <View style={styles.roadmapsContainer}>
        {roadmaps.map((roadmap, index) => (
          <RoadmapCard key={index} roadmap={roadmap} />
        ))}
      </View>
    </GradientScreen>
  );
}
