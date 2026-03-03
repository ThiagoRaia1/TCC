import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  Platform,
  Pressable,
  Animated,
  Modal,
} from "react-native";
import { colors } from "../../colors";
import {
  Feather,
  MaterialIcons,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome6,
  AntDesign,
} from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { getGlobalStyles } from "../../globalStyles";
import { useAuth } from "../../context/auth";
import { useRef, useState, useEffect } from "react";
import MenuOptionButton from "./MenuOptionButton";

type SideBarProps = {
  visible: boolean;
  closeModal: () => void;
};

export default function SideBar({ closeModal, visible }: SideBarProps) {
  const { usuario } = useAuth();
  const menuIconSize: number = 28;
  const textMainColor: string = "white";
  const params = useLocalSearchParams();

  const globalStyles = getGlobalStyles();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-100)).current;

  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false); // desmonta só depois
      });
    }
  }, [visible]);

  const styles = StyleSheet.create({
    sideBar: {
      position: "absolute",
      zIndex: 999,
      width: "20%",
      height: "100%",
      backgroundColor: colors.blue,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.6)",
      justifyContent: "center", // vertical
      alignItems: "flex-start", // horizontal
    },
    logo: {
      width: "100%",
      height: "10%",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "white",
    },
    logoImage: {
      width: "90%",
      height: "90%",
    },
    scrollViewContent: {
      flexGrow: 1,
      padding: 12,
    },
    menuSection: {
      padding: 12,
      gap: 6,
    },
    menuSectionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 5,
    },
    menuOptionLabel: {
      color: textMainColor,
      fontSize: 18,
      fontWeight: 600,
    },
    menuIcon: {
      color: textMainColor,
    },
    logoutButton: {
      width: "90%",
      alignSelf: "center",
      marginTop: "auto",
      backgroundColor: "#db2114",
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingVertical: 12,
      padding: 24,
      borderRadius: 12,
      gap: 12,
      ...Platform.select({
        web: {
          transitionDuration: "150ms",
        },
      }),
    },
    version: {
      color: textMainColor,
      textAlign: "center",
      opacity: 0.7,
    },
  });

  if (!internalVisible) return null;

  return (
    <Modal transparent visible={internalVisible} animationType="none">
      <Animated.View
        style={[
          styles.backdrop,
          {
            opacity, // anima o fundo também
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />
        <Animated.View
          style={[
            styles.sideBar,
            {
              opacity,
              transform: [{ translateX }],
            },
          ]}
        >
          <ScrollView contentContainerStyle={styles.scrollViewContent}>
            {/* Principal */}

            {/* Operações */}
            <View style={styles.menuSection}>
              <Text style={styles.menuSectionLabel} selectable={false}>
                Operações
              </Text>

              {/* Nova carga */}
              {(usuario?.nivelDeAcesso === 1 ||
                usuario?.nivelDeAcesso === 2) && (
                <MenuOptionButton
                  containerStyle={[
                    globalStyles.menuOption,
                    {
                      backgroundColor:
                        params.subPage === "novaCarga"
                          ? textMainColor
                          : colors.blue,
                    },
                  ]}
                  hoverStyle={[
                    params.subPage === "novaCarga"
                      ? {}
                      : { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                  pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                  labelStyle={[
                    styles.menuOptionLabel,
                    {
                      color:
                        params.subPage === "novaCarga"
                          ? colors.blue
                          : textMainColor,
                    },
                  ]}
                  label="Nova carga"
                  icon={
                    <MaterialIcons
                      name="add-circle-outline"
                      size={menuIconSize}
                      color={
                        params.subPage === "novaCarga"
                          ? colors.blue
                          : textMainColor
                      }
                    />
                  }
                  onPress={() => {
                    console.log("Nova carga");
                    router.push({
                      pathname: "/main",
                      params: {
                        pageName: "operacoes",
                        subPage: "novaCarga",
                      },
                    });
                  }}
                />
              )}

              {/* Criar roadmap */}
              <MenuOptionButton
                containerStyle={[
                  globalStyles.menuOption,
                  {
                    backgroundColor:
                      params.subPage === "cargas" ? textMainColor : colors.blue,
                  },
                ]}
                hoverStyle={[
                  params.subPage === "cargas"
                    ? {}
                    : { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
                pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                labelStyle={[
                  styles.menuOptionLabel,
                  {
                    color:
                      params.subPage === "cargas" ? colors.blue : textMainColor,
                  },
                ]}
                label="Criar Roadmap"
                icon={
                  <AntDesign
                    name="folder-add"
                    size={menuIconSize}
                    color={
                      params.subPage === "novaCarga"
                        ? colors.blue
                        : textMainColor
                    }
                  />
                }
                onPress={() => {
                  console.log("Meus Roadmaps");
                  router.push({
                    pathname: "/main",
                    params: {
                      pageName: "roadmaps",
                      subPage: "criarRoadmap",
                    },
                  });
                }}
              />

              {/* Meus roadmaps */}
              <MenuOptionButton
                containerStyle={[
                  globalStyles.menuOption,
                  {
                    backgroundColor:
                      params.subPage === "cargas" ? textMainColor : colors.blue,
                  },
                ]}
                hoverStyle={[
                  params.subPage === "cargas"
                    ? {}
                    : { backgroundColor: "rgba(255,255,255,0.2)" },
                ]}
                pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                labelStyle={[
                  styles.menuOptionLabel,
                  {
                    color:
                      params.subPage === "cargas" ? colors.blue : textMainColor,
                  },
                ]}
                label="Meus Roadmaps"
                icon={
                  <FontAwesome6
                    name="sitemap"
                    size={menuIconSize}
                    color={
                      params.subPage === "novaCarga"
                        ? colors.blue
                        : textMainColor
                    }
                  />
                }
                onPress={() => {
                  console.log("Meus Roadmaps");
                  router.push({
                    pathname: "/main",
                    params: {
                      pageName: "roadmaps",
                      subPage: "meusRoadmaps",
                    },
                  });
                }}
              />
            </View>

            {usuario?.nivelDeAcesso === 1 && (
              <>
                {/* Cadastros */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionLabel} selectable={false}>
                    Cadastros
                  </Text>

                  {/* Motoristas */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "motoristas"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "motoristas"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "motoristas"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Motoristas"
                    icon={
                      <FontAwesome
                        name="drivers-license-o"
                        size={menuIconSize}
                        color={
                          params.subPage === "motoristas"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      console.log("Motoristas");
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "cadastros",
                          subPage: "motoristas",
                        },
                      });
                    }}
                  />

                  {/* Clientes */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "clientes"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "clientes"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "clientes"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Clientes"
                    icon={
                      <MaterialCommunityIcons
                        name="office-building-outline"
                        size={menuIconSize}
                        color={
                          params.subPage === "clientes"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      console.log("Clientes");
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "cadastros",
                          subPage: "clientes",
                        },
                      });
                    }}
                  />

                  {/* Veículos */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "veiculos"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "veiculos"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "veiculos"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Veículos"
                    icon={
                      <MaterialCommunityIcons
                        name="truck-outline"
                        size={menuIconSize}
                        color={
                          params.subPage === "veiculos"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      console.log("Motoristas");
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "cadastros",
                          subPage: "veiculos",
                        },
                      });
                    }}
                  />
                </View>

                {/* Relatórios */}
                <View style={styles.menuSection}>
                  <Text style={styles.menuSectionLabel} selectable={false}>
                    Relatórios
                  </Text>

                  {/* PDF */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "pdf"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "pdf"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "pdf"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="PDF"
                    icon={
                      <FontAwesome6
                        name="file-pdf"
                        size={menuIconSize}
                        color={
                          params.subPage === "pdf" ? colors.blue : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      console.log("PDF");
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "relatorios",
                          subPage: "pdf",
                        },
                      });
                    }}
                  />

                  {/* Excel */}
                  <MenuOptionButton
                    containerStyle={[
                      globalStyles.menuOption,
                      {
                        backgroundColor:
                          params.subPage === "excel"
                            ? textMainColor
                            : colors.blue,
                      },
                    ]}
                    hoverStyle={[
                      params.subPage === "excel"
                        ? {}
                        : { backgroundColor: "rgba(255,255,255,0.2)" },
                    ]}
                    pressedStyle={{ backgroundColor: "rgba(255,255,255,0.5)" }}
                    labelStyle={[
                      styles.menuOptionLabel,
                      {
                        color:
                          params.subPage === "excel"
                            ? colors.blue
                            : textMainColor,
                      },
                    ]}
                    label="Excel"
                    icon={
                      <MaterialCommunityIcons
                        name="microsoft-excel"
                        size={menuIconSize}
                        color={
                          params.subPage === "excel"
                            ? colors.blue
                            : textMainColor
                        }
                      />
                    }
                    onPress={() => {
                      console.log("Excel");
                      router.push({
                        pathname: "/main",
                        params: {
                          pageName: "relatorios",
                          subPage: "excel",
                        },
                      });
                    }}
                  />
                </View>
              </>
            )}

            <Text
              style={[styles.version, { marginTop: "auto" }]}
              selectable={false}
            >
              {usuario?.nivelDeAcesso === 1
                ? "ADM"
                : usuario?.nivelDeAcesso === 2
                  ? "EDIT"
                  : usuario?.nivelDeAcesso === 3
                    ? "VIEW"
                    : ""}
            </Text>
            <Text style={styles.version} selectable={false}>
              V0.3.0
            </Text>
          </ScrollView>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
