import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

const mainTextColor = "white";

const styles = StyleSheet.create({
  topBarContainer: {
    height: 70,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "blue",
    paddingHorizontal: 24,
  },
  text: {
    color: mainTextColor,
    fontSize: 18,
    fontWeight: 600,
  },
  sides: {
    flex: 1,
    flexDirection: "row",
    gap: 30,
  },
  usernameIconContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  button: {
    minWidth: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    boxShadow: "0px 0px 5px rgba(0, 0, 0, 1)",
  },
});

export default function TopBar() {
  return (
    <View style={styles.topBarContainer}>
      {/* Lado Esquerdo */}
      <View style={[styles.sides, { justifyContent: "flex-start" }]}>
        <Text selectable={false} style={styles.text}>
          AI Teacher
        </Text>
      </View>
      {/* Lado Direito */}
      <View style={[styles.sides, { justifyContent: "flex-end" }]}>
        <TouchableOpacity style={styles.button}>
          <Text selectable={false} style={styles.text}>
            Criar
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button}>
          <Text selectable={false} style={styles.text}>
            Meus Roadmaps
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, styles.usernameIconContainer]}>
          <Text selectable={false} style={styles.text}>
            Username
          </Text>
          <FontAwesome6 name="user-circle" size={24} color={mainTextColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
