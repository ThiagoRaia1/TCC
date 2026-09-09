import { ChevronUp, ChevronDown, Pencil, Trash2 } from "lucide-react-native";
import {
  View,
  Pressable,
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
import { useState } from "react";
import { IReferencia } from "../../../interfaces/referencia";
import DeleteModal from "./DeleteModal";
import { IRoadmap } from "../../../interfaces/roadmap";
import { updateReferencia } from "../../../services/referecia";
import { useLoading } from "../../../context/providers/loading";

const styles = StyleSheet.create({
  cardTitulo: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
  },
});

type ReferenciasCardProps = {
  roadmap: IRoadmap;
  setRoadmap: React.Dispatch<React.SetStateAction<IRoadmap | undefined>>;
  item: {
    id: number;
    referencias?: IReferencia[];
  };

  tipoItem: "objetivo" | "etapa";

  onAdicionarReferencia: (
    itemId: number,
    tipo: TipoReferencia,
    nome: string,
    url: string,
  ) => void;
};

export default function ReferenciasCard({
  roadmap,
  setRoadmap,
  item,
  tipoItem,
  onAdicionarReferencia,
}: ReferenciasCardProps) {
  const globalStyles = getGlobalStyles();
  const { showLoading, hideLoading } = useLoading();

  // ADICIONAR REFERÊNCIA
  const [tipoReferencia, setTipoReferencia] =
    useState<TipoReferencia>("Artigo");
  const [nomeReferencia, setNomeReferencia] = useState("");
  const [urlReferencia, setUrlReferencia] = useState("");
  const [dropdownAberto, setDropdownAberto] = useState(false);

  // EDITAR REFERÊNCIA
  const [referenciaSelecionada, setReferenciaSelecionada] =
    useState<IReferencia>();
  const [editandoReferencia, setEditandoReferencia] = useState(false);

  const [tipoReferenciaEdicao, setTipoReferenciaEdicao] =
    useState<TipoReferencia>("Artigo");
  const [nomeReferenciaEdicao, setNomeReferenciaEdicao] = useState("");
  const [urlReferenciaEdicao, setUrlReferenciaEdicao] = useState("");
  const [dropdownEdicaoAberto, setDropdownEdicaoAberto] = useState(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const adicionarReferencia = () => {
    onAdicionarReferencia(
      item.id,
      tipoReferencia,
      nomeReferencia.trim(),
      urlReferencia.trim(),
    );

    setNomeReferencia("");
    setUrlReferencia("");
  };

  const iniciarEdicaoReferencia = (referencia: IReferencia) => {
    setReferenciaSelecionada(referencia);

    setTipoReferenciaEdicao(referencia.tipo);
    setNomeReferenciaEdicao(referencia.nome);
    setUrlReferenciaEdicao(referencia.url ?? "");

    setDropdownEdicaoAberto(false);
    setEditandoReferencia(true);
  };

  const cancelarEdicaoReferencia = () => {
    setEditandoReferencia(false);
    setReferenciaSelecionada(undefined);

    setTipoReferenciaEdicao("Artigo");
    setNomeReferenciaEdicao("");
    setUrlReferenciaEdicao("");

    setDropdownEdicaoAberto(false);
  };

  const salvarEdicaoReferencia = async () => {
    if (!referenciaSelecionada) return;
    showLoading();

    try {
      const nome = nomeReferenciaEdicao.trim();
      const url = urlReferenciaEdicao.trim();

      if (!nome) {
        alert("Informe o nome da referência.");
        return;
      }

      const referenciaAtualizada = await updateReferencia(
        referenciaSelecionada.id,
        {
          tipo: tipoReferenciaEdicao,
          nome,
          url,
        },
      );

      setRoadmap((prev) => {
        if (!prev) return prev;

        return {
          ...prev,
          etapas: prev.etapas.map((etapa) => ({
            ...etapa,

            referencias: etapa.referencias?.map((referencia) =>
              referencia.id === referenciaSelecionada.id
                ? referenciaAtualizada
                : referencia,
            ),

            objetivos: etapa.objetivos.map((objetivo) => ({
              ...objetivo,
              referencias: objetivo.referencias?.map((referencia) =>
                referencia.id === referenciaSelecionada.id
                  ? referenciaAtualizada
                  : referencia,
              ),
            })),
          })),
        };
      });

      setEditandoReferencia(false);
      setReferenciaSelecionada(undefined);

      setTipoReferenciaEdicao("Artigo");
      setNomeReferenciaEdicao("");
      setUrlReferenciaEdicao("");

      setDropdownEdicaoAberto(false);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={{ width: "100%" }}>
      <Text style={styles.cardTitulo}>Referências e Materiais</Text>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 12,
          height: 32,
          marginVertical: 12,
          zIndex: 2,
        }}
      >
        {/* DROPDOWN */}
        <View style={{ position: "relative" }}>
          <Pressable
            style={[
              globalStyles.secondaryButton,
              {
                height: "100%",
                width: 140,
                zIndex: 2,
                boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.2)",
              },
            ]}
            onPress={() => setDropdownAberto((prev) => !prev)}
          >
            {getIconReferencia(tipoReferencia)}

            <Text style={globalStyles.secondaryButtonText}>
              {tipoReferencia}
            </Text>

            {dropdownAberto ? (
              <ChevronUp color="black" size={18} />
            ) : (
              <ChevronDown color="black" size={18} />
            )}
          </Pressable>

          {dropdownAberto && (
            <View
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                backgroundColor: "white",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#ddd",
                width: "100%",
                overflow: "hidden",
                zIndex: 1,
              }}
            >
              <View style={{ height: 30 }} />

              {tiposReferencia.map((referencia) => (
                <Pressable
                  key={referencia.tipo}
                  style={({ hovered }: any) => ({
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    backgroundColor: hovered ? "#F1F5F9" : "white",
                  })}
                  onPress={() => {
                    setTipoReferencia(referencia.tipo);
                    setDropdownAberto(false);
                  }}
                >
                  {referencia.icon}

                  <Text style={{ color: "black" }}>{referencia.tipo}</Text>
                </Pressable>
              ))}
            </View>
          )}
        </View>

        {/* NOME */}
        <TextInput
          style={[globalStyles.input, { flex: 3 }]}
          placeholder="Nome (ex: Artigo React)"
          placeholderTextColor={colors.placeholderTextColor}
          value={nomeReferencia}
          onChangeText={setNomeReferencia}
        />

        {/* URL */}
        <TextInput
          style={[globalStyles.input, { flex: 3 }]}
          placeholder="URL (https://...)"
          placeholderTextColor={colors.placeholderTextColor}
          value={urlReferencia}
          onChangeText={setUrlReferencia}
        />

        {/* ADICIONAR */}
        <TouchableOpacity
          style={{
            backgroundColor: colors.lightBlue,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 12,
          }}
          onPress={adicionarReferencia}
        >
          <Text style={{ color: "white" }}>+ Add</Text>
        </TouchableOpacity>
      </View>

      {/* REFERÊNCIAS */}
      {item.referencias && item.referencias.length > 0 ? (
        <View
          style={{
            borderWidth: 1,
            borderRadius: 12,
            borderColor: "#ccc",
            backgroundColor: "#f8f8f8",
            paddingHorizontal: 12,
            marginHorizontal: 12,
            gap: 8,
          }}
        >
          {item.referencias.map((referencia, index) => (
            <View
              key={referencia.id}
              style={{
                flexDirection: "row",
                zIndex: item.referencias!.length - index,
              }}
            >
              <View
                key={referencia.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  minHeight: 32,
                  borderBottomWidth:
                    index === item.referencias!.length - 1 ? 0 : 2,
                  borderBottomColor: "#ddd",
                  padding: 8,
                  paddingTop: 6,
                  alignItems: "center",
                  flex: 1,
                  gap: 8,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: 8,
                    alignItems: "center",
                    flex: 1,
                    position: "relative",
                  }}
                >
                  {editandoReferencia &&
                  referenciaSelecionada?.id === referencia.id ? (
                    <>
                      {/* TIPO */}
                      <View style={{ position: "relative" }}>
                        <Pressable
                          style={[
                            globalStyles.secondaryButton,
                            {
                              height: 32,
                              width: 120,
                              zIndex: 2,
                              boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
                            },
                          ]}
                          onPress={() =>
                            setDropdownEdicaoAberto((prev) => !prev)
                          }
                        >
                          {getIconReferencia(tipoReferenciaEdicao)}

                          <Text style={globalStyles.secondaryButtonText}>
                            {tipoReferenciaEdicao}
                          </Text>

                          {dropdownEdicaoAberto ? (
                            <ChevronUp color="black" size={16} />
                          ) : (
                            <ChevronDown color="black" size={16} />
                          )}
                        </Pressable>

                        {dropdownEdicaoAberto && (
                          <View
                            style={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              backgroundColor: "white",
                              borderRadius: 12,
                              borderWidth: 1,
                              borderColor: "#ddd",
                              width: 120,
                              overflow: "hidden",
                              zIndex: 1,
                            }}
                          >
                            <View style={{ height: 32 }} />

                            {tiposReferencia.map((referenciaTipo) => (
                              <Pressable
                                key={referenciaTipo.tipo}
                                style={({ hovered }: any) => ({
                                  flexDirection: "row",
                                  alignItems: "center",
                                  gap: 8,
                                  paddingHorizontal: 10,
                                  paddingVertical: 8,
                                  backgroundColor: hovered
                                    ? "#F1F5F9"
                                    : "white",
                                })}
                                onPress={() => {
                                  setTipoReferenciaEdicao(referenciaTipo.tipo);
                                  setDropdownEdicaoAberto(false);
                                }}
                              >
                                {referenciaTipo.icon}

                                <Text style={{ color: "black" }}>
                                  {referenciaTipo.tipo}
                                </Text>
                              </Pressable>
                            ))}
                          </View>
                        )}
                      </View>

                      {/* NOME */}
                      <TextInput
                        style={[
                          globalStyles.input,
                          {
                            flex: 1,
                            height: 32,
                            paddingVertical: 4,
                          },
                        ]}
                        value={nomeReferenciaEdicao}
                        onChangeText={setNomeReferenciaEdicao}
                        placeholder="Nome"
                        placeholderTextColor={colors.placeholderTextColor}
                      />

                      {/* URL */}
                      <TextInput
                        style={[
                          globalStyles.input,
                          {
                            flex: 1,
                            height: 32,
                            paddingVertical: 4,
                          },
                        ]}
                        value={urlReferenciaEdicao}
                        onChangeText={setUrlReferenciaEdicao}
                        placeholder="URL (https://...)"
                        placeholderTextColor={colors.placeholderTextColor}
                      />
                    </>
                  ) : (
                    <>
                      {getIconReferencia(referencia.tipo)}

                      <Text
                        style={[
                          globalStyles.secondaryButtonText,
                          { flexShrink: 1 },
                        ]}
                      >
                        [{referencia.tipo}] -{" "}
                        {referencia.url ? (
                          <Text
                            style={{
                              color: "blue",
                              textDecorationLine: "underline",
                            }}
                            onPress={() => Linking.openURL(referencia.url!)}
                          >
                            {referencia.nome}
                          </Text>
                        ) : (
                          referencia.nome
                        )}
                      </Text>
                    </>
                  )}
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    alignItems: "center",
                  }}
                >
                  {editandoReferencia &&
                  referenciaSelecionada?.id === referencia.id ? (
                    <>
                      {/* SALVAR */}
                      <Pressable
                        style={(state: any) => [
                          globalStyles.secondaryButton,
                          {
                            paddingVertical: 8,
                            width: 40,
                            backgroundColor: state.hovered ? "#16a34a" : "#fff",
                          },
                        ]}
                        onPress={salvarEdicaoReferencia}
                      >
                        {(state: any) => (
                          <Text
                            style={{
                              color: state.hovered ? "#fff" : "#000",
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            ✓
                          </Text>
                        )}
                      </Pressable>

                      {/* CANCELAR */}
                      <Pressable
                        style={(state: any) => [
                          globalStyles.secondaryButton,
                          {
                            paddingVertical: 8,
                            width: 40,
                            backgroundColor: state.hovered ? "#ef4444" : "#fff",
                          },
                        ]}
                        onPress={cancelarEdicaoReferencia}
                      >
                        {(state: any) => (
                          <Text
                            style={{
                              color: state.hovered ? "#fff" : "#000",
                              fontWeight: "bold",
                              fontSize: 16,
                            }}
                          >
                            ✕
                          </Text>
                        )}
                      </Pressable>
                    </>
                  ) : (
                    <>
                      {/* EDITAR */}
                      <Pressable
                        style={(state: any) => [
                          globalStyles.secondaryButton,
                          {
                            paddingVertical: 8,
                            width: 40,
                            backgroundColor: state.hovered
                              ? colors.lightBlue
                              : "#fff",
                            transitionProperty: "background-color",
                            transitionDuration: "200ms",
                            transitionTimingFunction: "ease-in-out",
                          },
                        ]}
                        onPress={() => iniciarEdicaoReferencia(referencia)}
                      >
                        {(state: any) => (
                          <Pencil
                            color={state.hovered ? "#fff" : "#000"}
                            size={16}
                          />
                        )}
                      </Pressable>

                      {/* DELETE */}
                      <Pressable
                        style={(state: any) => [
                          globalStyles.secondaryButton,
                          {
                            paddingVertical: 8,
                            width: 40,
                            backgroundColor: state.hovered ? "#ef4444" : "#fff",
                            transitionProperty: "background-color",
                            transitionDuration: "200ms",
                            transitionTimingFunction: "ease-in-out",
                          },
                        ]}
                        onPress={() => {
                          setReferenciaSelecionada(referencia);
                          setDeleteModalVisible(true);
                        }}
                      >
                        {(state: any) => (
                          <Trash2
                            color={state.hovered ? "#fff" : "#000"}
                            size={16}
                          />
                        )}
                      </Pressable>
                    </>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>
      ) : (
        <Text
          style={{
            color: colors.placeholderTextColor,
            marginHorizontal: 12,
          }}
        >
          Este {tipoItem} ainda não possui referências.
        </Text>
      )}

      {deleteModalVisible && (
        <DeleteModal
          closeModal={() => setDeleteModalVisible(false)}
          tipoItem="referencia"
          referencia={referenciaSelecionada}
          roadmap={roadmap}
          setRoadmap={setRoadmap}
        />
      )}
    </View>
  );
}
