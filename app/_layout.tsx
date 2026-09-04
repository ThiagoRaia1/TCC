import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
// @ts-ignore - CSS modules are handled by the Expo/Metro bundler, not by TypeScript declarations.
import "../styles/global.css";
import { RoadmapProvider } from "../context/providers/roadmap";
import Header from "./_components/Header";
import { ScrollView } from "react-native";

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <RoadmapProvider>
          <Header />
          <ScrollView
            contentContainerStyle={{
              flexGrow: 1,
            }}
          >
            <Slot />
          </ScrollView>
        </RoadmapProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
