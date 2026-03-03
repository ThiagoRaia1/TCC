import { Text, View, TextInput } from "react-native";
import { getGlobalStyles } from "../../globalStyles";
import TopBar from "../_components/TopBar";
import MeusRoadmaps from "../meusRoadmaps";
import CriarRoadmap from "../criarRoadmap";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import SideBar from "../_components/SideBar";

export default function Main() {
  const params = useLocalSearchParams();
  const globalStyles = getGlobalStyles();
  const [isSidebarVisible, setIsSideBarVisible] = useState<boolean>(false);
  return (
    <View style={globalStyles.background}>
      <SideBar
        visible={isSidebarVisible}
        closeModal={() => setIsSideBarVisible(!isSidebarVisible)}
      />
      <TopBar openSideBar={() => setIsSideBarVisible(!isSidebarVisible)} />
      {params.pageName === "roadmaps" && params.subPage === "criarRoadmap" && (
        <CriarRoadmap />
      )}
      {params.pageName === "roadmaps" && params.subPage === "meusRoadmaps" && (
        <MeusRoadmaps />
      )}
    </View>
  );
}
