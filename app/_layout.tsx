import { Slot } from "expo-router";
import { AuthProvider } from "../context/auth";
import { LoadingProvider } from "../context/providers/loading";

export default function Layout() {
  return (
    <AuthProvider>
      <LoadingProvider>
        <Slot />
      </LoadingProvider>
    </AuthProvider>
  );
}
