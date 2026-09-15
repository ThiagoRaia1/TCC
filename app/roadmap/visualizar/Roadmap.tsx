import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { useEffect, useState } from "react";

import { colors } from "../../../styles/colors";
import { TipoItem } from "./[id]";
import AdicionarEtapaModal from "./components/AdicionarEtapaModal";
import EtapaCard from "./components/EtapaCard";

import { IRoadmap, IUpdateRoadmap } from "../../../interfaces/roadmap";
import { useLoading } from "../../../context/providers/loading";
import { ICriarReferencia } from "../../../interfaces/referencia";
import { TipoReferencia } from "../../../utils/tiposReferencia";
import { updateRoadmap } from "../../../services/roadmap";
import { IEtapa } from "../../../interfaces/etapa";

type RoadmapProps = {
  roadmap: IRoadmap;

  setRoadmap: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;

  tipoItemASerExcluido: TipoItem;

  setTipoItemASerExcluido: React.Dispatch<React.SetStateAction<TipoItem>>;

  deleteModalVisible: boolean;

  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>;

  getData: () => void;

  anotacoes: {
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
    };
  };

  setAnotacoes: React.Dispatch<
    React.SetStateAction<{
      [etapaId: number]: {
        plainText: string;
        editorState: string | null;
      };
    }>
  >;

  setEtapaSelecionada: React.Dispatch<React.SetStateAction<IEtapa | undefined>>;
};

export default function Roadmap({
  roadmap,
  setRoadmap,
  setTipoItemASerExcluido,
  setDeleteModalVisible,
  getData,
  anotacoes,
  setAnotacoes,
  setEtapaSelecionada,
}: RoadmapProps) {
  const { showLoading, hideLoading } = useLoading();

  const [adicionandoEtapaModal, setAdicionandoEtapaModal] = useState(false);

  // IDs das etapas abertas
  const [etapasAbertas, setEtapasAbertas] = useState<number[]>([]);

  const toggleEtapa = (id: number) => {
    setEtapasAbertas((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    if (!adicionandoEtapaModal) {
      getData();
    }
  }, [adicionandoEtapaModal]);

  const addReferencia = async (
    tipoItem: TipoItem,
    itemId: number,
    tipo: TipoReferencia,
    nome: string,
    url: string,
  ) => {
    try {
      showLoading();

      nome = nome.trim();
      url = url.trim();

      if (!nome) {
        alert("Informe o nome da referência.");
        return;
      }

      const novaReferencia: ICriarReferencia = {
        tipo,
        nome,
        url,
      };

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmap,

        etapas: roadmap.etapas.map((etapa) => {
          // Referência da etapa
          if (tipoItem === "etapa" && etapa.id === itemId) {
            return {
              ...etapa,
              referencias: [...(etapa.referencias || []), novaReferencia],
            };
          }

          // Referência do objetivo
          return {
            ...etapa,

            objetivos: etapa.objetivos.map((objetivo) => {
              if (tipoItem === "objetivo" && objetivo.id === itemId) {
                return {
                  ...objetivo,

                  referencias: [
                    ...(objetivo.referencias || []),
                    novaReferencia,
                  ],
                };
              }

              return objetivo;
            }),
          };
        }),
      };

      const atualizado = await updateRoadmap(novoRoadmap);

      setRoadmap(atualizado);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  // Não altera diretamente roadmap.etapas
  const etapasOrdenadas = [...roadmap.etapas].sort((a, b) => a.ordem - b.ordem);

  return (
    <View style={{ gap: 20 }}>
      {/* TÍTULO + ADICIONAR */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={styles.titulo}>Etapas</Text>

        {!adicionandoEtapaModal && (
          <TouchableOpacity
            style={styles.adicionarEtapaButton}
            onPress={() => setAdicionandoEtapaModal(true)}
          >
            <Text style={{ color: "white" }}>+ Adicionar Etapa</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* MODAL */}
      {adicionandoEtapaModal && (
        <AdicionarEtapaModal
          closeModal={() => setAdicionandoEtapaModal(false)}
          roadmap={roadmap}
        />
      )}

      {/* ETAPAS */}
      {etapasOrdenadas.length > 0
        ? etapasOrdenadas.map((etapa, index) => {
            const zIndex = etapasOrdenadas.length - index;

            return (
              <EtapaCard
                key={etapa.id}
                etapa={etapa}
                roadmap={roadmap}
                setRoadmap={setRoadmap}
                anotacoes={anotacoes}
                setAnotacoes={setAnotacoes}
                addReferencia={addReferencia}
                zIndex={zIndex}
                aberta={etapasAbertas.includes(etapa.id)}
                toggleEtapa={toggleEtapa}
                setEtapaSelecionada={setEtapaSelecionada}
                setTipoItemASerExcluido={setTipoItemASerExcluido}
                setDeleteModalVisible={setDeleteModalVisible}
              />
            );
          })
        : !adicionandoEtapaModal && (
            <Text
              style={{
                fontStyle: "italic",
                fontSize: 16,
                color: colors.placeholderTextColor,
              }}
            >
              Este Roadmap ainda não possui etapas.
            </Text>
          )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 28,
    fontWeight: "600",
    color: "black",
  },

  adicionarEtapaButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
});
