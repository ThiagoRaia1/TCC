import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Linking,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { getGlobalStyles } from "../../styles/globalStyles";
import { ICriarRoadmap } from "../../interfaces/roadmap";
import { useAuth } from "../../context/auth";
import { salvarRoadmap } from "../../services/roadmap";
import { useLoading } from "../../context/providers/loading";

type Props = {
  visible: boolean;
  roadmap?: ICriarRoadmap | null;
  onClose: () => void;
};

export default function RoadmapModal({ visible, roadmap, onClose }: Props) {
  const globalStyles = getGlobalStyles();
  const { usuario } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  if (!roadmap) return null;

  const handleSalvarRoadmap = async () => {
    try {
      showLoading();
      if (!usuario) return;
      const roadmapDto: ICriarRoadmap = {
        tema: roadmap.tema,
        descricaoGeral: roadmap.descricaoGeral,
        duracaoEstimada: roadmap.duracaoEstimada,
        nivel: roadmap.nivel,
        etapas: roadmap.etapas,
        usuarioId: usuario.sub,
      };

      const resultado = await salvarRoadmap(roadmapDto);
      
      alert("Roadmap salvo com sucesso!");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {/* HEADER */}
          <View style={styles.header}>
            <Text style={styles.title}>{roadmap.tema}</Text>

            <TouchableOpacity onPress={onClose}>
              <AntDesign name="close" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView>
            {/* INFO GERAL */}
            <View style={styles.section}>
              <Text style={styles.label}>Nível</Text>
              <Text style={styles.text}>{roadmap.nivel}</Text>

              <Text style={styles.label}>Duração estimada</Text>
              <Text style={styles.text}>{roadmap.duracaoEstimada}</Text>

              <Text style={styles.label}>Descrição</Text>
              <Text style={styles.text}>{roadmap.descricaoGeral}</Text>
            </View>

            {/* ETAPAS */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Etapas</Text>

              {roadmap.etapas.map((etapa) => (
                <View key={etapa.ordem} style={styles.etapaCard}>
                  <Text style={styles.etapaTitulo}>
                    {etapa.ordem}. {etapa.titulo}
                  </Text>

                  <Text style={styles.etapaDuracao}>⏱ {etapa.duracao}</Text>

                  <Text style={styles.text}>{etapa.descricao}</Text>

                  {/* OBJETIVOS */}
                  <Text style={styles.subTitle}>Objetivos</Text>
                  {etapa.objetivos.map((obj, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {obj.descricao}
                    </Text>
                  ))}

                  {/* RECURSOS */}
                  <Text style={styles.subTitle}>Recursos sugeridos</Text>
                  {etapa.recursosSugeridos &&
                    etapa.recursosSugeridos.map((rec, i) => (
                      <Text
                        key={i}
                        style={styles.listItem}
                        onPress={() => {
                          if (rec.link) {
                            Linking.openURL(rec.link);
                          }
                        }}
                      >
                        • {rec.titulo} - {rec.tipo}
                      </Text>
                    ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity
              style={globalStyles.button}
              onPress={handleSalvarRoadmap}
            >
              <Text style={globalStyles.buttonText}>Salvar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={globalStyles.secondaryButton}
              onPress={onClose}
            >
              <Text style={globalStyles.secondaryButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },

  modal: {
    width: "90%",
    maxHeight: "85%",
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.lightBlue,
    marginBottom: 10,
  },

  label: {
    color: "#94a3b8",
    marginTop: 8,
  },

  text: {
    color: "white",
    marginTop: 4,
  },

  etapaCard: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },

  etapaTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.lightBlue,
  },

  etapaDuracao: {
    color: "#94a3b8",
    marginBottom: 6,
  },

  subTitle: {
    marginTop: 10,
    fontWeight: "bold",
    color: "#cbd5f5",
  },

  listItem: {
    color: "#e2e8f0",
    marginLeft: 6,
    marginTop: 2,
  },
});
