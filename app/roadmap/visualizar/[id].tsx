import {
  Pressable,
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { getGlobalStyles } from "../../../styles/globalStyles";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { useLoading } from "../../../context/providers/loading";
import { IEtapa } from "../../../interfaces/etapa";
import { IRoadmap } from "../../../interfaces/roadmap";
import { getRoadmap } from "../../../services/roadmap";
import { colors } from "../../../styles/colors";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react-native";
import AdicionarEtapaModal from "./AdicionarEtapaModal";
import DeleteModal from "./DeleteModal";
import { TipoReferencia } from "../../../utils/tiposReferencia";
import {
  calcularProgresso,
  getProgressColor,
} from "../../../utils/progressBarFunctions";
import EtapaCard from "./EtapaCard";

export type TipoItem = "roadmap" | "etapa" | "objetivo";
export const tiposItem: TipoItem[] = ["roadmap", "etapa", "objetivo"];

export default function Visualizar() {
  const { id } = useLocalSearchParams();
  const globalStyles = getGlobalStyles();
  const [roadmap, setRoadmap] = useState<IRoadmap>();
  const { showLoading, hideLoading } = useLoading();

  //#region TIPOS
  type Menus = "Etapas" | "Quizzes";
  const menus: Menus[] = ["Etapas", "Quizzes"];
  const [menuSelecionado, setMenuSelecionado] = useState<Menus>(menus[0]);

  const [tipoItemASerExcluido, setTipoItemASerExcluido] = useState<TipoItem>(
    tiposItem[0],
  );
  // TIPOS
  //#endregion

  //#region MODAIS
  const [adicionandoEtapaModal, setAdicionandoEtapaModal] =
    useState<boolean>(false);

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const openDeleteModal = (tipoItem: TipoItem, etapa?: IEtapa) => {
    if (etapa) setEtapaSelecionada(etapa);
    setTipoItemASerExcluido(tipoItem);
    setDeleteModalVisible(true);
  };
  // MODAIS
  //#endregion

  //#region USE EFFECTS
  const getData = async () => {
    try {
      showLoading();
      const resultado = await getRoadmap(Number(id));
      setRoadmap(resultado);

      const anotacoesIniciais: {
        [etapaId: number]: {
          plainText: string;
          editorState: string | null;
        };
      } = {};

      resultado.etapas.forEach((etapa) => {
        anotacoesIniciais[etapa.id] = {
          plainText: etapa.anotacoes?.plainText ?? "",
          editorState: etapa.anotacoes?.editorState ?? null,
        };
      });

      setAnotacoes(anotacoesIniciais);
    } catch (erro: any) {
      alert(erro.message);
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    getData();
  }, [id]);

  useEffect(() => {
    if (roadmap) calcularProgresso(roadmap);
  }, [roadmap]);

  useEffect(() => {
    if (!adicionandoEtapaModal) {
      getData();
    }
  }, [adicionandoEtapaModal]);
  // USE EFFECTS
  //#endregion

  const [anotacoes, setAnotacoes] = useState<{
    [etapaId: number]: {
      plainText: string;
      editorState: string | null;
    };
  }>({});

  const [etapaSelecionada, setEtapaSelecionada] = useState<IEtapa>();

  const [tipoReferencia, setTipoReferencia] = useState<{
    [objetivoId: number]: TipoReferencia;
  }>({});

  const [dropdownReferenciaAberto, setDropdownReferenciaAberto] = useState<
    number | null
  >(null);

  const porcentagemConclusaoRoadmap: number = roadmap
    ? calcularProgresso(roadmap)
    : 0;

  return roadmap ? (
    <View
      style={{
        maxWidth: 1350,
        paddingHorizontal: 8,
        gap: 20,
        paddingVertical: 20,
        width: "100%",
        alignSelf: "center",
        flex: 1,
      }}
    >
      {deleteModalVisible && (
        <DeleteModal
          closeModal={() => setDeleteModalVisible(false)}
          roadmap={roadmap}
          tipoItem={tipoItemASerExcluido}
          etapa={etapaSelecionada}
        />
      )}

      <TouchableOpacity // VOLTAR AO DASHBOARD
        style={[globalStyles.buttonWithIcon, styles.buttonWithIcon]}
        onPress={() => {
          router.push("/roadmap");
        }}
      >
        <ArrowLeft size={20} style={{ marginTop: 4 }} color={"black"} />
        <Text
          style={[
            globalStyles.buttonWithIconText,
            { color: "black", fontSize: 16 },
          ]}
        >
          Voltar ao dashboard
        </Text>
      </TouchableOpacity>

      {/* HEADER DO ROADMAP*/}
      <View style={globalStyles.card}>
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.titulo}>{roadmap.tema}</Text>
          <View
            style={{
              flexDirection: "row",
              gap: 20,
            }}
          >
            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  backgroundColor: state.hovered ? colors.lightBlue : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                  boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                },
              ]}
            >
              {(state: any) => (
                <>
                  <Pencil color={state.hovered ? "#fff" : "#000"} size={16} />
                  <Text
                    style={[
                      globalStyles.secondaryButtonText,
                      { color: state.hovered ? "#FFF" : "#000" },
                    ]}
                  >
                    Editar
                  </Text>
                </>
              )}
            </Pressable>

            <Pressable
              style={(state: any) => [
                globalStyles.secondaryButton,
                {
                  paddingVertical: 8,
                  backgroundColor: state.hovered ? "#ef4444" : "#fff",
                  transitionProperty: "background-color",
                  transitionDuration: "200ms",
                  transitionTimingFunction: "ease-in-out",
                  boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.4)",
                },
              ]}
              onPress={() => openDeleteModal(tiposItem[0])}
            >
              {(state: any) => (
                <>
                  <Trash2 color={state.hovered ? "#fff" : "#000"} size={16} />
                  <Text
                    style={[
                      globalStyles.secondaryButtonText,
                      { color: state.hovered ? "#fff" : "#000" },
                    ]}
                  >
                    Deletar
                  </Text>
                </>
              )}
            </Pressable>
          </View>
        </View>
        <Text style={styles.nivel}>Nível: {roadmap.nivel}</Text>
        <Text style={styles.descricao}>
          {roadmap.descricaoGeral ? (
            roadmap.descricaoGeral
          ) : (
            <i>Este roadmap ainda não possui descrição.</i>
          )}
        </Text>

        {/* Barra de progresso */}
        <View style={styles.progressContainer}>
          {porcentagemConclusaoRoadmap > 0 && (
            <View
              style={[
                styles.progressBar,
                {
                  width: `${porcentagemConclusaoRoadmap}%`,
                  backgroundColor: getProgressColor(
                    porcentagemConclusaoRoadmap,
                  ),
                },
              ]}
            />
          )}
        </View>

        <Text style={styles.progressText}>
          {porcentagemConclusaoRoadmap.toFixed(0)}% concluído
        </Text>
      </View>

      {/* MENU */}
      <View style={styles.menu}>
        <TouchableOpacity
          onPress={() => setMenuSelecionado(menus[0])}
          style={[
            styles.menuItem,
            menuSelecionado == menus[0]
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == menus[0]
                ? styles.menuItemSelecionadoText
                : styles.menuItemDesselecionadoText,
            ]}
          >
            Etapas do Roadmap
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setMenuSelecionado(menus[1])}
          style={[
            styles.menuItem,
            menuSelecionado == menus[1]
              ? styles.menuItemSelecionado
              : styles.menuItemDesselecionado,
          ]}
        >
          <Text
            style={[
              styles.menuItemText,
              menuSelecionado == menus[1]
                ? styles.menuItemSelecionadoText
                : styles.menuItemDesselecionadoText,
            ]}
          >
            Quizzes e Avaliações
          </Text>
        </TouchableOpacity>
      </View>

      {/* ETAPAS */}
      <View style={{ gap: 20 }}>
        {/* TITULO + ADICIONAR ETAPAS */}
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
              style={{
                backgroundColor: colors.lightBlue,
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 12,
              }}
              onPress={() => setAdicionandoEtapaModal(true)}
            >
              <Text style={{ color: "white" }}>+ Adicionar Etapa</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ADICIONAR ETAPA MODAL */}
        {adicionandoEtapaModal && (
          <AdicionarEtapaModal
            closeModal={() => setAdicionandoEtapaModal(false)}
            roadmap={roadmap}
          />
        )}

        {roadmap.etapas.length != 0
          ? roadmap.etapas
              .sort((a, b) => a.ordem - b.ordem)
              .map((etapa) => {
                // const anotacaoEtapa = anotacoes[etapa.id];

                return (
                  <EtapaCard
                    etapa={etapa}
                    roadmap={roadmap}
                    setRoadmap={setRoadmap}
                    openDeleteModal={openDeleteModal}
                    anotacoes={anotacoes}
                    setAnotacoes={setAnotacoes}
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
    </View>
  ) : null;
}

const styles = StyleSheet.create({
  buttonWithIcon: {
    height: 48,
    backgroundColor: "white",
    alignSelf: "flex-start",
    paddingHorizontal: 0,
  },

  titulo: {
    fontSize: 28,
    fontWeight: 600,
    color: "black",
  },

  nivel: {
    fontSize: 18,
    color: "#5a5a5a",
  },

  descricao: {
    color: "#5a5a5a",
  },

  progressContainer: {
    height: 10,
    backgroundColor: "#333",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: colors.green,
  },

  progressText: {
    color: "#5a5a5a",
  },

  menu: {
    justifyContent: "space-between",
    gap: 12,
    flexDirection: "row",
    borderRadius: 12,
    padding: 4,
    backgroundColor: "#F1F5F9",
  },

  menuItem: {
    flex: 1,
    gap: 12,
    paddingVertical: 4,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  menuItemText: {
    fontWeight: 500,
  },

  menuItemSelecionado: {
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
    justifyContent: "space-between",
    backgroundColor: "white",
  },

  menuItemSelecionadoText: {},

  menuItemDesselecionado: {},

  menuItemDesselecionadoText: {
    color: "#777879",
  },

  adicionarNovoButton: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "lime",
    backgroundColor: colors.darkBlue,
    width: 200,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    borderRadius: 20,
  },
});
