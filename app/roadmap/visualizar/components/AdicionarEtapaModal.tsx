import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getGlobalStyles } from "../../../../styles/globalStyles";
import { useState } from "react";
import { updateRoadmap } from "../../../../services/roadmap";
import { IRoadmap, IUpdateRoadmap } from "../../../../interfaces/roadmap";
import { ICriarEtapa } from "../../../../interfaces/etapa";
import { useLoading } from "../../../../context/providers/loading";
import { useRoadmap } from "../../../../context/providers/roadmap";

type AdicionarEtapaModalProps = {
  closeModal: () => void;
};

export default function AdicionarEtapaModal({
  closeModal,
}: AdicionarEtapaModalProps) {
  const globalStyles = getGlobalStyles();
  const { roadmapContext } = useRoadmap();
  const { showLoading, hideLoading } = useLoading();
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");

  const onSave = async () => {
    try {
      showLoading();
      if (!roadmapContext) return;
      const etapasAtuais = Array.isArray(roadmapContext.etapas)
        ? roadmapContext.etapas
        : [];
      const novaEtapa: ICriarEtapa = {
        titulo,
        ordem: etapasAtuais.length + 1,
        descricao,
        concluido: true,
      };

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmapContext,
        etapas: [...etapasAtuais, novaEtapa],
      };

      const resultado = await updateRoadmap(novoRoadmap);
      closeModal();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View
      style={{
        width: "100%",
        backgroundColor: "#F6F8FE",
        borderRadius: 10,
        padding: 20,
        gap: 24,
        borderColor: "rgba(61, 132, 246, 0.41)",
        borderStyle: "dashed",
        borderWidth: 2,
      }}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Título: *</Text>
        <TextInput
          style={globalStyles.input}
          onChangeText={(text) => setTitulo(text)}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Descrição:</Text>
        <TextInput
          style={globalStyles.input}
          multiline
          numberOfLines={5}
          onChangeText={(text) => setDescricao(text)}
        />
      </View>

      <View style={{ flexDirection: "row", gap: 8, alignSelf: "flex-end" }}>
        <TouchableOpacity
          style={[globalStyles.actionButton, { height: 40, width: 90 }]}
          onPress={onSave}
        >
          <Text style={{ fontSize: 16, color: "white", fontWeight: 600 }}>
            Salvar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.secondaryButton, { height: 40, width: 90 }]}
          onPress={closeModal}
        >
          <Text style={{ fontSize: 16, color: "black", fontWeight: 600 }}>
            Cancelar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 18,
    fontWeight: 600,
  },
});
