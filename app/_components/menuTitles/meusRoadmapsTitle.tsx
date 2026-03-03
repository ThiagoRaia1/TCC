import { FontAwesome6 } from "@expo/vector-icons";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { Text, View } from "react-native";
import { pageNames } from "../../../utils/pageNames";

type Props = {
  size: number;
  color: string;
};

export default function MeusRoadmapsTitle({ size, color }: Props) {
  const globalStyles = getGlobalStyles();

  return (
    <View style={globalStyles.iconTitleContainer}>
      <FontAwesome6 name="sitemap" size={size} color={color} />
      <Text style={[globalStyles.title, { color: color }]} selectable={false}>
        {pageNames.roadmap.meusRoadmaps}
      </Text>
    </View>
  );
}
