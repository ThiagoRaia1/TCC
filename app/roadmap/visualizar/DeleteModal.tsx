import { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { useLoading } from "../../../context/providers/loading";
import { ICriarEtapa, IEtapa } from "../../../interfaces/etapa";
import { IRoadmap, IUpdateRoadmap } from "../../../interfaces/roadmap";
import { deleteRoadmap, updateRoadmap } from "../../../services/roadmap";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { router } from "expo-router";
import { deleteEtapa } from "../../../services/etapa";

type DeleteModalProps = {
  closeModal: () => void;
  roadmap: IRoadmap;
  tipoItem: "roadmap" | "etapa" | "objetivo";
  etapa?: IEtapa;
};

export default function DeleteModal({
  closeModal,
  roadmap,
  tipoItem,
  etapa,
}: DeleteModalProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const onDeleteRoadmap = async () => {
    try {
      showLoading();

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
      if (!etapa) return;
      const resultado = await deleteEtapa(etapa.id);
      alert(`Etapa "${etapa.titulo}" excluída com sucesso!`);

      router.push(`/roadmap/visualizar/${roadmap.id}`);
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
              <strong> "{roadmap.tema}"</strong>?<br />
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

          <View style={{ flexDirection: "row", gap: 8 }}>
            <TouchableOpacity
              style={[
                globalStyles.actionButton,
                { height: 40, width: 90, backgroundColor: "#ef4444" },
              ]}
              onPress={() => {
                if (tipoItem == "roadmap") onDeleteRoadmap();
                if (tipoItem == "etapa") onDeleteEtapa();
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
