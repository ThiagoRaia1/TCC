import { View, TextInput, Text, TouchableOpacity } from "react-native";
import { getGlobalStyles } from "../../globalStyles";

export default function CriarRoadmap() {
  const globalStyles = getGlobalStyles();
  return (
    <View style={[globalStyles.mainContainer, { gap: 20 }]}>
      <Text>Diga-nos o que quer aprender!</Text>
      <TextInput style={[globalStyles.input, { width: 400 }]} />
      <TouchableOpacity style={globalStyles.button}>
        <Text style={globalStyles.buttonText}>Gerar Roadmap</Text>
      </TouchableOpacity>
    </View>
  );
}
