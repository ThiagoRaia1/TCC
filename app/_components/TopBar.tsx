import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Animated,
  Platform,
} from "react-native";
import { Entypo, Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { useAuth } from "../../context/auth";
import { router, useLocalSearchParams } from "expo-router";
import { useLoading } from "../../context/providers/loading";
import { pageNames } from "../../utils/pageNames";
import CriarRoadmapTitle from "./menuTitles/criarRoadmapTitle";
import MeusRoadmapsTitle from "./menuTitles/meusRoadmapsTitle";
import { colors } from "../../styles/colors";

type TopBarProps = {
  openSideBar: () => void;
};

export default function TopBar({ openSideBar }: TopBarProps) {
  const { showLoading, hideLoading } = useLoading();
  const { usuario, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const params = useLocalSearchParams();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const animationDuration = 200;

  const iconSize: number = 40;
  const titleTextColor: string = "white";

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: menuOpen ? 0 : -10,
        duration: animationDuration,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: menuOpen ? 1 : 0,
        duration: animationDuration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [menuOpen]);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <View style={styles.container}>
      <Pressable style={styles.titleContainer} onPress={openSideBar}>
        <Entypo name="menu" size={28} color={titleTextColor} />
        {params.subPage === pageNames.roadmap.criarRoadmap && (
          <CriarRoadmapTitle size={iconSize} color={titleTextColor} />
        )}

        {params.subPage === pageNames.roadmap.meusRoadmaps && (
          <MeusRoadmapsTitle size={iconSize} color={titleTextColor} />
        )}
      </Pressable>

      <Pressable
        style={styles.userButton}
        onPress={() => setMenuOpen((prev) => !prev)}
      >
        <Text style={styles.userName} selectable={false}>
          {(usuario && usuario.nome.trim().split(/\s+/)[0]) || "Carregando..."}
        </Text>
        <FontAwesome6 name="user-circle" size={42} color="white" />
        <Animated.View style={{ transform: [{ rotate }] }}>
          <Entypo name="chevron-down" size={24} color="white" />
        </Animated.View>
      </Pressable>

      {/* Dropdown flutuante */}
      <Animated.View
        pointerEvents={menuOpen ? "auto" : "none"}
        style={[
          styles.dropdown,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Pressable
          style={styles.option}
          onPress={() =>
            router.push({
              pathname: "/main",
              params: { pageName: pageNames.meuPerfil },
            })
          }
        >
          <Text style={styles.optionText} selectable={false}>
            Meu perfil
          </Text>
          <FontAwesome6 name="user" size={24} color="black" />
        </Pressable>

        <Pressable
          style={(state: any) => [
            styles.option,
            { backgroundColor: "#db2114" },
            Platform.OS === "web" &&
              state.hovered && { backgroundColor: "#b0091d" },
            state.pressed && { backgroundColor: "rgb(155, 21, 21)" },
          ]}
          onPress={async () => {
            try {
              showLoading();
              await logout();
              router.push("/");
            } catch (erro: any) {
              alert(erro.message);
            } finally {
              hideLoading();
            }
          }}
        >
          <Text
            style={[styles.optionText, { color: "white" }]}
            selectable={false}
          >
            Logout
          </Text>
          <Feather name="log-out" size={24} color={"white"} />
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 72,
    backgroundColor: colors.secundaryDarkBlue,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 32,
    zIndex: 50,
    borderBottomWidth: 1,
    borderBottomColor: colors.secundaryDarkBlueBorder,
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  userButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },

  userName: {
    fontSize: 18,
    fontWeight: "500",
    color: "#E2E8F0",
  },

  dropdown: {
    position: "absolute",
    top: 60,
    right: 40,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    minWidth: 220,
    zIndex: 999,
    borderColor: "#E2E8F0",
    boxShadow: "0px 5px 5px rgba(0, 0, 0, 0.6)",
  },

  option: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 8,
    ...Platform.select({
      web: {
        transitionDuration: "150ms",
      },
    }),
  },

  optionText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
  },
});
