import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors } from "../styles/colors";

export default function LandingPage() {
  return (
    <LinearGradient colors={["#0f172a", "#1e293b"]} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* HERO */}
        <View style={styles.hero}>
          <Ionicons name="school-outline" size={70} color={colors.lightBlue} />

          <Text style={styles.title}>AI Teacher</Text>

          <Text style={styles.subtitle}>
            Seu professor inteligente disponível 24 horas por dia. Aprenda
            qualquer assunto com explicações claras, personalizadas e
            instantâneas.
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => router.push({ pathname: "/login" })}
            >
              <Text style={styles.primaryButtonText}>Começar a Aprender</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Ver Como Funciona</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* FEATURES */}
        <View style={styles.featuresContainer}>
          <Feature
            icon="flash-outline"
            title="Respostas Instantâneas"
            description="Tire dúvidas em segundos com explicações claras e diretas ao ponto."
          />

          <Feature
            icon="person-outline"
            title="Aprendizado Personalizado"
            description="O AI Teacher adapta as explicações ao seu nível e ritmo de estudo."
          />

          <Feature
            icon="book-outline"
            title="Vários Assuntos"
            description="Matemática, Programação, História, Ciências e muito mais em um só lugar."
          />

          <Feature
            icon="time-outline"
            title="Disponível 24/7"
            description="Estude quando quiser, sem horários ou limitações."
          />
        </View>

        {/* CALL TO ACTION */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Comece a evoluir seus estudos hoje mesmo!
          </Text>

          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push("/cadastrar")}
          >
            <Text style={styles.ctaButtonText}>Criar Conta Gratuita</Text>
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2026 AI Teacher — Todos os direitos reservados
          </Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

function Feature({ icon, title, description }: any) {
  return (
    <View style={styles.card}>
      <Ionicons name={icon} size={34} color={colors.lightBlue} />
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scroll: {
    padding: 24,
  },
  hero: {
    alignItems: "center",
    marginTop: 60,
    marginBottom: 60,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#ffffff",
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    color: "#cbd5e1",
    marginTop: 16,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 30,
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
    gap: 22,
  },
  card: {
    backgroundColor: "#1e293b",
    padding: 22,
    borderRadius: 22,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 14,
  },
  cardDescription: {
    fontSize: 14,
    color: "#94a3b8",
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
    color: "#ffffff",
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
