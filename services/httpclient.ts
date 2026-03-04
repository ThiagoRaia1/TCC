import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { io } from "socket.io-client";

export async function httpClient(endpoint: string, options: RequestInit) {
  const token = await AsyncStorage.getItem("token");

  const response = await fetch(
    `${process.env.EXPO_PUBLIC_BACKEND_API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    },
  );

  // Lê como texto primeiro
  const text = await response.text();

  // Se não tiver nada, vira null
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    if (response.status === 403) {
      router.push("/");
      throw new Error("Sessão expirada. Faça login novamente.");
    } else {
      throw new Error(data?.message || "Erro na requisição");
    }
  }

  return data;
}

// export const socket = io(process.env.EXPO_PUBLIC_BACKEND_API_URL);