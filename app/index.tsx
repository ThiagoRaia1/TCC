import React, { useActionState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import { router } from "expo-router";
import { colors } from "../styles/colors";
import Header from "./_components/Header";
import {
  Target,
  Zap,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
} from "lucide-react-native";
import { useAuth } from "../context/auth";

export default function LandingPage() {
  const { logout } = useAuth();

  useEffect(() => {
    logout();
  }, []);

  return (
    <>
      <Header />
      <ScrollView>
        {/* HERO */}
        <View style={styles.hero}>
          <ImageBackground
            source={{
              uri: "https://images.unsplash.com/photo-1686061592689-312bbfb5c055",
            }}
            style={styles.heroBackgroundImage}
          >
            <View style={styles.overlay} />
            <View style={styles.heroContent}>
              <Text style={styles.title}>
                Mapeie sua jornada{"\n"}
                no aprendizado
              </Text>

              <Text style={styles.subtitle}>
                Crie Roadmaps de estudo personalizados, rastreie seu progresso e
                {"\n"}
                conquiste seus objetivos de aprendizado com um caminho claro.
              </Text>

              <View style={styles.buttonRow}>
                <TouchableOpacity
                  style={styles.comeceAgoraButton}
                  onPress={() => router.push({ pathname: "/login" })}
                >
                  <Text style={styles.comeceAgoraButtonText}>
                    Começar a aprender
                  </Text>
                  <ArrowRight />
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </View>

        {/* FEATURES */}
        <View style={styles.featuresContainer}>
          <View style={styles.featuresRow}>
            <Feature
              icon={<Zap />}
              title="Respostas Instantâneas"
              description="Tire dúvidas em segundos com explicações claras e diretas ao ponto."
            />

            <Feature
              icon={<Target />}
              title="Crie roadmaps personalizados"
              description="Crie planos de aprendizagem personalizados, adaptados aos seus objetivos e ritmo"
            />
          </View>

          <View style={styles.featuresRow}>
            <Feature
              icon={<TrendingUp />}
              title="Rastreie seu progresso"
              description="Monitore as taxas de conclusão e mantenha-se motivado com indicadores visuais de progresso"
            />

            <Feature
              icon={<CheckCircle2 />}
              title="Gerencie seus passos"
              description="Divida tópicos complexos em etapas gerenciáveis ​​e marque-as conforme for aprendendo"
            />
          </View>

          {/* CALL TO ACTION */}
          {/* <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Comece a evoluir seus estudos hoje mesmo!
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/cadastrar")}
          >
            <Text style={styles.ctaButtonText}>Criar Conta Gratuita</Text>
          </TouchableOpacity>
        </View> */}
        </View>
      </ScrollView>
    </>
  );
}

function Feature({ icon, title, description }: any) {
  return (
    <View style={styles.card}>
      <View style={styles.cardIcon}>{icon}</View>

      <Text style={styles.cardTitle}>{title}</Text>

      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  hero: {
    height: "90%",
  },
  heroBackgroundImage: {
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  heroContent: {
    width: "100%",
    maxWidth: 1350,
    gap: 40,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.75)",
  },
  title: {
    fontSize: 60,
    fontWeight: "bold",
    color: "black",
    textAlign: "left",
    lineHeight: 50,
  },
  subtitle: {
    fontSize: 18,
    textAlign: "left",
    color: "#65758B",
    lineHeight: 24,
  },
  comeceAgoraButton: {
    flexDirection: "row",
    gap: 4,
    borderRadius: 10,
    backgroundColor: "#3D84F6",
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  comeceAgoraButtonText: {
    color: "white",
    fontWeight: 600,
    fontSize: 16,
    paddingVertical: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.lightBlue,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  primaryButtonText: {
    color: "#0f172a",
    fontWeight: "bold",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: colors.lightBlue,
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  secondaryButtonText: {
    color: colors.lightBlue,
    fontWeight: "bold",
  },
  featuresContainer: {
    gap: 20,
    maxWidth: 1200,
    alignSelf: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  featuresRow: {
    flexWrap: "wrap",
    flexDirection: "row",
    gap: 20,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 430,
    height: 222,
    justifyContent: "space-evenly",
    padding: 22,
    borderRadius: 22,
    // boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.2)",
    borderWidth: 1,
    borderColor: "#ddd",
    boxShadow: "0px 0px 4px rgba(0, 0, 0, 0.2)",
  },
  cardIcon: {
    width: 56,
    height: 56,

    borderRadius: 16,

    backgroundColor: "#89b5fc2f",
    color: "#3D84F6",

    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "black",
    marginTop: 14,
  },
  cardDescription: {
    fontSize: 16,
    color: "#7e899b",
    marginTop: 8,
    lineHeight: 20,
  },
  ctaSection: {
    marginTop: 60,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  ctaButton: {
    backgroundColor: "#22d3ee",
    marginTop: 20,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 25,
  },
  ctaButtonText: {
    color: "#0f172a",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 80,
    alignItems: "center",
  },
  footerText: {
    fontSize: 12,
    color: "#64748b",
  },
});
