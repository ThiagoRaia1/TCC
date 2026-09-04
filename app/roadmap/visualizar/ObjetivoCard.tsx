import {
  Check,
  Pencil,
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  CircleX,
  Link,
} from "lucide-react-native";
import {
  Pressable,
  View,
  TextInput,
  TouchableOpacity,
  Linking,
  Text,
  StyleSheet,
} from "react-native";
import { colors } from "../../../styles/colors";
import {
  getIconReferencia,
  TipoReferencia,
  tiposReferencia,
} from "../../../utils/tiposReferencia";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { ICriarObjetivo, IObjetivo } from "../../../interfaces/objetivo";
import { useState } from "react";
import { updateRoadmap } from "../../../services/roadmap";
import { useLoading } from "../../../context/providers/loading";
import { ICriarReferencia } from "../../../interfaces/referencia";
import { IUpdateRoadmap, IRoadmap } from "../../../interfaces/roadmap";
import { deleteObjetivo } from "../../../services/objetivo";

type ObjetivoCardProps = {
  objetivo: IObjetivo;
  etapaId: number;
  roadmap: IRoadmap;
  setRoadmap: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;
};

export default function ObjetivoCard({
  objetivo,
  etapaId,
  roadmap,
  setRoadmap,
}: ObjetivoCardProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  const [objetivoTituloEditInput, setObjetivoTituloEditInput] =
    useState<string>("");
  const [objetivoDescricaoEditInput, setObjetivoDescricaoEditInput] =
    useState<string>("");

  const [idObjetivoSendoEditado, setIdObjetivoSendoEditado] =
    useState<number>();

  const [objetivosAbertos, setObjetivosAbertos] = useState<number[]>([]);

  const [tipoReferencia, setTipoReferencia] = useState<{
    [objetivoId: number]: TipoReferencia;
  }>({});

  const [dropdownReferenciaAberto, setDropdownReferenciaAberto] = useState<
    number | null
  >(null);

  const [nomeReferencia, setNomeReferencia] = useState<{
    [objetivoId: number]: string;
  }>({});

  const [urlReferencia, setUrlReferencia] = useState<{
    [objetivoId: number]: string;
  }>({});

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

  const addReferenciaObjetivo = async (objetivo: IObjetivo) => {
    try {
      showLoading();

      const tipo = tipoReferencia[objetivo.id] || "Artigo";
      const nome = nomeReferencia[objetivo.id]?.trim();
      const url = urlReferencia[objetivo.id]?.trim() || "";

      if (!nome) {
        alert("Informe o nome da referência.");
        return;
      }

      if (!roadmap) return;

      const novaReferencia: ICriarReferencia = {
        tipo,
        nome,
        url,
      };

      const objetivoAtualizado: ICriarObjetivo = {
        ...objetivo,
        referencias: [...(objetivo.referencias || []), novaReferencia],
      };

      const novoRoadmap: IUpdateRoadmap = {
        ...roadmap,
        etapas: roadmap.etapas.map((etapa) => ({
          ...etapa,
          objetivos: etapa.objetivos.map((obj) =>
            obj.id === objetivo.id ? objetivoAtualizado : obj,
          ),
        })),
      };

      const atualizado = await updateRoadmap(novoRoadmap);

      setRoadmap(atualizado);

      // Limpa os campos
      setNomeReferencia((prev) => ({
        ...prev,
        [objetivo.id]: "",
      }));

      setUrlReferencia((prev) => ({
        ...prev,
        [objetivo.id]: "",
      }));
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  const handleEditObjetivo = async (objetivoId: number) => {
    try {
    } catch (erro: any) {
      alert(erro.message);
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
          backgroundColor: "#F1F5F9",
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
                value={objetivoTituloEditInput}
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
                value={objetivoDescricaoEditInput}
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
            <View style={{ gap: 4 }}>
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
              alignSelf: "flex-end",
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
                setObjetivoTituloEditInput(objetivo.titulo);
                setObjetivoDescricaoEditInput(objetivo.descricao);
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
              onPress={() => {
                handleDeleteObjetivo(objetivo.id);
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
          {/* BOTAO SALVAR OBJETIVO */}
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
            onPress={() => {
              // FIX ME: ADCIONAR FUNCAO DE EDITAR OBJETIVO
              setIdObjetivoSendoEditado(0);
            }}
          >
            {(state: any) => (
              <Save color={state.hovered ? "#fff" : "#000"} size={16} />
            )}
          </Pressable>

          {/* BOTAO CANCELAR OBJETIVO */}
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
              setIdObjetivoSendoEditado(0);
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
            paddingHorizontal: 12,
            gap: 12,
          }}
          onPress={(e) => e.stopPropagation()}
        >
          <View
            style={{
              width: "100%",
            }}
          >
            <Text style={styles.objetivoTituloText}>Anotações do objetivo</Text>
            <TextInput
              style={[globalStyles.input, { margin: 12 }]}
              numberOfLines={5}
              multiline
              placeholder="Adicione aqui as anotações do objetivo!"
              placeholderTextColor={colors.placeholderTextColor}
            />
          </View>

          <View
            style={{
              width: "100%",
              cursor: "default" as any,
            }}
          >
            <Text style={styles.objetivoTituloText}>
              Referências e Materiais
            </Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 12,
                height: 32,
                margin: 12,
                zIndex: 2,
              }}
            >
              <View style={{ position: "relative" }}>
                <Pressable
                  style={[
                    globalStyles.secondaryButton,
                    {
                      boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                      height: "100%",
                      width: 140,
                      zIndex: 1,
                    },
                  ]}
                  onPress={() => {
                    setDropdownReferenciaAberto((prev) =>
                      prev === objetivo.id ? null : objetivo.id,
                    );
                  }}
                >
                  {getIconReferencia(tipoReferencia[objetivo.id] || "Artigo")}

                  <Text
                    style={globalStyles.secondaryButtonText}
                    selectable={false}
                  >
                    {tipoReferencia[objetivo.id] || "Artigo"}
                  </Text>

                  {dropdownReferenciaAberto === objetivo.id ? (
                    <ChevronUp color="black" size={18} />
                  ) : (
                    <ChevronDown color="black" size={18} />
                  )}
                </Pressable>

                {/* DROPDOWN */}
                {dropdownReferenciaAberto === objetivo.id && (
                  <View
                    style={{
                      position: "absolute",
                      left: 0,
                      backgroundColor: "white",
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: "#ddd",
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 8,
                        paddingHorizontal: 12,
                        paddingVertical: 10,
                        backgroundColor: "white",
                        height: 30,
                      }}
                    />
                    {tiposReferencia.map((item) => (
                      <Pressable
                        key={item.tipo}
                        style={({ hovered }: any) => ({
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                          paddingHorizontal: 12,
                          paddingVertical: 10,
                          backgroundColor: hovered ? "#F1F5F9" : "white",
                        })}
                        onPress={() => {
                          setTipoReferencia((prev) => ({
                            ...prev,
                            [objetivo.id]: item.tipo,
                          }));

                          setDropdownReferenciaAberto(null);
                        }}
                      >
                        {item.icon}

                        <Text style={{ color: "black" }} selectable={false}>
                          {item.tipo}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              <TextInput
                style={[globalStyles.input, { flex: 3 }]}
                placeholder="Nome (ex: Artigo React)*"
                placeholderTextColor={colors.placeholderTextColor}
                value={nomeReferencia[objetivo.id] || ""}
                onChangeText={(text) =>
                  setNomeReferencia((prev) => ({
                    ...prev,
                    [objetivo.id]: text,
                  }))
                }
              />

              <TextInput
                style={[globalStyles.input, { flex: 3 }]}
                placeholder="URL (https://...)"
                placeholderTextColor={colors.placeholderTextColor}
                value={urlReferencia[objetivo.id] || ""}
                onChangeText={(text) =>
                  setUrlReferencia((prev) => ({
                    ...prev,
                    [objetivo.id]: text,
                  }))
                }
              />

              <TouchableOpacity
                style={{
                  backgroundColor: colors.lightBlue,
                  paddingVertical: 8,
                  paddingHorizontal: 20,
                  borderRadius: 12,
                }}
                onPress={() => addReferenciaObjetivo(objetivo)}
              >
                <Text style={{ color: "white" }}>+ Add</Text>
              </TouchableOpacity>
            </View>

            {objetivo.referencias && objetivo.referencias.length !== 0 ? (
              <View
                style={{
                  borderWidth: 1,
                  borderRadius: 12,
                  borderColor: "#ccc",
                  backgroundColor: "#f8f8f8",
                  padding: 12,
                  marginHorizontal: 12,
                  gap: 8,
                }}
              >
                {objetivo.referencias.map((referencia, index) => {
                  return (
                    <View
                      key={referencia.id}
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: 32,
                        borderBottomWidth:
                          index === objetivo.referencias!.length - 1 ? 0 : 2,
                        borderBottomColor: "#ddd",
                        paddingVertical: 12,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          gap: 4,
                          alignItems: "center",
                        }}
                      >
                        {getIconReferencia(referencia.tipo)}

                        <Text style={globalStyles.secondaryButtonText}>
                          {`[${referencia.tipo}] - ${referencia.nome} → `}

                          <Text
                            style={{
                              color: "blue",
                            }}
                            onPress={() => {
                              if (referencia.url) {
                                Linking.openURL(referencia.url);
                              }
                            }}
                          >
                            <Link size={12} />
                            {` ${referencia.url}`}
                          </Text>
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            ) : (
              <Text
                style={{
                  color: colors.placeholderTextColor,
                }}
              >
                Este objetivo ainda não possui referências.
              </Text>
            )}
          </View>
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
