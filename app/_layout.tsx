import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
// @ts-ignore - CSS modules are handled by the Expo/Metro bundler, not by TypeScript declarations.
import "../styles/global.css";
import { RoadmapProvider } from "../context/providers/roadmap";
import Header from "./_components/Header";
import { ScrollView } from "react-native";
import Pomodoro from "./_components/Pomodoro";
import { ResultadoQuizProvider } from "../context/providers/resultadoQuiz";

function LayoutContent() {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Header />

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
        }}
        style={{
          backgroundColor: "#F8F9FA",
        }}
      >
        <Slot />
      </ScrollView>

      {isAuthenticated && <Pomodoro />}
    </>
  );
}

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <RoadmapProvider>
          <ResultadoQuizProvider>
            <LayoutContent />
          </ResultadoQuizProvider>
        </RoadmapProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
