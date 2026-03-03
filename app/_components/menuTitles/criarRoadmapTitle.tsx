import { AntDesign } from "@expo/vector-icons";
import { pageNames } from "../../../utils/pageNames";
import { Text, View } from "react-native";
import { getGlobalStyles } from "../../../styles/globalStyles";

type Props = {
  size: number;
  color: string;
};

export default function CriarRoadmapTitle({ size, color }: Props) {
  const globalStyles = getGlobalStyles();

  return (
    <View style={globalStyles.iconTitleContainer}>
      <AntDesign name="folder-add" size={size} color={color} />
      <Text style={[globalStyles.title, { color: color }]} selectable={false}>
        {pageNames.roadmap.criarRoadmap}
      </Text>
    </View>
  );
}
