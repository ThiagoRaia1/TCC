import React, { useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import GradientScreen from "../_components/GradientBackground";
import { gerarRoadmap } from "../../services/groq";
import { useLoading } from "../../context/providers/loading";
import { useAuth } from "../../context/auth";
import RoadmapModal from "../_components/RoadmapModal";
import { colors } from "../../styles/colors";
import { ICriarRoadmap } from "../../interfaces/roadmap";

export default function CriarRoadmap() {
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [prompt, setPrompt] = useState<string>("");

  const [roadmap, setRoadmap] = useState<ICriarRoadmap>();
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const isDisabled = prompt.trim().length < 5;

  return (
    <GradientScreen>
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
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={4}
          value={prompt}
          onChangeText={setPrompt}
        />

        <TouchableOpacity
          style={[styles.button, isDisabled && styles.buttonDisabled]}
          disabled={isDisabled}
          onPress={async () => {
            try {
              showLoading();
              if (!usuario) return;

              console.log(usuario.sub);
              console.log(prompt);

              const result = await gerarRoadmap(prompt);
              console.log(result);

              setRoadmap(result);
              setModalVisible(true);
            } catch (erro: any) {
              alert(erro.message);
            } finally {
              hideLoading();
            }
          }}
        >
          <Text selectable={false} style={styles.buttonText}>
            Gerar Roadmap
          </Text>
        </TouchableOpacity>
      </View>

      <RoadmapModal
        visible={modalVisible}
        roadmap={roadmap}
        onClose={() => setModalVisible(false)}
      />
    </GradientScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  card: {
    width: "100%",
    maxWidth: 700,
    backgroundColor: "#1e293b",
    padding: 32,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    gap: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#ffffff",
  },

  subtitle: {
    fontSize: 16,
    color: "#94a3b8",
    lineHeight: 22,
  },

  input: {
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 18,
    padding: 18,
    fontSize: 16,
    color: "#ffffff",
    textAlignVertical: "top",
    minHeight: 140,
    backgroundColor: "#0f172a",
  },

  button: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 16,
    borderRadius: 18,
    alignItems: "center",
    marginTop: 10,
  },

  buttonDisabled: {
    opacity: 0.5,
    cursor: "not-allowed" as any,
  },

  buttonText: {
    color: "#0f172a",
    fontSize: 18,
    fontWeight: "bold",
  },
});
