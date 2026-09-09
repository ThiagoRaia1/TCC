import {
  Check,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  CircleX,
} from "lucide-react-native";
import { Pressable, View, TextInput, Text, StyleSheet } from "react-native";
import { colors } from "../../../styles/colors";
import { TipoReferencia } from "../../../utils/tiposReferencia";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { IObjetivo } from "../../../interfaces/objetivo";
import { useState } from "react";
import { updateRoadmap } from "../../../services/roadmap";
import { useLoading } from "../../../context/providers/loading";
import { IRoadmap } from "../../../interfaces/roadmap";
import { deleteObjetivo, updateObjetivo } from "../../../services/objetivo";
import ReferenciasCard from "./ReferenciasCard";
import MenuOptionButton from "../../_components/MenuOptionButton";
import { Feather } from "@expo/vector-icons";

type ObjetivoCardProps = {
  objetivo: IObjetivo;
  etapaId: number;
  roadmap: IRoadmap;
  setRoadmap: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;
  addReferencia: (
    tipoItem: "objetivo" | "etapa",
    itemId: number,
    tipo: TipoReferencia,
    nome: string,
    url: string,
  ) => void;
};

export default function ObjetivoCard({
  objetivo,
  etapaId,
  roadmap,
  setRoadmap,
  addReferencia,
}: ObjetivoCardProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const [objetivoTituloEditInput, setObjetivoTituloEditInput] = useState<{
    [objetivoId: number]: string;
  }>({});
  const [objetivoDescricaoEditInput, setObjetivoDescricaoEditInput] = useState<{
    [objetivoId: number]: string;
  }>({});
  const [anotacaoInput, setAnotacaoInput] = useState<{
    [objetivoId: number]: string;
  }>({});

  const [salvandoAnotacao, setSalvandoAnotacao] = useState<{
    [objetivoId: number]: boolean;
  }>({});

  const [idObjetivoSendoEditado, setIdObjetivoSendoEditado] =
    useState<number>();

  const [objetivosAbertos, setObjetivosAbertos] = useState<number[]>([]);

  const [dropdownReferenciaAberto, setDropdownReferenciaAberto] = useState<
    number | null
  >(null);

  const objetivoEstaSendoEditado: boolean =
    objetivo.id === idObjetivoSendoEditado;

  const objetivoAberto = objetivosAbertos.includes(objetivo.id);

  const toggleObjetivo = async (etapaId: number, objetivoId: number) => {
    try {
      showLoading();
      if (!roadmap) return;

      const novoRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => {
          if (etapa.id !== etapaId) return etapa;

          return {
            ...etapa,
            objetivos: etapa.objetivos.map((obj) => {
              if (obj.id !== objetivoId) return obj;

              return {
                ...obj,
                concluido: !obj.concluido,
              };
            }),
          };
        }),
      };

      const resultado = await updateRoadmap(novoRoadmap);

      setRoadmap(novoRoadmap);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const handleEditObjetivo = async (objetivoId: number) => {
    try {
      showLoading();

      const titulo = objetivoTituloEditInput[objetivoId].trim();
      const descricao = objetivoDescricaoEditInput[objetivoId]?.trim() || "";

      if (!titulo) {
        alert("O título do objetivo é obrigatório.");
        return;
      }

      const objetivoAtualizado = await updateObjetivo(objetivoId, {
        titulo,
        descricao,
      });

      // Atualiza o roadmap localmente
      setRoadmap((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          etapas: prev.etapas.map((etapa) => ({
            ...etapa,
            objetivos: etapa.objetivos.map((obj) =>
              obj.id === objetivoId
                ? {
                    ...obj,
                    ...objetivoAtualizado,
                  }
                : obj,
            ),
          })),
        };
      });

      // Limpa os inputs
      setObjetivoTituloEditInput((prev) => ({
        ...prev,
        [objetivoId]: "",
      }));

      setObjetivoDescricaoEditInput((prev) => ({
        ...prev,
        [objetivoId]: "",
      }));

      setIdObjetivoSendoEditado(undefined);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const handleDeleteObjetivo = async (objetivoId: number) => {
    try {
      showLoading();

      if (!roadmap) return;

      await deleteObjetivo(objetivoId);

      const novoRoadmap: IRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => ({
          ...etapa,
          objetivos: etapa.objetivos.filter(
            (objetivo) => objetivo.id !== objetivoId,
          ),
        })),
      };

      setRoadmap(novoRoadmap);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const handleSalvarAnotacao = async (objetivoId: number) => {
    try {
      setSalvandoAnotacao((prev) => ({
        ...prev,
        [objetivoId]: true,
      }));

      const anotacao = anotacaoInput[objetivoId]?.trim() || "";

      const objetivoAtualizado = await updateObjetivo(objetivoId, {
        anotacao,
      });

      setRoadmap((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          etapas: prev.etapas.map((etapa) => ({
            ...etapa,
            objetivos: etapa.objetivos.map((obj) =>
              obj.id === objetivoId
                ? {
                    ...obj,
                    ...objetivoAtualizado,
                  }
                : obj,
            ),
          })),
        };
      });
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      setSalvandoAnotacao((prev) => ({
        ...prev,
        [objetivoId]: false,
      }));
    }
  };

  const toggleAbrirObjetivo = (id: number) => {
    setObjetivosAbertos((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  return (
    <Pressable // OBJETIVO ROW
      key={objetivo.id}
      style={(state: any) => [
        state.hovered && {
          backgroundColor: "#91c8ff1a",
        },
        styles.objetivoRow,
        {
          transitionProperty: "background-color",
          transitionDuration: "200ms",
          transitionTimingFunction: "ease-in-out",
          gap: 20,
          flexDirection: "column",
          zIndex: dropdownReferenciaAberto === objetivo.id ? 1000 : 1,
        },
        objetivoEstaSendoEditado && [
          {
            cursor: "default",
          },
          globalStyles.slashedBorder,
        ],
      ]}
      onPress={() => {
        // CONCLUIR OBJETIVO
        if (!objetivoEstaSendoEditado) toggleObjetivo(etapaId, objetivo.id);
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          width: "100%",
          padding: 4,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* OBJETIVO */}
        {objetivoEstaSendoEditado ? (
          // FIX ME: EDITANDO OBJETIVO
          <View
            style={{
              flex: 1,
              gap: 20,
              paddingHorizontal: 12,
              paddingTop: 12,
            }}
          >
            <View style={{ gap: 4 }}>
              <Text style={styles.objetivoEditLabel}>Título: *</Text>
              <TextInput
                style={[
                  globalStyles.input,
                  {
                    flex: 1,
                    backgroundColor: "white",
                    color: "black",
                  },
                ]}
                value={objetivoTituloEditInput[objetivo.id] || ""}
                onChangeText={(text) =>
                  setObjetivoTituloEditInput((prev) => ({
                    ...prev,
                    [objetivo.id]: text,
                  }))
                }
                placeholder="Título do objetivo"
                placeholderTextColor={colors.placeholderTextColor}
              />
            </View>

            <View style={{ gap: 4 }}>
              <Text style={styles.objetivoEditLabel}>
                Descrição (opcional):
              </Text>
              <TextInput
                style={[
                  globalStyles.input,
                  {
                    flex: 1,
                    backgroundColor: "white",
                    color: "black",
                  },
                ]}
                value={objetivoDescricaoEditInput[objetivo.id] || ""}
                onChangeText={(text) =>
                  setObjetivoDescricaoEditInput((prev) => ({
                    ...prev,
                    [objetivo.id]: text,
                  }))
                }
                placeholder="Descrição do objetivo"
                placeholderTextColor={colors.placeholderTextColor}
                multiline
              />
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              gap: 8,
            }}
          >
            <View style={styles.check}>
              {objetivo.concluido && (
                <Check
                  color={colors.lightBlue}
                  style={{ backgroundColor: "white" }}
                />
              )}
            </View>
            <View style={{ gap: 4, flex: 1 }}>
              <Text style={styles.objetivoTituloText} selectable={false}>
                {objetivo.titulo}
              </Text>
              <Text style={styles.objetivoDescricaoText} selectable={false}>
                {objetivo.descricao != "" ? (
                  objetivo.descricao
                ) : (
                  <i>Este objetivo ainda não possui descrição.</i>
                )}
              </Text>
            </View>
          </View>
        )}

        {/* ROW BOTAO EDITAR/EXCLUIR */}
        {!objetivoEstaSendoEditado && (
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              marginLeft: 8,
              justifyContent: "flex-end",
              marginRight: 8,
              alignSelf: "center",
            }}
          >
            {/* BOTAO EDITAR OBJETIVO */}
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  width: 40,
                  height: 32,
                  backgroundColor: state.hovered ? colors.lightBlue : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                },
              ]}
              onPress={() => {
                setIdObjetivoSendoEditado(objetivo.id);

                setObjetivoTituloEditInput((prev) => ({
                  ...prev,
                  [objetivo.id]: objetivo.titulo,
                }));

                setObjetivoDescricaoEditInput((prev) => ({
                  ...prev,
                  [objetivo.id]: objetivo.descricao || "",
                }));
              }}
            >
              {(state: any) => (
                <Pencil color={state.hovered ? "#fff" : "#000"} size={16} />
              )}
            </Pressable>

            {/* BOTAO DELETAR OBJETIVO */}
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  width: 40,
                  height: 32,
                  backgroundColor: state.hovered ? "#ef4444" : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                },
              ]}
              onPress={async () => {
                await handleDeleteObjetivo(objetivo.id);
              }}
            >
              {(state: any) => (
                <Trash2 color={state.hovered ? "#fff" : "#000"} size={16} />
              )}
            </Pressable>

            {objetivoAberto ? (
              <Pressable
                style={(state: any) => [
                  globalStyles.secondaryButton,
                  {
                    width: 40,
                    height: 32,
                    paddingHorizontal: 0,
                    backgroundColor: state.hovered ? "#c9cccf" : "#fff",
                    transitionProperty: "background-color",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-in-out",
                    overflow: "hidden",
                  },
                ]}
                onPress={() => toggleAbrirObjetivo(objetivo.id)}
              >
                <ChevronUp color={"black"} />
              </Pressable>
            ) : (
              <Pressable
                style={(state: any) => [
                  globalStyles.secondaryButton,
                  {
                    width: 40,
                    height: 32,
                    paddingHorizontal: 0,
                    backgroundColor: state.hovered ? "#c9cccf" : "#fff",
                    transitionProperty: "background-color",
                    transitionDuration: "200ms",
                    transitionTimingFunction: "ease-in-out",
                    overflow: "hidden",
                  },
                ]}
                onPress={() => toggleAbrirObjetivo(objetivo.id)}
              >
                <ChevronDown color={"black"} />
              </Pressable>
            )}
          </View>
        )}
      </View>

      {/* ROW BOTAO SALVAR/CANCELAR */}
      {objetivoEstaSendoEditado && (
        <View
          style={{
            flexDirection: "row",
            gap: 8,
            marginLeft: 8,
            justifyContent: "flex-end",
            marginRight: 8,
            alignSelf: "flex-end",
          }}
        >
          {/* BOTAO SALVAR EDICAO OBJETIVO */}
          <Pressable
            style={(state: any) => [
              globalStyles.secondaryButton,
              {
                paddingVertical: 8,
                width: 40,
                height: 32,
                backgroundColor: state.hovered ? colors.green : "#fff",
                transitionProperty: "background-color",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-in-out",
              },
            ]}
            onPress={async () => {
              await handleEditObjetivo(objetivo.id);
            }}
          >
            {(state: any) => (
              <Save color={state.hovered ? "#fff" : "#000"} size={16} />
            )}
          </Pressable>

          {/* BOTAO CANCELAR EDICAO OBJETIVO */}
          <Pressable
            style={(state: any) => [
              globalStyles.secondaryButton,
              {
                paddingVertical: 8,
                width: 40,
                height: 32,
                backgroundColor: state.hovered ? "#ef4444" : "#fff",
                transitionProperty: "background-color",
                transitionDuration: "200ms",
                transitionTimingFunction: "ease-in-out",
              },
            ]}
            onPress={() => {
              setObjetivoTituloEditInput((prev) => ({
                ...prev,
                [objetivo.id]: "",
              }));

              setObjetivoDescricaoEditInput((prev) => ({
                ...prev,
                [objetivo.id]: "",
              }));

              setIdObjetivoSendoEditado(undefined);
            }}
          >
            {(state: any) => (
              <CircleX color={state.hovered ? "#fff" : "#000"} size={16} />
            )}
          </Pressable>

          {objetivoAberto ? (
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  width: 40,
                  height: 32,
                  paddingHorizontal: 0,
                  backgroundColor: state.hovered ? "#c9cccf" : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                  overflow: "hidden",
                },
              ]}
              onPress={() => toggleAbrirObjetivo(objetivo.id)}
            >
              <ChevronUp color={"black"} />
            </Pressable>
          ) : (
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  width: 40,
                  height: 32,
                  paddingHorizontal: 0,
                  backgroundColor: state.hovered ? "#c9cccf" : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                  overflow: "hidden",
                },
              ]}
              onPress={() => toggleAbrirObjetivo(objetivo.id)}
            >
              <ChevronDown color={"black"} />
            </Pressable>
          )}
        </View>
      )}

      {objetivoAberto && (
        <Pressable
          style={{
            width: "100%",
            cursor: "default" as any,
            gap: 12,
            paddingHorizontal: 32,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <Text style={styles.objetivoTituloText}>Anotações do objetivo</Text>
          <View
            style={{
              width: "100%",
              paddingHorizontal: 12,
              gap: 12,
            }}
          >
            <TextInput
              style={globalStyles.input}
              numberOfLines={5}
              multiline
              placeholder="Adicione aqui as anotações do objetivo!"
              placeholderTextColor={colors.placeholderTextColor}
              value={anotacaoInput[objetivo.id] ?? objetivo.anotacao ?? ""}
              onChangeText={(text) =>
                setAnotacaoInput((prev) => ({
                  ...prev,
                  [objetivo.id]: text,
                }))
              }
            />
            {/* Salvar Anotação */}
            <MenuOptionButton
              containerStyle={[
                globalStyles.confirmButton,
                {
                  borderWidth: 0,
                  backgroundColor: salvandoAnotacao[objetivo.id]
                    ? "#555"
                    : colors.green,
                  alignSelf: "flex-end",
                  opacity: salvandoAnotacao[objetivo.id] ? 0.6 : 1,
                },
              ]}
              enabled={!salvandoAnotacao[objetivo.id]}
              label={
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Text
                    style={[
                      globalStyles.confirmButtonText,
                      {
                        color: "white",
                        marginTop: 3,
                        fontWeight: 600,
                      },
                    ]}
                    selectable={false}
                  >
                    {salvandoAnotacao[objetivo.id]
                      ? "Salvando..."
                      : "Salvar anotação"}
                  </Text>

                  {salvandoAnotacao[objetivo.id] ? (
                    <Feather name="loader" size={24} color="white" />
                  ) : (
                    <Feather name="check-circle" size={24} color="white" />
                  )}
                </View>
              }
              onPress={() => handleSalvarAnotacao(objetivo.id)}
            />
          </View>

          <ReferenciasCard
            item={objetivo}
            tipoItem="objetivo"
            onAdicionarReferencia={(id, tipo, nome, url) =>
              addReferencia("objetivo", id, tipo, nome, url)
            }
            roadmap={roadmap}
            setRoadmap={setRoadmap}
          />
        </Pressable>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  objetivoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 12,
    boxShadow: "0px 0px 2px rgb(0, 26, 255, 0.6)",
  },
  objetivoTituloText: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
  },
  objetivoDescricaoText: {
    color: "#545454",
    fontWeight: 400,
    fontSize: 12,
  },
  objetivoEditLabel: {
    fontSize: 16,
    fontWeight: 500,
  },
  check: {
    alignSelf: "center",
    overflow: "hidden",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: colors.lightBlue,
    width: 20,
    height: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
  },
});
