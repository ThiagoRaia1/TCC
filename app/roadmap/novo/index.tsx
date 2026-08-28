import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { colors } from "../../../styles/colors";
import { useLoading } from "../../../context/providers/loading";
import { router } from "expo-router";
import { ICriarRoadmap } from "../../../interfaces/roadmap";
import { useState } from "react";
import { salvarRoadmap } from "../../../services/roadmap";
import { useAuth } from "../../../context/auth";

export default function NovoRoadmap() {
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();
  const { usuario } = useAuth();

  const [temaRoadmap, setTemaRoadmap] = useState<string>("");
  const [descricaoRoadmap, setDescricaoRoadmap] = useState<string>("");

  const style = StyleSheet.create({
    labelInputContainer: {
      gap: 8,
    },
    sectionContainer: {
      boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
      gap: 24,
      paddingVertical: 24,
      paddingHorizontal: 32,
      borderRadius: 8,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 600,
    },
  });

  const handleCriarRoadmap = async () => {
    try {
      if (usuario) {
        // FIX ME: Consertar criacao do roadmap
        const roadmap: ICriarRoadmap = {
          tema: temaRoadmap,
          descricaoGeral: descricaoRoadmap,
          duracaoEstimada: "1 Mes",
          nivel: "iniciante",
          etapas: [],
          usuarioId: usuario.sub,
        };

        const resultado = await salvarRoadmap(roadmap);

        router.push(`roadmap/visualizar/${resultado.id}`);
      }
    } catch (erro: any) {
      alert(erro.message);
    }
  };

  return (
    <ScrollView style={{ paddingHorizontal: 40 }}>
      <View
        style={{
          gap: 32,
          maxWidth: 1350,
          width: "100%",
          paddingVertical: 40,
          alignSelf: "center",
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <Text style={{ fontSize: 40, fontWeight: 600 }}>
            Criar novo roadmap
          </Text>

          <TouchableOpacity
            onPress={() => {
              router.push("/roadmap");
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 600 }}>← Voltar</Text>
          </TouchableOpacity>
        </View>
        <View style={style.sectionContainer}>
          <Text style={style.sectionTitle}>Detalhes do roadmap</Text>

          <View style={style.labelInputContainer}>
            <Text>Título*</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Insira o título do roadmap"
              placeholderTextColor={colors.placeholderTextColor}
              onChangeText={(text) => {
                setTemaRoadmap(text);
              }}
            />
          </View>

          <View style={style.labelInputContainer}>
            <Text>Descrição</Text>
            <TextInput
              style={globalStyles.input}
              placeholder="Descreva seu plano de aprendizado"
              placeholderTextColor={colors.placeholderTextColor}
              multiline={true}
              numberOfLines={4}
              onChangeText={(text) => {
                setDescricaoRoadmap(text);
              }}
            />
          </View>

          <View
            style={{ alignItems: "flex-start", flexDirection: "row", gap: 12 }}
          >
            <TouchableOpacity
              style={globalStyles.confirmButton}
              onPress={handleCriarRoadmap}
            >
              <Text style={globalStyles.confirmButtonText}>Criar Roadmap</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[globalStyles.secondaryButton, { height: "100%" }]}
              onPress={() => router.push("/roadmap")}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={style.sectionContainer}>
          <Text style={style.sectionTitle}>Etapas iniciais (opcional)</Text>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TextInput
              style={[globalStyles.input, { flex: 1 }]}
              placeholder="Insira o título da etapa"
              placeholderTextColor={colors.placeholderTextColor}
            />
            <TouchableOpacity style={globalStyles.confirmButton}>
              <Text style={globalStyles.confirmButtonText}>+ Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
