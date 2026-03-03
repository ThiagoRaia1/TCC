import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";
import "../styles/global.css";

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Slot />
      </LoadingProvider>
    </AuthProvider>
  );
}
