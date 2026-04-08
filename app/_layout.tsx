import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
import "../styles/global.css";
import { RoadmapProvider } from "../context/providers/roadmap";

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <RoadmapProvider>
          <Slot />
        </RoadmapProvider>
      </LoadingProvider>
    </AuthProvider>
  );
}
