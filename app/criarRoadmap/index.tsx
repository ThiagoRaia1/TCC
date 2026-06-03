import React, { useEffect, useState } from "react";
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import GradientScreen from "../_components/GradientBackground";
import { gerarRoadmap } from "../../services/groq";
import { useLoading } from "../../context/providers/loading";
import { useAuth } from "../../context/auth";
import RoadmapModal from "../_components/RoadmapModal";
import { colors } from "../../styles/colors";
import { ICriarRoadmap, IRoadmap } from "../../interfaces/roadmap";
import Header from "../_components/Header";
import { getAllRoadmap } from "../../services/roadmap";
import { BookOpen } from "lucide-react-native";
import { getGlobalStyles } from "../../styles/globalStyles";
import { router } from "expo-router";
import { pageNames } from "../../utils/pageNames";

export default function CriarRoadmap() {
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [prompt, setPrompt] = useState<string>("");
  const globalStyles = getGlobalStyles();

  const [roadmap, setRoadmap] = useState<ICriarRoadmap>();
  const [modalVisible, setModalVisible] = useState<boolean>(true);

  const isDisabled = prompt.trim().length < 5;

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
    // <GradientScreen>
    //   <View style={styles.card}>
    //     <Text selectable={false} style={styles.title}>
    //       O que você quer aprender hoje?
    //     </Text>

    //     <Text selectable={false} style={styles.subtitle}>
    //       Descreva o tema e criaremos um roadmap personalizado para você.
    //     </Text>

    //     <TextInput
    //       style={styles.input}
    //       placeholder="Ex: Quero aprender React do zero até nível avançado..."
    //       placeholderTextColor="#94a3b8"
    //       multiline
    //       numberOfLines={4}
    //       value={prompt}
    //       onChangeText={setPrompt}
    //     />

    //     <TouchableOpacity
    //       style={[styles.button, isDisabled && styles.buttonDisabled]}
    //       disabled={isDisabled}
    //       onPress={async () => {
    //         try {
    //           showLoading();
    //           if (!usuario) return;

    //           const result = await gerarRoadmap(prompt);

    //           setRoadmap(result);
    //           setModalVisible(true);
    //         } catch (erro: any) {
    //           alert(erro.message);
    //         } finally {
    //           hideLoading();
    //         }
    //       }}
    //     >
    //       <Text selectable={false} style={styles.buttonText}>
    //         Gerar Roadmap
    //       </Text>
    //     </TouchableOpacity>
    //   </View>

    //   <RoadmapModal
    //     visible={modalVisible}
    //     roadmap={roadmap}
    //     onClose={() => setModalVisible(false)}
    //   />
    // </GradientScreen>
    <ScrollView style={{ paddingHorizontal: 40 }}>
      <View
        style={{
          gap: 40,
          maxWidth: 1350,
          width: "100%",
          paddingVertical: 40,
          alignSelf: "center",
        }}
      >
        <View>
          <Text style={styles.title}>Seus Roadmaps</Text>
          <Text style={styles.subtitle}>Gerencie e rastreie seus estudos</Text>
        </View>

        <View
          style={{
            boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            gap: 12,
            paddingVertical: 76,
            paddingHorizontal: 32,
            borderRadius: 8,
          }}
        >
          <BookOpen size={60} color="#3D84F6" />
          <Text style={{ fontSize: 20, fontWeight: 600, textAlign: "center" }}>
            Ainda não há roadmaps
          </Text>
          <Text style={{ fontSize: 16, color: "#525252", textAlign: "center" }}>
            Crie seu primeiro roteiro de aprendizado para começar.
          </Text>

          <TouchableOpacity
            style={[globalStyles.confirmButton, styles.button]}
            onPress={() =>
              router.push({
                pathname: "/main",
                params: {
                  pageName: pageNames.roadmap.main,
                  subPage: pageNames.roadmap.novoRoadmap,
                },
              })
            }
          >
            <Text style={[globalStyles.confirmButtonText, styles.buttonText]}>
              + Crie seu primeiro roadmap
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[globalStyles.confirmButton, styles.button]}>
            <Text style={[globalStyles.confirmButtonText, styles.buttonText]}>
              Gere com inteligência artificial
            </Text>
          </TouchableOpacity>
        </View>
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
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
  },

  subtitle: {
    fontSize: 16,
    color: "#525252",
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
