import { View, TouchableOpacity, Text, Modal, Pressable } from "react-native";
import { useLoading } from "../../../context/providers/loading";
import { IEtapa } from "../../../interfaces/etapa";
import { IRoadmap } from "../../../interfaces/roadmap";
import { deleteRoadmap, getRoadmap } from "../../../services/roadmap";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { router } from "expo-router";
import { deleteEtapa } from "../../../services/etapa";
import { IReferencia } from "../../../interfaces/referencia";
import { deleteReferencia } from "../../../services/referecia";

type DeleteModalProps = {
  closeModal: () => void;
  roadmap?: IRoadmap;
  setRoadmap?: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;
  tipoItem: "roadmap" | "etapa" | "objetivo" | "referencia";
  etapa?: IEtapa;
  referencia?: IReferencia;
};

export default function DeleteModal({
  closeModal,
  roadmap,
  setRoadmap,
  tipoItem,
  etapa,
  referencia,
}: DeleteModalProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const onDeleteRoadmap = async () => {
    try {
      showLoading();
      if (!roadmap) return;

      const resultado = await deleteRoadmap(roadmap.id);
      alert(`Roadmap "${roadmap.tema}" excluído com sucesso!`);

      router.push("/roadmap");
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const onDeleteEtapa = async () => {
    try {
      showLoading();
      if (!roadmap || !setRoadmap || !etapa) return;

      const resultado = await deleteEtapa(etapa.id);
      alert(`Etapa "${etapa.titulo}" excluída com sucesso!`);

      const novoRoadmap = await getRoadmap(roadmap.id);
      setRoadmap(novoRoadmap);

      closeModal();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const onDeleteReferencia = async () => {
    try {
      showLoading();
      if (!roadmap || !setRoadmap || !referencia) return;

      const resultado = await deleteReferencia(referencia.id);

      const novoRoadmap = await getRoadmap(roadmap.id);
      setRoadmap(novoRoadmap);

      closeModal();
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <Modal transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={closeModal}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        <View
          style={{
            width: 835,
            backgroundColor: "white",
            borderRadius: 10,
            padding: 20,
            alignItems: "center",
            gap: 20,
          }}
        >
          {tipoItem == "roadmap" && (
            <Text style={{ fontSize: 24, textAlign: "center" }}>
              Tem certeza que deseja excluir o roadmap
              <strong> "{roadmap && roadmap.tema}"</strong>?<br />
              <i>Essa ação não pode ser desfeita.</i>
            </Text>
          )}

          {tipoItem == "etapa" && (
            <Text style={{ fontSize: 24, textAlign: "center" }}>
              Tem certeza que deseja excluir a etapa
              <strong> "{etapa?.titulo}"</strong>?<br />
              <i>Essa ação não pode ser desfeita.</i>
            </Text>
          )}

          {tipoItem == "referencia" && (
            <Text style={{ fontSize: 24, textAlign: "center" }}>
              Tem certeza que deseja excluir a referência{" "}
              <Text style={{ fontWeight: "bold" }}>"{referencia?.nome}"</Text>?
              {"\n"}
              <Text style={{ fontStyle: "italic" }}>
                Essa ação não pode ser desfeita.
              </Text>
            </Text>
          )}

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[
                globalStyles.actionButton,
                { height: 40, width: 90, backgroundColor: "#ef4444" },
              ]}
              onPress={() => {
                if (tipoItem == "roadmap") onDeleteRoadmap();
                if (tipoItem == "etapa") onDeleteEtapa();
                if (tipoItem == "referencia") onDeleteReferencia();
              }}
            >
              <Text style={{ fontSize: 16, color: "white", fontWeight: 600 }}>
                Deletar
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
      </View>
    </Modal>
  );
}
