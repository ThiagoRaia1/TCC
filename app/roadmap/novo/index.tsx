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
import { ICriarEtapa } from "../../../interfaces/etapa";

export default function NovoRoadmap() {
  const { showLoading, hideLoading } = useLoading();
  const globalStyles = getGlobalStyles();
  const { usuario } = useAuth();

  const [temaRoadmap, setTemaRoadmap] = useState<string>("");
  const [descricaoRoadmap, setDescricaoRoadmap] = useState<string>("");
  const [etapas, setEtapas] = useState<ICriarEtapa[]>([]);

  const [tituloEtapa, setTituloEtapa] = useState("");
  const [descricaoEtapa, setDescricaoEtapa] = useState("");

  const addEtapa = () => {
    const titulo = tituloEtapa.trim();
    const descricao = descricaoEtapa.trim();

    if (!titulo) {
      alert("O título da etapa é obrigatório.");
      return;
    }

    const novaEtapa: ICriarEtapa = {
      titulo,
      ordem: etapas.length + 1,
      descricao,
      concluido: false,
      objetivos: [],
      referencias: [],
      anotacoes: {
        plainText: "",
        editorState: null,
      },
    };

    setEtapas((prev) => [...prev, novaEtapa]);

    // Limpa os campos para adicionar outra etapa
    setTituloEtapa("");
    setDescricaoEtapa("");
  };

  const handleCriarRoadmap = async () => {
    try {
      showLoading();
      if (usuario) {
        const roadmap: ICriarRoadmap = {
          tema: temaRoadmap,
          descricaoGeral: descricaoRoadmap,
          etapas: etapas,
          usuarioId: usuario.sub,
        };

        const resultado = await salvarRoadmap(roadmap);

        router.push(`roadmap/visualizar/${resultado.id}`);
      }
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const style = StyleSheet.create({
    labelInputContainer: {
      gap: 8,
    },
    sectionContainer: {
      backgroundColor: "white",
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
          <View style={{ gap: 12 }}>
            {/* TÍTULO DA ETAPA */}
            <TextInput
              style={globalStyles.input}
              placeholder="Insira o título da etapa"
              placeholderTextColor={colors.placeholderTextColor}
              value={tituloEtapa}
              onChangeText={setTituloEtapa}
            />

            {/* DESCRIÇÃO DA ETAPA */}
            <TextInput
              style={[
                globalStyles.input,
                {
                  minHeight: 90,
                  textAlignVertical: "top",
                },
              ]}
              placeholder="Descreva o que será estudado nesta etapa"
              placeholderTextColor={colors.placeholderTextColor}
              value={descricaoEtapa}
              onChangeText={setDescricaoEtapa}
              multiline
              numberOfLines={4}
            />

            <TouchableOpacity
              style={[
                globalStyles.confirmButton,
                {
                  alignSelf: "flex-start",
                },
              ]}
              onPress={addEtapa}
            >
              <Text style={globalStyles.confirmButtonText}>
                + Adicionar etapa
              </Text>
            </TouchableOpacity>
          </View>
          {etapas.length > 0 && (
            <View style={{ gap: 12 }}>
              <Text style={style.sectionTitle}>Etapas adicionadas</Text>

              {etapas.map((etapa) => (
                <View
                  key={etapa.ordem}
                  style={{
                    borderWidth: 1,
                    borderColor: "#ddd",
                    borderRadius: 8,
                    padding: 16,
                    gap: 6,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View>
                      <Text
                        style={{
                          fontSize: 16,
                          fontWeight: "600",
                        }}
                      >
                        {etapa.ordem}. {etapa.titulo}
                      </Text>

                      {etapa.descricao ? (
                        <Text
                          style={{
                            color: "#545454",
                            fontSize: 13,
                          }}
                        >
                          {etapa.descricao}
                        </Text>
                      ) : (
                        <Text
                          style={{
                            color: "#545454",
                            fontSize: 13,
                            fontStyle: "italic",
                          }}
                        >
                          Etapa sem descrição
                        </Text>
                      )}
                    </View>

                    <TouchableOpacity
                      onPress={() => {
                        setEtapas((prev) =>
                          prev
                            .filter((item) => item.ordem !== etapa.ordem)
                            .map((item, index) => ({
                              ...item,
                              ordem: index + 1,
                            })),
                        );
                      }}
                    >
                      <Text
                        style={{
                          color: "#ef4444",
                          fontWeight: "600",
                        }}
                      >
                        Remover
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
