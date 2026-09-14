import { Slot } from "expo-router";
import { AuthProvider, useAuth } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
// @ts-ignore - CSS modules are handled by the Expo/Metro bundler, not by TypeScript declarations.
import "../styles/global.css";
import { RoadmapProvider } from "../context/providers/roadmap";
import Header from "./_components/Header";
import { ScrollView } from "react-native";
import Pomodoro from "./_components/Pomodoro";

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
          <LayoutContent />
        </RoadmapProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
