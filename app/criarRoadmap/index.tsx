import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useState } from "react";
import { colors } from "../../colors";

export default function CriarRoadmap() {
  const [prompt, setPrompt] = useState<string>("");

  const isDisabled = prompt.trim().length < 5;

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text selectable={false} style={styles.title}>
          O que você quer aprender hoje?
        </Text>

        <Text selectable={false} style={styles.subtitle}>
          Descreva o tema e criaremos um roadmap personalizado para você.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Ex: Quero aprender React do zero até nível avançado..."
          placeholderTextColor={colors.gray}
          multiline
          numberOfLines={4}
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity
          style={[
            styles.button,
            isDisabled && { opacity: 0.6, cursor: "not-allowed" as any },
          ]}
          disabled={isDisabled}
        >
          <Text selectable={false} style={styles.buttonText}>
            Gerar Roadmap
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  card: {
    width: "100%",
    maxWidth: 600,
    backgroundColor: "#FFFFFF",
    padding: 32,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
    gap: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "600",
    color: "#1E293B",
  },

  subtitle: {
    fontSize: 16,
    color: "#64748B",
    lineHeight: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: "#1E293B",
    textAlignVertical: "top",
    minHeight: 120,
  },

  button: {
    backgroundColor: "#2563EB",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});
