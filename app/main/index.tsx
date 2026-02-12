import { Text, View, TextInput } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import TopBar from "../_components/TopBar";
import MeusRoadmaps from "../meusRoadmaps";
import CriarRoadmap from "../criarRoadmap";
import { useLocalSearchParams } from "expo-router";

export default function Main() {
  const params = useLocalSearchParams();
  const globalStyles = getGlobalStyles();
  return (
    <View style={globalStyles.background}>
      <TopBar />
      {params.mainPage === "CriarRoadmap" && <CriarRoadmap />}
    </View>
  );
}
