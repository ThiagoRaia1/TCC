import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { colors } from "../../styles/colors";
import { getGlobalStyles } from "../../styles/globalStyles";

interface Etapa {
  ordem: number;
  titulo: string;
  descricao: string;
  duracao: string;
  objetivos: string[];
  recursos_sugeridos: string[];
}

export interface IRoadmap {
  id: number;
  tema: string;
  nivel: string;
  duracao_estimada: string;
  descricao_geral: string;
  usuarioId: number;
  etapas: Etapa[];
}

type Props = {
  visible: boolean;
  roadmap?: IRoadmap | null;
  onClose: () => void;
};

export default function RoadmapModal({ visible, roadmap, onClose }: Props) {
  const globalStyles = getGlobalStyles();
  if (!roadmap) return null;

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
              <Text style={styles.text}>{roadmap.duracao_estimada}</Text>

              <Text style={styles.label}>Descrição</Text>
              <Text style={styles.text}>{roadmap.descricao_geral}</Text>
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
                      • {obj}
                    </Text>
                  ))}

                  {/* RECURSOS */}
                  <Text style={styles.subTitle}>Recursos sugeridos</Text>
                  {etapa.recursos_sugeridos.map((rec, i) => (
                    <Text key={i} style={styles.listItem}>
                      • {rec}
                    </Text>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
          <View style={{ flexDirection: "row", gap: 20 }}>
            <TouchableOpacity style={globalStyles.button}>
              <Text style={globalStyles.buttonText}>Salvar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={globalStyles.secondaryButton}>
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
