import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
import "../styles/global.css";
import { RoadmapProvider } from "../context/providers/roadmap";
import Header from "./_components/Header";

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <RoadmapProvider>
          <Header />
          <Slot />
        </RoadmapProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
