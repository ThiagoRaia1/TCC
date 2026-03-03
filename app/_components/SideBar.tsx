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
import { router, useLocalSearchParams } from "expo-router";
import { getGlobalStyles } from "../../styles/globalStyles";
import { useAuth } from "../../context/auth";
import { useRef, useState, useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MenuOptionButton from "./MenuOptionButton";
import { pageNames } from "../../utils/pageNames";
import MeusRoadmapsTitle from "./menuTitles/meusRoadmapsTitle";
import CriarRoadmapTitle from "./menuTitles/criarRoadmapTitle";

type SideBarProps = {
  visible: boolean;
  closeModal: () => void;
};

export default function SideBar({ closeModal, visible }: SideBarProps) {
  const { usuario } = useAuth();
  const menuIconSize: number = 26;
  const textMainColor: string = "#ffffff";
  const params = useLocalSearchParams();
  const globalStyles = getGlobalStyles();

  const opacity = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-120)).current;

  const [internalVisible, setInternalVisible] = useState(visible);

  useEffect(() => {
    if (visible) {
      setInternalVisible(true);

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: 0,
          duration: 220,
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
          toValue: -120,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setInternalVisible(false);
      });
    }
  }, [visible]);

  if (!internalVisible) return null;

  return (
    <Modal transparent visible={internalVisible} animationType="none">
      <Animated.View style={[styles.backdrop, { opacity }]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={closeModal} />

        <Animated.View
          style={[
            styles.sideBar,
            {
              transform: [{ translateX }],
            },
          ]}
        >
          <LinearGradient
            colors={["#0f172a", "#1e293b"]}
            style={styles.gradient}
          >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
              <Text style={styles.sectionTitle}>Operações</Text>

              <View style={styles.menuSection}>
                <MenuOptionButton
                  containerStyle={[
                    styles.menuButton,
                    params.subPage === pageNames.roadmap.criarRoadmap &&
                      styles.menuButtonActive,
                  ]}
                  labelStyle={styles.menuLabel}
                  label={
                    <CriarRoadmapTitle
                      size={menuIconSize}
                      color={
                        params.subPage === pageNames.roadmap.criarRoadmap
                          ? "#0f172a"
                          : "#38bdf8"
                      }
                    />
                  }
                  onPress={() => {
                    router.push({
                      pathname: "/main",
                      params: {
                        pageName: pageNames.roadmap.main,
                        subPage: pageNames.roadmap.criarRoadmap,
                      },
                    });
                  }}
                />

                <MenuOptionButton
                  containerStyle={[
                    styles.menuButton,
                    params.subPage === pageNames.roadmap.meusRoadmaps &&
                      styles.menuButtonActive,
                  ]}
                  labelStyle={styles.menuLabel}
                  label={
                    <MeusRoadmapsTitle
                      size={menuIconSize}
                      color={
                        params.subPage === pageNames.roadmap.meusRoadmaps
                          ? "#0f172a"
                          : "#38bdf8"
                      }
                    />
                  }
                  onPress={() => {
                    router.push({
                      pathname: "/main",
                      params: {
                        pageName: pageNames.roadmap.main,
                        subPage: pageNames.roadmap.meusRoadmaps,
                      },
                    });
                  }}
                />
              </View>

              <View style={{ marginTop: "auto" }}>
                <Text style={styles.version}>V0.6.0</Text>
              </View>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.65)",
    justifyContent: "center",
    alignItems: "flex-start",
  },

  sideBar: {
    width: "22%",
    minWidth: 260,
    height: "100%",
    borderTopRightRadius: 24,
    borderBottomRightRadius: 24,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },

  gradient: {
    flex: 1,
    padding: 20,
  },

  scrollViewContent: {
    flexGrow: 1,
  },

  sectionTitle: {
    color: "#94a3b8",
    fontSize: 14,
    marginBottom: 16,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  menuSection: {
    gap: 12,
  },

  menuButton: {
    backgroundColor: "#0f172a",
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },

  menuButtonActive: {
    backgroundColor: "#38bdf8",
    borderColor: "#38bdf8",
  },

  menuLabel: {
    color: "#38bdf8",
  },

  version: {
    color: "#64748b",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
  },
});
