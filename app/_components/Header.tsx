import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Menu, X, BookOpen } from "lucide-react-native";
import { router, usePathname } from "expo-router";
import { useAuth } from "../../context/auth";
import { pageNames } from "../../utils/pageNames";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  return (
    <View style={styles.header}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.logoContainer}
          onPress={() => {
            if (!isAuthenticated) router.push("/");
            if (isAuthenticated) {
              router.push({
                pathname: "/main",
                params: {
                  pageName: pageNames.roadmap.main,
                  subPage: pageNames.roadmap.criarRoadmap,
                },
              });
            }
          }}
        >
          <BookOpen size={26} color="#3D84F6" />

          <Text style={styles.logo}>StudyPath</Text>
        </TouchableOpacity>

        {pathname !== "/login" &&
          (!isAuthenticated ? (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.loginButton}
              onPress={async () => {
                await logout();
                router.push("/");
              }}
            >
              <Text style={styles.loginButtonText}>Logout</Text>
            </TouchableOpacity>
          ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 65,
    width: "100%",
    backgroundColor: "white",
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    paddingVertical: 14,
    alignItems: "center",
    paddingHorizontal: 40,
    justifyContent: "center",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    maxWidth: 1350,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  loginButton: {
    borderRadius: 8,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
  },
  loginButtonText: {
    color: "black",
    fontWeight: 600,
    fontSize: 16,
  },
});
